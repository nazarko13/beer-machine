from logging import getLogger

from flask import Flask
from flask_cors import CORS

from loggers import setup_logging
from models.models import init_database, create_database
from settings import API_PREFIX
from views.beer import BeerActiveView, BeerPourView, BeerView
from views.employee import EmployeeView
from views.health import HealthView

setup_logging()
logger = getLogger(__name__)

app = Flask(__name__)

init_database()
create_database()

CORS(app, resources={r"/*": {"origins": "*"}})

app.add_url_rule(API_PREFIX + '/health', view_func=HealthView.as_view('health_view'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/admin', view_func=EmployeeView.as_view('employee_view'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/beer', view_func=BeerView.as_view('beer_view'), methods=["GET", "PUT"])
app.add_url_rule(API_PREFIX + '/beer/active', view_func=BeerActiveView.as_view('beer_active_view'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/beer/pour', view_func=BeerPourView.as_view('beer_pour_view'), methods=["POST"])
# app.add_url_rule(
#     API_PREFIX + '/employees/<auth_code>',
#     view_func=EmployeeView.as_view('employee_view'),
#     methods=['GET', 'DELETE']
# )

# app.add_url_rule(API_PREFIX + '/trays/<id>', view_func=TrayView.as_view('tray_view'), methods=['PATCH'])
#
if __name__ == '__main__':
    logger.info("ALS is running...")
    app.run(host='0.0.0.0', port=9000)
