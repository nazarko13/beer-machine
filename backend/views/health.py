from logging import getLogger

from flask import jsonify
from flask.views import MethodView

from devices.beer_board import BoardInteractionInterface

logger = getLogger(__name__)


class HealthView(MethodView):
    def get(self):
        if not BoardInteractionInterface.is_temp_in_cooler_ok():
            logger.info("HEALTH ENDPOINT. GET. Temperature in cooler is not in range")
            return jsonify({"description": "Temperature in cooler is not in range", "error": "Cooler temp error"}), 400
        logger.info("HEALTH ENDPOINT. GET.")
        return jsonify({'description': 'OK'})
