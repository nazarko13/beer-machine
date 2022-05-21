import time

from controllock import BoardInteractionInterface
from models import Trays
from utils import read_settings, write_settings

settings = read_settings()

TRAY_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XLL']
PORT_BOARDS = [int(i) for i in settings['CONTROL_BOARD']['boards'].split(',')]


def _open_close_all(boards):
    for board in boards.keys():
        BoardInteractionInterface.open_all(board)
        time.sleep(0.5)
    time.sleep(1)


def _reset_boards_configuration(boards):
    for board in boards:
        for pos in range(1, 17):
            BoardInteractionInterface.set_lock_value(board, pos, 0)


def _set_boards_configuration(boards, lock_id):
    prev_states = {board: BoardInteractionInterface.locks_state(board) for board in boards}
    lock_id = lock_id
    print("Press <ENTER> to continue or type any text to exit")
    while True:
        response = input("Close tray #{}: ".format(lock_id)).strip()
        if response != '':
            break

        for board in boards:
            cur_state = BoardInteractionInterface.locks_state(board)
            states_xor = int(prev_states[board], 16) ^ int(cur_state, 16)
            if states_xor:
                pos = states_xor.bit_length()
                prev_states[board] = cur_state
                break
        else:
            print("You had not closed the door.")
            continue

        Trays.create(id=lock_id, boardId=board, lockId=pos, size='M')

        lock_id += 1


def _find_where_is(boards, n):
    for board, lock_ids in boards.items():
        if n in lock_ids:
            return board, lock_ids.index(n) + 1


def _get_lock_start_id():
    try:
        lock_id = int(input("Enter trays start number: "))
    except ValueError:
        print("Trays start number must be a digit")
        lock_id = _get_lock_start_id()
    return lock_id


def get_lock_type():
    type_to_inverse = {"1": "0", "2": "0", "3": "1", "4": "1"}

    try:
        settings = read_settings()
        lock_type = str(int(input("Enter locks type: ")))
        settings['CONTROL_BOARD']['lock_type'] = lock_type
        settings['CONTROL_BOARD']['inverse_locks'] = type_to_inverse[lock_type]
        write_settings(settings)

        return lock_type
    except ValueError:
        print("Lock type must be a digit")
        get_lock_type()


def main():
    trays = Trays.select().where(True)
    if trays and input('Board configuration is already save. Do you want to reconfigure board (y/N)? ') != 'y':
        return trays
    boards = BoardInteractionInterface.init().boards

    print('Possible lock types:', BoardInteractionInterface.get_lock_types(), sep='\n')
    BoardInteractionInterface.set_lock_type(get_lock_type())

    Trays.delete().execute()  # clear previous trays setup
    _open_close_all(boards)
    _reset_boards_configuration(boards)
    _set_boards_configuration(boards, _get_lock_start_id())


if __name__ == '__main__':
    main()
