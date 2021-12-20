from unittest.mock import MagicMock, patch

from models import Trays
from settings import API_PREFIX

URL = API_PREFIX + '/trays'


def test_creation(client):
    Trays.create_table()
    Trays.delete().execute()
    emp1 = Trays.select().where(True)
    assert len(emp1) == 0

    Trays.create(id=1, boardId=1, lockId=1, size="S", state="free", authCode=None)
    emp2 = Trays.select().where(True)
    assert len(emp2) == 1

    Trays.create(id=2, boardId=1, lockId=2, size="M", state="occupied", authCode="1" * 13)
    emp3 = Trays.select().where(True)
    assert len(emp3) == 2


def test_get(client):
    res = client.get(URL)
    trays = res.json.get('trays')
    assert len(trays) == 2

    res = client.get(URL + '?state=free')
    trays = res.json.get('trays')
    assert len(trays) == 1


@patch('controllock.BoardInteractionInterface.open_board_lock', MagicMock(return_value="{'description': 'success'}"))
@patch('controllock.BoardInteractionInterface.close_board_lock', MagicMock(return_value="{'description': 'success'}"))
@patch('reportlab.platypus.Image', MagicMock(return_value=None))
@patch('views.TrayView.launch_timer', MagicMock(return_value="{'description': 'success'}"))
def test_post(client):
    res = client.post(URL, json={"size": "S", "auth_code": "T110"})
    tray_id = res.json.get('tray_id')
    assert tray_id == 1

    res = client.post(URL, json={"size": "S", "auth_code": "T110"})
    desc = res.json.get('description')
    assert desc == "No free tray"

    res = client.post(URL)
    resp = res.json.get('description')
    assert resp == "Format of provided data is invalid"


@patch('controllock.BoardInteractionInterface.open_board_lock', MagicMock(return_value="{'description': 'success'}"))
@patch('controllock.BoardInteractionInterface.close_board_lock', MagicMock(return_value="{'description': 'success'}"))
def test_patch(client):
    # TODO: check results with database

    res = client.patch(URL + "/2")
    resp = res.json.get("description")
    assert resp == "Missed required field `state`"
    assert len(client.get(URL + '?state=free').json.get('trays')) == 0

    res = client.patch(URL + '/2', json={'state': 'free'})
    assert res.json['description'] == "success"
    assert len(client.get(URL + '?state=free').json.get('trays')) == 1

    res = client.patch(URL)
    assert res.json['status'] == "success"
    assert len(client.get(URL + '?state=free').json.get('trays')) == 2


@patch('controllock.BoardInteractionInterface.open_board_lock', MagicMock(return_value="{'description': 'success'}"))
@patch('controllock.BoardInteractionInterface.close_board_lock', MagicMock(return_value="{'description': 'success'}"))
@patch('reportlab.platypus.Image', MagicMock(return_value=None))
@patch('views.TrayView.launch_timer', MagicMock(return_value="{'description': 'success'}"))
def test_delete(client):
    post_res = client.post(URL, json={"size": "S", "auth_code": "110"})
    assert len(client.get(URL + '?state=free').json.get('trays')) == 1

    res = client.delete(URL, json={'auth_code': "110"})
    assert res.json['status'] == 'success' and res.json['tray_id'] == post_res.json['tray_id']
    assert len(client.get(URL + '?state=free').json.get('trays')) == 2

    res = client.delete(URL)
    resp = res.json.get('description')
    assert resp == "Format of provided data is invalid"

    res = client.delete(URL, json={'auth_code': "111"})
    resp = res.json.get('description')
    assert resp == "Auth code is not valid"
