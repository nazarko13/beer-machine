import logging
import time
from logging import getLogger

from devices.beer_board import BoardInteractionInterface
from devices.constants import Actuators
from settings import CONTROL_BOARD_PORT


def check_board():
    print(f"Board port: {CONTROL_BOARD_PORT}")
    print("Connecting to board...")
    try:
        help_response = BoardInteractionInterface.help()
        print(f"Connected to board.")
        print(f"Response from command `help`: {help_response}")

        get_system_status_response = BoardInteractionInterface.get_system_status()
        print(f"Response from `get_system_status`: {get_system_status_response}")

        selected_actuator = int(input("Actuator (BEER_KEG_1: 5, BEER_KEG_2: 6, BEER_KEG_3: 7, BEER_KEG_4: 8): "))
        if not (5 <= selected_actuator <= 8):
            print("Invalid choice")
            return

        actuator = Actuators(selected_actuator)
        sensor = int(input("Sensor (Count_1: 1, Count_2: 2, Count_3: 3, Count_4: 4): "))
        if not (1 <= sensor <= 4):
            print("Invalid choice")
            return

        impulses = 100
        print(f"COMMAND `*start_filling:({sensor})({actuator.value})({impulses})~`.")
        print(BoardInteractionInterface.start_filling_internal_test(actuator, sensor, impulses=impulses))

        t_end = time.time() + 60 * 1
        while time.time() < t_end:
            counters_response = BoardInteractionInterface.read_counters()
            time.sleep(1)
            print(f"Response from `read_counters`: {counters_response}")
    except OSError as e:
        print(f"Could not connect to board. Error: {e}")


if __name__ == "__main__":
    if input("Do you want to run with logs (y/N)? ") == 'y':
        logger = getLogger(__name__)
        logging.basicConfig(level=logging.INFO)
    check_board()
