from flask import jsonify, request
from flask.views import MethodView

from models.models import Employees
from schemas.beer import EmployeesSchema


class EmployeeView(MethodView):
    def get(self):
        password = request.args.get("password")
        login = request.args.get("login")
        if password and login:
            employee = EmployeesSchema.Schema(many=True).dump(Employees.get_by_login_and_password(login, password))
            if employee:
                # logger.info("Admin with code {} logged in".format(auth_code))
                return jsonify(employee[0])
            else:
                return jsonify({'description': 'Incorrect login adn password'}), 400
        return jsonify({'description': 'login and password fields are required'}), 400
