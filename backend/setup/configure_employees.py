import peewee

from models.models import Employees


def create_employee(name="Admin", is_superuser=False):
    login = "".join(input(f"Enter login for {'Super' if is_superuser else ''}Admin: "))
    password = "".join(filter(lambda x: x.isdigit(), input(f"Enter password for login '{login}': ")))
    try:
        Employees.create(password=password, login=login, name="Admin", is_superuser=is_superuser)
    except peewee.IntegrityError:
        print("[ERROR]\tUser with this login already exists.")
        create_employee(name, is_superuser)


def main():
    employees = Employees.select().where(True)
    if employees and input('Admins configuration already saved. Do you want to setup admins again (y/N)? ') != 'y':
        return

    Employees.delete().execute()
    # Creating admin user
    create_employee()
    # Creating superuser
    create_employee(name="SuperUser", is_superuser=True)
