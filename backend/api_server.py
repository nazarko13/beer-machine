from logging import getLogger

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask
from flask_cors import CORS

from export.statistics_export import send_statistics
from loggers import setup_logging
from views.system_settings import SystemSettingsView

setup_logging()
logger = getLogger(__name__)

from views.board import SystemStatusView, SystemConfigurationView, SystemSanitization
from models.models import init_database, create_database
from settings import API_PREFIX, CRON_HOUR, CRON_MINUTE
from views.beer import BeerActiveView, BeerPourView, BeerView, BeerPourStatus, BeerSystemCleaning, PrinterView, \
    BeerPourTestView
from views.employee import EmployeeView
from views.health import HealthView

app = Flask(__name__, static_folder='build', static_url_path='/')

init_database()
create_database()

scheduler = BackgroundScheduler(daemon=True)
scheduler.add_job(send_statistics, 'cron', hour=CRON_HOUR, minute=CRON_MINUTE)
scheduler.start()

CORS(app, resources={r"/*": {"origins": "*"}})

app.add_url_rule(API_PREFIX + '/health', view_func=HealthView.as_view('health_view'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/admin', view_func=EmployeeView.as_view('employee_view'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/beer', view_func=BeerView.as_view('beer_view'), methods=["GET", "PUT", "POST"])
app.add_url_rule(API_PREFIX + '/beer/active', view_func=BeerActiveView.as_view('beer_active_view'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/beer/pour', view_func=BeerPourView.as_view('beer_pour_view'), methods=["POST"])
app.add_url_rule(API_PREFIX + '/beer/pour/test', view_func=BeerPourTestView.as_view('beer_test_pour_view'),
                 methods=["POST"])
app.add_url_rule(API_PREFIX + '/beer/pour/status', view_func=BeerPourStatus.as_view('pour_state_view'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/cleaning', view_func=BeerSystemCleaning.as_view('cleaning_view'), methods=["POST"])
app.add_url_rule(API_PREFIX + '/system/status', view_func=SystemStatusView.as_view('system_status'), methods=["GET"])
app.add_url_rule(API_PREFIX + '/system', view_func=SystemConfigurationView.as_view('system_config'), methods=["POST"])
app.add_url_rule(API_PREFIX + '/sanitization', view_func=SystemSanitization.as_view('sanitization'), methods=["POST"])
app.add_url_rule(API_PREFIX + '/system/settings', view_func=SystemSettingsView.as_view('system_settings'),
                 methods=["GET", "PUT"])
app.add_url_rule(API_PREFIX + '/beer/print', view_func=PrinterView.as_view('beer_print_view'), methods=["POST"])


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    logger.info("Beer machine is running...")
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(host='0.0.0.0', port=9000)
