from flask import jsonify, request
from flask.views import MethodView

from models.models import Employees


class EmployeeView(MethodView):
    def get(self):
        password = request.args.get("password")
        login = request.args.get("login")
        if password and login:
            employee = list(Employees.get_by_login_and_password(login, password))
            if employee:
                # logger.info("Admin with code {} logged in".format(auth_code))
                return jsonify(employee[0])
            else:
                return jsonify({'description': 'Incorrect login adn password'}), 400
        return jsonify({'description': 'login and password fields are required'}), 400
