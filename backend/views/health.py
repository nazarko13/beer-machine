from logging import getLogger

from flask import jsonify
from flask.views import MethodView

from devices.beer_board import BoardInteractionInterface

logger = getLogger(__name__)


class HealthView(MethodView):
    def get(self):
        logger.info("HEALTH ENDPOINT. GET.")
        BoardInteractionInterface.is_temp_in_cooler_ok()
        return jsonify({'description': 'OK'})
