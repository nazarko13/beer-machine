import pytest

from api_server import app
from models import create_database, init_database


@pytest.fixture(scope='module')
def client():
    app.config['TESTING'] = True
    client = app.test_client()

    with app.app_context():
        init_database(':memory:')
        create_database()
    yield client

