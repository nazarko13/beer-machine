import json

from models.models import init_database, SystemSettings, BeerStatistics


def create_system_settings():
    current_system_settings = SystemSettings.get_first()
    if current_system_settings:
        print(f"Settings already exists. "
              f"Please delete to create newone. Current settings: {current_system_settings.config}")
    else:
        settings_to_create = json.dumps({"workingHours": {"fromHour": 10, "toHour": 12}, "beerRemainsQty": 10})
        if not input(f"Create default {settings_to_create}. Press <ENTER> to continue: ") == '':
            settings_to_create = input(f"Enter new settings: ")
        SystemSettings.create(id=1, config=settings_to_create)
        print("Settings created")


def delete_system_settings():
    current_system_settings = SystemSettings.get_first()
    if not current_system_settings:
        print("There are no saved settings. PLease create.")
    if input(f"Do you want to delete settings {current_system_settings}. Press (y) to continue: ") == 'y':
        SystemSettings.delete().where(SystemSettings.id > 0).execute()
        print("Settings deleted")


def delete_statistics():
    if input(f"Do you want to delete statistics. Press (y) to continue: ") == 'y':
        BeerStatistics.delete().where(BeerStatistics.id > 0).execute()
        print("BeerStatistics deleted")


if __name__ == "__main__":
    init_database()
    action = input("Manual db setup. Create system settings(1), delete system settings(2), delete statistics(3): ")
    if action == '1':
        create_system_settings()
    elif action == '2':
        delete_system_settings()
    elif action == '3':
        delete_statistics()
    else:
        print("Wrong command. Possible commands are 1,2,3")
