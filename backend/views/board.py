from flask import jsonify, request
from flask.views import MethodView
from marshmallow import ValidationError

from devices.beer_board import BoardError, BoardInteractionInterface
from devices.constants import Actuators
from schemas.board import SystemStatusOutput, SystemActionInput
from views.constants import SystemActions


def get_s_s():
    return {
        'V': '23.921', 'A': '0.079', 'DoorSensor': '1', 'Actuators_state': '[0000]', 'Temp_1': '17.1',
        'Temp_2': '17.1', 'Press_1': '0', 'Press_2': '17', 'Count_1': '0', 'Count_2': '0', 'Count_3': '0',
        'Count_4': '0.'
    }


def get_s_2():
    return {
        'voltage': '23.921', 'amperes': '0.079', 'door_sensor': True, 'actuators_state': '[0000]',
        'temp_in_system': '17.1',
        'pressure_in_system': "12131", 'beer_counter_1': '0', 'beer_counter_2': '0', 'beer_counter_3': '0',
        'beer_counter_4': '0'
    }


class SystemStatusView(MethodView):
    def get(self):
        # TODO handle requests
        system_status = SystemStatusOutput.Schema().dump(get_s_2())
        if not system_status:
            return jsonify({'description': 'Could not get system status'}), 400

        return jsonify(system_status)


class SystemConfigurationView(MethodView):
    def post(self):
        try:
            action = SystemActionInput.Schema().load(request.json).action
        except ValidationError as e:
            return jsonify({"description": str(e), "error": "Validation error"}), 400
        try:
            if action == SystemActions.DEFAULT_STATE:
                BoardInteractionInterface.set_initial_actuators_state()
            elif action == SystemActions.CLOSE_DOOR:
                BoardInteractionInterface.close_door()
            elif action == SystemActions.OPEN_DOOR:
                BoardInteractionInterface.open_door()
            elif action == SystemActions.PRESSURE_VALVE_OPEN:
                BoardInteractionInterface.pressure_valve_start()
            elif action == SystemActions.PRESSURE_VALVE_CLOSE:
                BoardInteractionInterface.pressure_valve_stop()
            elif action == SystemActions.WATER_OPEN:
                BoardInteractionInterface.water_start()
            elif action == SystemActions.WATER_CLOSE:
                BoardInteractionInterface.water_stop()
            elif action == SystemActions.INTAKE_AIR_OPEN:
                BoardInteractionInterface.intake_air_start()
            elif action == SystemActions.INTAKE_AIR_CLOSE:
                BoardInteractionInterface.intake_air_stop()
            elif action == SystemActions.BEER_1_OPEN:
                BoardInteractionInterface.beer_pour_start(Actuators.BEER_KEG_1)
            elif action == SystemActions.BEER_1_CLOSE:
                BoardInteractionInterface.beer_pour_stop(Actuators.BEER_KEG_1)
            elif action == SystemActions.BEER_2_OPEN:
                BoardInteractionInterface.beer_pour_start(Actuators.BEER_KEG_2)
            elif action == SystemActions.BEER_2_CLOSE:
                BoardInteractionInterface.beer_pour_stop(Actuators.BEER_KEG_2)
            elif action == SystemActions.RESET_COUNTERS:
                BoardInteractionInterface.reset_counters()
            else:
                return jsonify({"description": "Could not find proper action", "error": "Validation error"}), 400
            return jsonify({'status': 'success'}), 200
        except BoardError as e:
            return jsonify({'error': e, 'description': 'Could not start action'}), 400
