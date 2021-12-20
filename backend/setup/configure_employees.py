import peewee

from models import Employees
from utils import read_settings


def set_admin_password(shop_name):
    pas = "".join(filter(lambda x: x.isdigit(), input("Enter {} admin: ".format(shop_name))))
    try:
        Employees.create(password=pas, name=shop_name+' Admin', role='superadmin')
    except peewee.IntegrityError:
        print("[ERROR]\tAdministrator with this password is already registered")
        set_admin_password(shop_name)


def main():
    employees = Employees.select().where(True)
    if employees and input('Administrators configuration is already save. Do you want to resetup administartors (y/N)? ') != 'y':
        return employees

    Employees.delete().execute()

    set_admin_password("Cerera")
    set_admin_password(read_settings()['COMMON']['shop_name'])
