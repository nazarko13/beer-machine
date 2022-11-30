import json
from logging import getLogger

from flask import jsonify, request
from flask.views import MethodView
from marshmallow import ValidationError

from models.models import SystemSettings
from schemas.system_settings import SystemSettingsSchema

logger = getLogger(__name__)


class SystemSettingsView(MethodView):
    def get(self):
        logger.info("HEALTH SYSTEM SETTINGS VIEW. GET.")
        return jsonify(json.loads(SystemSettings.get_first().config))

    def put(self):
        try:
            SystemSettingsSchema.Schema().load(request.json)
        except ValidationError as e:
            return jsonify({"description": str(e), "error": "Validation error"}), 400
        # TODO rewrite this logic
        query = SystemSettings.update(config=json.dumps(request.json)).where(SystemSettings.id == 1)
        query.execute()
        logger.info(f"HEALTH SYSTEM SETTINGS VIEW. PUT. Settings updated to {request.json}")
        return jsonify({'description': 'OK'})
