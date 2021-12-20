from logging import getLogger
from random import choice
from threading import Timer

import peewee
from flask import request, jsonify
from flask.views import MethodView
from playhouse.shortcuts import dict_to_model, model_to_dict

from controllock import BoardInteractionInterface
from models import Trays, Employees
from settings import LOCK_BLOCKED_TIMEOUT
from utils import read_settings

logger = getLogger(__name__)
TERMINAL_NUMBER = read_settings()['COMMON']['terminal_number']
OPEN_LOCK_STATE = 'close' if read_settings()['CONTROL_BOARD']['inverse_locks'] else 'open'
RECIPIENT = read_settings()['COMMON']['recipient_email']


class EmployeeView(MethodView):
    def get(self, auth_code=None):
        if auth_code:
            employee = list(Employees.get_by_auth_code(auth_code))
            if employee:
                logger.info("Admin with code {} logged in".format(auth_code))
                return jsonify(employee[0])
            else:
                return jsonify({'description': 'No such employee'}), 404
        else:
            return jsonify({"employees": list(Employees.get_all())})

    def post(self):
        try:
            if Trays.select().where(Trays.authCode == request.get_json()['password']).exists():
                return jsonify({'description': 'Password duplicates tray authcode'}), 400
            Employees.save(dict_to_model(Employees, request.get_json()))
        except KeyError:
            return jsonify({'description': 'Missing required field `password`'}), 400
        except TypeError:
            return jsonify({'description': "Format of provided data is invalid"}), 400
        except AttributeError:
            return jsonify({'description': 'Invalid data'}), 400
        except peewee.IntegrityError:
            return jsonify({'description': 'Employee with current auth_code already exists'}), 400
        return jsonify({'description': 'Employee created'}), 201

    def patch(self):
        emp = request.get_json()
        try:
            if Employees.update(password=emp['password'], name=emp['name']).where(
                    Employees.id == emp['id']).execute() == 0:
                return jsonify({'description': 'Employee with current id not found'}), 400
        except peewee.IntegrityError:
            return jsonify({'description': 'Employee with current auth_code already exists'}), 400
        return jsonify({'description': 'Employee updated'}), 200

    def delete(self, auth_code=None):
        if not auth_code:
            return jsonify({'description': 'Missing employee\'s password'}), 404

        if not Employees.delete().where(Employees.password == auth_code).execute():
            return jsonify({'description': 'No such employee'}), 404

        return jsonify({'description': 'Employee deleted'}), 200


class TrayView(MethodView):

    active_timers = {}

    def get(self):
        state = request.args.get('state')
        size = request.args.get('size')

        state_condition = Trays.state == state if state else True
        size_condition = Trays.size == size if size else True
        trays = Trays.select().where(state_condition & size_condition)
        res = [model_to_dict(tray) for tray in trays]
        return jsonify({"trays": res})

    def post(self):
        try:
            tray_size = request.json.get('size')
            auth_code = request.json.get('auth_code')
        except AttributeError:
            return jsonify({'description': "Format of provided data is invalid"}), 400
        except TypeError:
            return jsonify({'description': "Format of provided data is invalid"}), 400

        size_match = Trays.size == tray_size
        free_trays = [model_to_dict(el) for el in Trays.select().where((Trays.state == "opened") & size_match)] or \
                     [model_to_dict(el) for el in Trays.select().where((Trays.state == "free") & size_match)]
        if not free_trays:
            return jsonify({'description': 'No free tray'}), 403

        tray = choice(free_trays)
        tray_id, board, pos = tray["id"], tray["boardId"], tray['lockId']

        Trays.update(state='occupied', authCode=auth_code).where(Trays.id == tray_id).execute()
        logger.info("Tray #{} became occupied, code - {}".format(tray_id, auth_code))
        BoardInteractionInterface.open_board_lock(board, pos)
        BoardInteractionInterface.close_board_lock(board, pos)

        TrayView.launch_timer(tray_id, board, pos)

        return jsonify({'tray_id': tray_id}), 201

    def patch(self, id=None):
        input_json = request.json or {}
        state = input_json.get('state')

        if id:
            if state:
                condition = Trays.id == id
                Trays.update(state=state, authCode=None).where(condition).execute()
                logger.info("Tray #{} now in state {}".format(id, state))
                tray = [model_to_dict(tray) for tray in Trays.select().where(condition)][0]
                board, pos = tray['boardId'], tray['lockId']

                BoardInteractionInterface.open_board_lock(board, pos)
                if state == "free":
                    BoardInteractionInterface.close_board_lock(board, pos)
                return jsonify({'description': "success"})
            else:
                return jsonify({'description': "Missed required field `state`"}), 404
        else:
            condition = Trays.state != 'blocked'
            occupied_trays = [model_to_dict(tray) for tray in Trays.select().where(condition)]
            Trays.update(state='free', authCode=None).where(condition).execute()
            for tray in occupied_trays:
                board, pos = tray['boardId'], tray['lockId']
                logger.info("Tray #{} now in state free".format(tray['id']))
                BoardInteractionInterface.open_board_lock(board, pos)
                BoardInteractionInterface.close_board_lock(board, pos)

        return jsonify({'status': 'success'}), 200

    def delete(self):
        try:
            auth_code = request.json.get('auth_code')
        except AttributeError:
            return jsonify({'description': "Format of provided data is invalid"}), 400
        except TypeError:
            return jsonify({'description': "Format of provided data is invalid"}), 400
        if not auth_code:
            return jsonify({"description": "Format of provided data is invalid"}), 400
        res = [model_to_dict(tray) for tray in Trays.select().where(Trays.authCode == auth_code)]
        if not res:
            return jsonify({"description": "Auth code is not valid"}), 400
        tray = res[0]
        tray_id, board, pos = tray['id'], tray['boardId'], tray['lockId']

        logger.info("Tray #{} has been opened with code {}".format(tray["id"], auth_code))
        BoardInteractionInterface.open_board_lock(board, pos)
        BoardInteractionInterface.close_board_lock(board, pos)

        TrayView.launch_timer(tray_id, board, pos)

        Trays.update(authCode=None, state="free").where(Trays.id == tray_id).execute()

        return jsonify({'status': 'success', 'tray_id': tray_id}), 200

    @classmethod
    def launch_timer(cls, tray_id, board, pos):
        if tray_id in TrayView.active_timers and TrayView.active_timers[tray_id].is_alive():
            TrayView.active_timers[tray_id].cancel()
        TrayView.active_timers[tray_id] = Timer(
            LOCK_BLOCKED_TIMEOUT,
            lambda: [
                logger.info("Tray #{} has been opened by timeout".format(tray_id)),
                BoardInteractionInterface.open_board_lock(board, pos),
                Trays.update(state='opened', authCode=None).where(Trays.id == tray_id).execute()
            ] if BoardInteractionInterface.get_status_lock(board, pos) == OPEN_LOCK_STATE else None
        )
        TrayView.active_timers[tray_id].start()
