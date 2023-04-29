import logging
import time
from logging import getLogger

from devices.beer_board import BoardInteractionInterface
from devices.constants import Actuators
from settings import CONTROL_BOARD_PORT

if input("Do you want to run with logs (y/N)? ") == 'y':
    logger = getLogger(__name__)
    logging.basicConfig(level=logging.INFO)

print(f"Board port: {CONTROL_BOARD_PORT}")
print("Connecting to board...")
try:
    help_response = BoardInteractionInterface.help()
    print(f"Connected to board.")
    print(f"Response from command `help`: {help_response}")

    get_system_status_response = BoardInteractionInterface.get_system_status()
    print(f"Response from `get_system_status`: {get_system_status_response}")
    selected_actuator = input("Actuator (BEER_KEG_1: 1, BEER_KEG_2: 2, BEER_KEG_3: 3, BEER_KEG_4: 4")
    if selected_actuator == '1':
        actuator = Actuators.BEER_KEG_1
    elif selected_actuator == '2':
        actuator = Actuators.BEER_KEG_2
    elif selected_actuator == '3':
        actuator = Actuators.BEER_KEG_3
    elif selected_actuator == '4':
        actuator = Actuators.BEER_KEG_4
    else:
        print("Invalid choice")

    # mins_to_run = input("Enter minutes to run `read_counters`: ")
    sensor = input("Sensor (Count_1: 1, Count_2: 2, Count_3: 3, Count_4: 4)")
    t_end = time.time() + 60 * 1
    BoardInteractionInterface.start_filling(actuator, int(sensor), impulses=100)
    while time.time() < t_end:
        counters_response = BoardInteractionInterface.read_counters()
        time.sleep(1)
        print(f"Response from `read_counters`: {counters_response}")

except OSError as e:
    print(f"Could not connect to board. Error: {e}")
