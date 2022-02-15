from logging import getLogger

from flask import Flask
from flask_cors import CORS
from loggers import setup_logging

setup_logging()
logger = getLogger(__name__)

from views.board import SystemStatusView, SystemConfigurationView
from models.models import init_database, create_database
from settings import API_PREFIX
from views.beer import BeerActiveView, BeerPourView, BeerView, BeerPourStatus, BeerSystemCleaning
from views.employee import EmployeeView
from views.health import HealthView

app = Flask(__name__, static_folder='build', static_url_path='/')

init_database()
create_database()

CORS(app, resources={r"/*": {"origins": "*"}})

app.add_url_rule(API_PREFIX + '/health', view_func=HealthView.as_view('health_view'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/admin', view_func=EmployeeView.as_view('employee_view'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/beer', view_func=BeerView.as_view('beer_view'), methods=["GET", "PUT"])
app.add_url_rule(API_PREFIX + '/beer/active', view_func=BeerActiveView.as_view('beer_active_view'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/beer/pour', view_func=BeerPourView.as_view('beer_pour_view'), methods=["POST"])
app.add_url_rule(API_PREFIX + '/beer/pour/status', view_func=BeerPourStatus.as_view('pour_state_view'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/cleaning', view_func=BeerSystemCleaning.as_view('cleaning_view'), methods=["POST"])
app.add_url_rule(API_PREFIX + '/system/status', view_func=SystemStatusView.as_view('system_status'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/system', view_func=SystemConfigurationView.as_view('system_config'), methods=["POST"])


@app.route('/')
def index():
    return app.send_static_file('index.html')


# TODO 1. board integration                                     Done
# TODO 2. printer integration
# TODO 3. extend logger and check if it works properly          Done
# TODO 4. build and deploy UI to real hardware                  Done
# TODO 5. Add beer_keg in ADMIN panel
# TODO 6. Add barcode for SUPER ADMIN
# TODO 7. Add possibility to enter beer description             Not now
# TODO 8. Add possibility to enter beer amount
# TODO 9. Automatically save date of new beer if value changed
# TODO 10. Add minus operation if beer was poured
# TODO 11. Change beer status to inactive if amount of beer==1
#


if __name__ == '__main__':
    logger.info("ALS is running...")
    app.run(host='0.0.0.0', port=9000)
