from flask import jsonify, request
from flask.views import MethodView
from marshmallow import ValidationError

from devices.beer_board import BoardError, BoardInteractionInterface
from devices.constants import Actuators
from schemas.board import SystemStatusOutput, SystemActionInput
from views.constants import SystemActions


class SystemStatusView(MethodView):
    def get(self):
        try:
            res = BoardInteractionInterface.get_system_status()
            system_status = SystemStatusOutput.Schema().dump(res)
            return jsonify(system_status)
        except BoardError:
            return jsonify({'description': 'Could not get system status'}), 400


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
            elif action == SystemActions.AIR_OPEN:
                BoardInteractionInterface.air_pressure_start()
            elif action == SystemActions.AIR_CLOSE:
                BoardInteractionInterface.air_pressure_stop()
            else:
                return jsonify({"description": "Could not find proper action", "error": "Validation error"}), 400
            return jsonify({'status': 'success'}), 200
        except BoardError as e:
            return jsonify({'error': e, 'description': 'Could not start action'}), 400
