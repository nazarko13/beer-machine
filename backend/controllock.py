import re
import time
from logging import getLogger
from threading import Lock

import serial
import serial.tools.list_ports

from utils import read_settings

logger = getLogger(__name__)
settings = read_settings()
CONTROL_BOARD_PORT = settings['CONTROL_BOARD']['PORT']
BOARDS = [int(i) for i in settings['CONTROL_BOARD']['boards'].split(',')]


class BoardInteractionInterface:
    class Board:
        @staticmethod
        def __connect_serial():
            return serial.Serial(port=CONTROL_BOARD_PORT, baudrate=9600, timeout=1)

        @staticmethod
        def _find_where_is(boards, n):
            for board, lock_ids in boards.items():
                if n in lock_ids:
                    return board, lock_ids.index(n) + 1

        @classmethod
        def open_board_lock(cls, board, pos):
            ser = cls.__connect_serial()
            ser.write(bytes("*{}.open lock[{}]~".format(board, pos), 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            _str = str(_bytes, 'utf')
            data = _str.rpartition(' ')[0].partition(' ')[-1]
            logger.info("Lock #{} on board #{} has been opened".format(pos, board))
            return data

        @classmethod
        def _close_board_lock(cls, board, pos):
            ser = cls.__connect_serial()
            ser.write(bytes("*{}.close lock[{}]~".format(board, pos), 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            logger.info("Lock #{} on board #{} has been closed".format(pos, board))
            return str(_bytes, 'utf')

        @classmethod
        def set_lock_value(cls, board, lock_id, value):
            ser = cls.__connect_serial()
            ser.write(bytes('*{}.set lock value({})[{}]~'.format(board, lock_id, hex(value)), 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            return str(_bytes, 'utf')

        @classmethod
        def get_lock_values(cls, board):
            ser = cls.__connect_serial()
            ser.write(bytes('*{}.get lock value~'.format(board), 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            _data = str(_bytes, 'utf').strip().partition('=')[2].split(',')[:-1]
            assert len(_data) == 16
            return [int(e.split(':')[1].strip(), 16) for e in _data]

        @classmethod
        def get_SN(cls, board):
            ser = cls.__connect_serial()
            ser.write(bytes("*{}.get_SN~".format(board), 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            return str(_bytes, 'utf').replace('.', '').partition(':')[2].strip()

        @classmethod
        def set_SN(cls, board, sn):
            ser = cls.__connect_serial()
            ser.write(bytes("*{}.set_SN:[{}]~".format(board, sn), 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            return str(_bytes, 'utf')

        @classmethod
        def help(cls, board):
            ser = cls.__connect_serial()
            ser.write(bytes("*{}.help~".format(board), 'ASCII'))
            _data = ser.readline()
            ser.close()
            return _data

        @classmethod
        def locks_state(cls, board):
            ser = cls.__connect_serial()
            ser.write(bytes("*{}.locks state~".format(board), 'ASCII'))
            _data = ser.readline()
            ser.close()
            return _data

        @classmethod
        def open_all(cls, board):
            ser = cls.__connect_serial()
            ser.write(bytes('*{}.open all locks~'.format(board), 'ASCII'))
            _data = ser.readline()
            ser.close()
            return _data

        @classmethod
        def close_all(cls, board):
            ser = cls.__connect_serial()
            ser.write(bytes('*{}.close all locks~'.format(board), 'ASCII'))
            ser.close()

        def __init__(self):
            self.boards = self.__init_boards()

        def __enter__(self):
            return self

        def __exit__(self, _type, _val, _tb):
            self._close()

        def __init_boards(self):
            return {k: v for k, v in {b: self.get_lock_values(b) for b in BOARDS}.items() if v}

        def _close(self):
            pass

        def open_lock(self, n):
            board, pos = self._find_where_is(self.boards, n)
            return self.open_board_lock(board, pos)

        def close_lock(self, n):
            board, pos = self._find_where_is(self.boards, n)
            return self._close_board_lock(board, pos)

        def get_status_lock(self, board, pos):
            ser = self.__connect_serial()
            ser.write(bytes('*{}.get status lock:[{}]~'.format(board, pos), 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            return str(_bytes, 'utf').strip()

        def all_locks_status(self):
            _data = {}
            for board in self.boards:
                ser = self.__connect_serial()
                ser.write(bytes('*{}.send data~'.format(board), 'ASCII'))
                _bytes = ser.readline()
                ser.close()
                _data.update({board: [int(i) for i in str(_bytes, 'utf').partition('lock:')[-1].split(',')[:-1]]})
            return _data

        def get_lock_types(self):
            ser = self.__connect_serial()
            ser.write(bytes('*{}.help~'.format(BOARDS[0]), 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            response = str(_bytes, 'utf')
            try:
                locks_string = [x for x in response.split('\t') if 'lock type' in x][0]
                return re.search('{(.+?)}', locks_string)[1][:-1].replace('); ', ')\n')
            except IndexError:
                return "No info about lock types"

        def set_lock_type(self, lock_type):
            for board in self.boards:
                ser = self.__connect_serial()
                ser.write(bytes('*{}.lock type[{}]'.format(board, lock_type), 'ASCII'))
                ser.close()

    lock = Lock()

    @classmethod
    def open_board_lock(cls, brd, pos):
        with cls.lock:
            return cls.Board.open_board_lock(brd, pos)

    @classmethod
    def close_board_lock(cls, brd, pos):
        with cls.lock:
            return cls.Board._close_board_lock(brd, pos)

    @classmethod
    def open_lock(cls, n):
        with cls.lock, cls.Board() as b:
            return b.open_lock(n)

    @classmethod
    def close_lock(cls, n):
        with cls.lock, cls.Board() as b:
            return b.close_lock(n)

    @classmethod
    def get_status_lock(cls, board, pos):
        with cls.lock, cls.Board() as b:
            return b.get_status_lock(board, pos)

    @classmethod
    def set_serial_number(cls, board, sn):
        with cls.lock:
            return cls.Board.set_SN(board, sn)

    @classmethod
    def get_serial_number(cls, board):
        with cls.lock:
            return cls.Board.get_SN(board)

    @classmethod
    def help(cls, board):
        with cls.lock:
            return cls.Board.help(board)

    @classmethod
    def get_lock_value(cls, board):
        with cls.lock:
            return cls.Board.get_lock_values(board)

    @classmethod
    def set_lock_value(cls, board, lock_id, value):
        with cls.lock:
            return cls.Board.set_lock_value(board, lock_id, value)

    @classmethod
    def locks_state(cls, board):
        with cls.lock:
            return cls.Board.locks_state(board)

    @classmethod
    def init(cls):
        return cls.Board()

    @classmethod
    def open_all(cls, board):
        with cls.lock:
            cls.Board.open_all(board)

    @classmethod
    def close_all(cls, board):
        with cls.lock:
            cls.Board.close_all(board)

    @classmethod
    def get_lock_types(cls):
        with cls.lock:
            return cls.Board().get_lock_types()

    @classmethod
    def set_lock_type(cls, lock_type):
        with cls.lock:
            cls.Board().set_lock_type(lock_type)
