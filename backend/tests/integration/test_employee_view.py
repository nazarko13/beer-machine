from models import Employees
from settings import API_PREFIX

URL = API_PREFIX + '/employees'


def test_creation(client):
    Employees.create_table()
    Employees.delete().execute()
    emp1 = Employees.select().where(True)

    assert len(emp1) == 0

    Employees.create(id=1, password=123456, name="aa", surname="bb", role="superadmin")
    emp2 = Employees.select().where(True)
    assert len(emp2) == 1

    Employees.create(id=2, password=987654, name="cc", surname="dd", role="admin")
    emp3 = Employees.select().where(True)
    assert len(emp3) == 2


def test_employee_get(client):
    resp = client.get(URL)
    emps = resp.json.get('employees')

    assert len(emps) == 2

    resp = client.get(URL + "/123456")
    emp = resp.json

    assert emp["id"] == 1
    assert emp["name"] == "aa"

    resp = client.get(URL + "/1234567")
    no_emp = resp.json

    assert no_emp["description"] == 'No such employee'


def test_employee_post(client):
    employee = {'name': "Some name", 'password': "123", 'role': 'employee'}
    post_emp1 = client.post(URL, json=employee)
    resp1 = post_emp1.json.get("description")

    assert resp1 == 'Employee created'

    post_emp2 = client.post(URL, json=employee)
    resp2 = post_emp2.json.get("description")

    assert resp2 == 'Employee with current auth_code already exists'

    post_emp3 = client.post(URL, json={"invalid_field": "Sam"})
    resp3 = post_emp3.json.get('description')
    assert resp3 == "Missing required field `password`"

    post_emp4 = client.post(URL)
    resp4 = post_emp4.json.get('description')
    assert resp4 == "Format of provided data is invalid"

    post_emp5 = client.post(URL, json={"invalid_field": "Sam", "password": "sdsdkjfisfh"})
    resp5 = post_emp5.json.get('description')
    assert resp5 == "Invalid data"


def test_employee_patch(client):
    employee = {'id': 2, 'name': "Some name", 'password': "123", 'role': 'employee'}

    patch_emp1 = client.patch(URL, json=employee)
    resp1 = patch_emp1.json.get("description")
    assert resp1 == 'Employee with current auth_code already exists'

    employee['password'] = "new auth code"
    patch_emp2 = client.patch(URL, json=employee)
    resp2 = patch_emp2.json.get("description")
    assert resp2 == 'Employee updated'

    employee['id'] = 17
    patch_emp3 = client.patch(URL, json=employee)
    resp3 = patch_emp3.json.get("description")
    assert resp3 == 'Employee with current id not found'


def test_employee_delete(client):
    delete_req_1 = client.delete(URL + "/123456")
    deleted_1 = delete_req_1.json.get("description")

    assert deleted_1 == 'Employee deleted'

    delete_req_2 = client.delete(URL + "/123456")
    deleted_2 = delete_req_2.json.get('description')
    assert deleted_2 == 'No such employee'

    delete_req_3 = client.delete(URL)
    deleted_3 = delete_req_3.json.get('description')
    assert deleted_3 == 'Missing employee\'s password'
