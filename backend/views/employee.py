from logging import getLogger

from flask import jsonify, request
from flask.views import MethodView

from models.models import Employees
from schemas.employee import EmployeesSchema

logger = getLogger(__name__)


class EmployeeView(MethodView):
    def get(self):
        password = request.args.get("password")
        login = request.args.get("login")
        if password and login:
            employee = EmployeesSchema.Schema(many=True).dump(Employees.get_by_login_and_password(login, password))
            if employee:
                logger.info(f"EMPLOYEE. Admin with login '{login}' logged in")
                return jsonify(employee[0])
            else:
                logger.info(f"EMPLOYEE. Incorrect login '{login}' or password '{password}'.")
                return jsonify({'description': 'Incorrect login or password'}), 400
        return jsonify({'description': 'login and password fields are required'}), 400
