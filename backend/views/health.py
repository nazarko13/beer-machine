from logging import getLogger

from flask import jsonify
from flask.views import MethodView

logger = getLogger(__name__)


class HealthView(MethodView):
    def get(self):
        # TODO sync about logic for health
        return jsonify({'description': 'OK'})
