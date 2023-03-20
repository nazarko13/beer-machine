from devices.beer_board import BoardInteractionInterface
from settings import CONTROL_BOARD_PORT

print(f"Board port: {CONTROL_BOARD_PORT}")
print("Connecting to board...")
try:
    help_response = BoardInteractionInterface.help()
    print(f"Connected to board.")
    print(f"Response from board help: {help_response}")
except OSError as e:
    print(f"Could not connect to board. Error: {e}")
