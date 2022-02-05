import random

from models.models import Beer


def create_beer(name, price, beer_type, pulse_count=999):
    Beer.create(name=name, price=price, type="dark" if beer_type else "light", pulse_count=pulse_count)
    print(f"{name} created.")


def create_beer_from_input():
    if input("Manual beer setup. Press <ENTER> to continue or type any text to exit: ") == '':
        name = "".join(input("Enter name for beer: "))
        price = "".join(filter(lambda x: x.isdigit(), input(f"Enter price for beer '{name}': ")))
        beer_type = "".join(filter(lambda x: x.isdigit(), input(f"Enter type for beer '{name}'.(1=dark, 0=white): ")))
        create_beer(name, price, beer_type)
        create_beer_from_input()


def create_beer_automatically():
    for i in range(15):
        create_beer(f"Beer {i}", i * 2 + 10, random.randint(0, 1))


def main():
    beers = Beer.select().where(True)
    if beers and input('Beers configuration is already save. Do you want to resetup beers (y/N)? ') != 'y':
        return
    if input('Setup automatically (y/N)? ') == 'y':
        create_beer_automatically()
    else:
        Beer.delete().execute()
        create_beer_from_input()

