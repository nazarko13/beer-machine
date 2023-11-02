import datetime
import json
import random
from datetime import date

from peewee import DoesNotExist
from playhouse.shortcuts import model_to_dict

from models.models import Beer, init_database, create_database

BEER_FILE = 'beers_to_update.json'


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


def get_single_beer(beer_id: str):
    try:
        return json.dumps(model_to_dict(Beer.get(int(beer_id))))
    except DoesNotExist:
        return f"Beer with id {beer_id} not found."


def delete_beer(beer_id: str):
    Beer.delete().where(Beer.id == int(beer_id)).execute()
    print(f"Beer with id {beer_id} deleted")


def load_beers():
    with open(BEER_FILE, 'r') as f:
        beers = json.load(f)
        for beer_data in beers:
            beer_id = beer_data.pop("id")
            try:
                Beer.get(Beer.id == beer_id)
                Beer.update(**beer_data).where(Beer.id == beer_id).execute()
                print(f"UPDATED beer with id {beer_id}")
            except DoesNotExist:
                beer_to_save = Beer.create(**beer_data)
                beer_to_save.filling_date = date.today()
                beer_to_save.expiration_date = date.today() + datetime.timedelta(days=6)
                beer_to_save.save()
                print(f"CREATED beer with id {beer_id}")


def dump_beers_to_file():
    beers = Beer.select().where(True)
    beers = [model_to_dict(beer, exclude=[Beer.filling_date, Beer.expiration_date]) for beer in beers]
    with open(BEER_FILE, 'w') as f:
        json.dump(beers, f, indent=4, ensure_ascii=False)
        print("Saved to file")


def main():
    beers = Beer.select().where(True)
    beers = [model_to_dict(beer, exclude=[Beer.filling_date, Beer.expiration_date]) for beer in beers]
    for beer in beers:
        print(beer)
        print("-" * 100)
    while input("Press enter to start. Type 'exit' to finish.") != "exit":
        selected_option = input('Dumps beer - 1\nLoad beers - 2\nGet beer by id - 3\nDelete beer by id - 4\nChoice:')
        if selected_option == '1':
            dump_beers_to_file()
        if selected_option == '2':
            load_beers()
        if selected_option == '3':
            beer_id = input('Enter beer id:')
            print(get_single_beer(beer_id))
        if selected_option == '4':
            beer_id = input('Delete beer id:')
            delete_beer(beer_id)


if __name__ == '__main__':
    init_database()
    create_database()
    main()
