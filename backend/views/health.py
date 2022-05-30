from logging import getLogger

from flask import jsonify
from flask.views import MethodView

logger = getLogger(__name__)


class HealthView(MethodView):
    def get(self):
        logger.info("HEALTH ENDPOINT. GET.")
        return jsonify({'description': 'OK'})
