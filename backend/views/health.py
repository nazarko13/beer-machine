from logging import getLogger

from flask import jsonify
from flask.views import MethodView

logger = getLogger(__name__)


class HealthView(MethodView):
    def get(self):
        return jsonify({'description': 'OK'})

        # return jsonify({"description": "Something goes wrong"}), 400
