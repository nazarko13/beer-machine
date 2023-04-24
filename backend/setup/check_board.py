import logging
from logging import getLogger

from devices.beer_board import BoardInteractionInterface
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

    counters_response = BoardInteractionInterface.read_counters()
    print(f"Response from `read_counters`: {counters_response}")

except OSError as e:
    print(f"Could not connect to board. Error: {e}")
