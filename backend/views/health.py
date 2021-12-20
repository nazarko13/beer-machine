from logging import getLogger

import peewee
from flask import request, jsonify
from flask.views import MethodView
from playhouse.shortcuts import dict_to_model

# from models import Trays, Employees
from utils import read_settings

logger = getLogger(__name__)
# TERMINAL_NUMBER = read_settings()['COMMON']['terminal_number']
# OPEN_LOCK_STATE = 'close' if read_settings()['CONTROL_BOARD']['inverse_locks'] else 'open'
# RECIPIENT = read_settings()['COMMON']['recipient_email']


class HealthView(MethodView):
    def get(self):
        return jsonify({'description': 'OK'})

        # return jsonify({"description": "Something goes wrong"}), 400

