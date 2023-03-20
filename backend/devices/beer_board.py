import time
from logging import getLogger
from threading import Lock

from devices.printing import print_receipt
from devices.utils import handle_board_error_action
from export.telegram_bot import send_message
from models.models import Beer, BeerStatistics, SystemSettings
from schemas.system_settings import SystemSettingsSchema
from settings import CONTROL_BOARD_PORT

logger = getLogger(__name__)
import serial

from devices.constants import Constants, Actuators, Sensors, BEER_COUNTER_MAP, BEER_SENSOR_MAP

command_str = [0 for _ in range(0, 16)]


class BoardError(Exception):
    """Exception raised for errors in the board interface.

     Attributes:
         action -- input action which caused the error
         message -- explanation of the error
     """

    def __init__(self, action: str = "", message: str = "Something went wrong"):
        self.action = action
        self.message = message
        super().__init__(self.action, self.message)

    def __str__(self):
        return f'Action: {self.action}. Message: {self.message}'


class BoardInteractionInterface:
    class Board:
        def __enter__(self):
            return self

        def __exit__(self, _type, _val, _tb):
            self._close()

        def _close(self):
            pass

        @staticmethod
        def __connect_serial():
            return serial.Serial(port=CONTROL_BOARD_PORT, baudrate=9600, timeout=1)

        @staticmethod
        def __str_to_dict(str_to_convert):
            """
            :param str_to_convert:
            Convert input string to dict. Split by comma and remove whitespaces.
            Example1:
            str_to_convert="Count_1:0, Count_2:0, Count_3:0, Count_4:0'
            result = {'Count_1': '0', 'Count_2': '0', 'Count_3': '0', 'Count_4': '0'}
            Example2:
            str_to_convert="ValveSensor:0, DoorSensor:0, Actuators_state:[0000], Temp:-99.0, Press:0.
            result = {'ValveSensor': '0', 'DoorSensor': '0', 'Actuators_state': '[0000]', 'Temp': '-99.0', 'Press': '0'}
            :return result:
            """
            return {y[0]: y[1] for y in [x.strip().split(":") for x in str_to_convert.split(',')]}

        @classmethod
        def help(cls):
            """Return all available commands on Beer Board"""
            ser = cls.__connect_serial()
            ser.write(bytes("*help~", 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            _str = str(_bytes, 'utf')
            return [x.strip() for x in _str.split(',')]

        @classmethod
        def get_system_status(cls):
            """
            Get system status in format:
                ValveSensor:0, DoorSensor:0, Actuators_state:[0000], Temp:-60.0, Press:0, Count_1:0, Count_2:0,
                Count_3:0, Count_4:0.
            :return Convert data to dict
            """
            ser = cls.__connect_serial()
            ser.write(bytes("*get_system_status~", 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            _str = str(_bytes, 'utf')
            logger.info(f"BEER BOARD. GET SYSTEM STATUS. Resp from board: '{_str}'")
            return cls.__str_to_dict(_str)

        @classmethod
        def read_counters(cls):
            """
            Get counters info: Count_1:0, Count_2:0, Count_3:0, Count_4:0
            :return: {'Count_1': '0', 'Count_2': '0', 'Count_3': '0', 'Count_4': '0'}
            """
            ser = cls.__connect_serial()
            ser.write(bytes("*read_counters~", 'ASCII'))
            _bytes = ser.readline()
            ser.close()

            _str = str(_bytes, 'utf')
            logger.info(f"BEER BOARD. READ COUNTERS. Resp from board: '{_str}'")
            return cls.__str_to_dict(_str)

        @classmethod
        def initial_actuator(cls):
            ser = cls.__connect_serial()
            ser.write(bytes(f"*set_actuators:[0000]~", 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            _str = str(_bytes, 'utf').strip()
            res = _str.strip() == "actuators_is_set"
            logger.info(f"BEER BOARD. INITIAL ACTUATOR. Result: {res}. Resp from board: '{_str}'")
            for i in range(0, len(command_str)):
                command_str[i] = 0
            return res

        @classmethod
        def set_actuator(cls, actuator: Actuators, state):
            # TODO rewrite logic of setting actuator by using bytes array and table of truth
            ser = cls.__connect_serial()

            command_str[-actuator.value] = int(state)
            str_bytes = ''.join([str(elem) for elem in command_str])
            logger.info(f"BEER.BOARD. SET ACTUATOR. STATE {str_bytes}")
            a = hex(int(str_bytes, 2))[2:].rjust(4, "0")
            ser.write(bytes(f"*set_actuators:[{a}]~", 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            _str = str(_bytes, 'utf').strip()
            if not _str.strip() == "actuators_is_set":
                raise BoardError(action="set_actuator", message=f"Could not set actuator{actuator} to state{state}")
            return True

        @classmethod
        def reset_counters(cls):
            """
            Get system status in format: Count_1:0, Count_2:0, Count_3:0, Count_4:0
            :return: {'Count_1': '0', 'Count_2': '0', 'Count_3': '0', 'Count_4': '0'}
            """
            ser = cls.__connect_serial()
            logger.info("BEER BOARD. RESET COUNTERS. Start.")
            ser.write(bytes("*reset_counters~", 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            _str = str(_bytes, 'utf').strip()
            res = _str == "counters_reset"
            logger.info(f"BEER BOARD. RESET COUNTERS. Finished with status: {res}. Resp from board: '{_str}'")
            return res

        @classmethod
        def blinking_actuator(cls, actuator: Actuators, blink_time: int):
            """
            # TODO
            """
            ser = cls.__connect_serial()
            logger.info(f"BEER BOARD. BLINKING ACTUATOR. Start. Actuator {actuator.name}, blink time: {blink_time}")
            ser.write(bytes(f"*blinking_actuator:({actuator.value})({blink_time})~", 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            _str = str(_bytes, 'utf').strip()
            res = _str == "the_actuator_blinked"
            logger.info(f"BEER BOARD. BLINKING ACTUATOR. Finished with status: {res}. Resp from board: '{_str}'")
            return res

        @classmethod
        def start_filling(cls, actuator: Actuators, sensor: int, impulses: int = 100):
            """
            Start pour with automatic count on the board. Once count will be equal to impulses reached stop pour.
            :param actuator:
            :param sensor:
            :param impulses:
            :return: res
            """

            ser = cls.__connect_serial()
            logger.info(
                f"BEER BOARD. POUR WITH COUNTER. Start.Actuator {actuator.value},sensor {sensor},impulses {impulses}")
            ser.write(bytes(f"*start_filling:({sensor})({actuator.value})({impulses})~", 'ASCII'))
            _bytes = ser.readline()
            ser.close()
            _str = str(_bytes, 'utf').strip()
            res = _str == "the_actuator_blinked"
            logger.info(f"BEER BOARD. BLINKING ACTUATOR. Finished with status: {res}. Resp from board: '{_str}'")
            return res

    lock = Lock()

    @classmethod
    def __is_pressure_in_system_ok(cls):
        """
        Check if pressure in system is in predefined range inclusive.
        :return: bool
        """
        with cls.lock:
            pressure_in_system = float(cls.Board.get_system_status()[Sensors.SYSTEM_PRESSURE.value])
            logger.info(f"BEER_BOARD. PRESSURE IN SYSTEM. "
                        f"Range: {Constants.SYSTEM_PRESSURE_MIN}-{Constants.SYSTEM_PRESSURE_MAX}. "
                        f"Current pressure: {pressure_in_system}.")
            return Constants.SYSTEM_PRESSURE_MIN <= pressure_in_system <= Constants.SYSTEM_PRESSURE_MAX

    @classmethod
    def is_temp_in_cooler_ok(cls):
        """
        Check if temp in cooler is in predefined range inclusive.
        :return: bool
        """
        with cls.lock:
            temp_in_cooler = float(cls.Board.get_system_status()[Sensors.COOLER_TEMP.value])
            logger.info(f"BEER_BOARD. TEMPERATURE IN COOLER. "
                        f"Range: {Constants.COOLER_TEMP_MIN}-{Constants.COOLER_TEMP_MAX}. "
                        f"Current temperature: {temp_in_cooler}.")
            return Constants.COOLER_TEMP_MIN <= temp_in_cooler <= Constants.COOLER_TEMP_MAX

    @classmethod
    def air_pressure_start(cls):
        """
        Start air pressure. Air actuator on board is True.
        :return: bool
        """
        with cls.lock:
            logger.info(f"BEER_BOARD. AIR PRESSURE START. Air pressure actuator is True.")
            return cls.Board.set_actuator(Actuators.AIR_PRESSURE, True)

    @classmethod
    def air_pressure_stop(cls):
        """
        Stop air pressure. Air actuator on board is False.
        :return: bool
        """
        with cls.lock:
            logger.info(f"BEER_BOARD. AIR PRESSURE STOP. Air pressure actuator is False.")
            return cls.Board.set_actuator(Actuators.AIR_PRESSURE, False)

    @classmethod
    def help(cls):
        with cls.lock:
            return cls.Board.help()

    @classmethod
    def get_system_status(cls):
        with cls.lock:
            logger.info(f"BEER_BOARD. GET SYSTEM STATUS.")
            return cls.Board.get_system_status()

    @classmethod
    def read_counters(cls):
        with cls.lock:
            return cls.Board.read_counters()

    @classmethod
    def blinking_actuator(cls, actuator: Actuators, blink_time: int):
        cls.__is_pressure_in_system_ok()
        with cls.lock:
            logger.info(f"BEER_BOARD. BLINKING ACTUATOR. Actuator: {actuator}, time:{blink_time}.")
            return cls.Board.blinking_actuator(actuator, blink_time)

    @classmethod
    def close_door(cls):
        """
        Close the door. Set door actuator to '1'. Check door sensor by timeout.
        :return: True if DoorSensor equal '1' else False.
        """
        with cls.lock:
            if cls.Board.set_actuator(Actuators.DOOR_CLOSE, True):
                logger.info("BEER_BOARD. Door close process start.")
                time.sleep(Constants.DOOR_CLOSE_TIMEOUT)
                res = cls.Board.get_system_status()[Sensors.DOOR.value] == '1'
                logger.info(f"BEER_BOARD. DOOR CLOSE. Door close process finished with status {res}.")
                if not res:
                    logger.error("BEER_BOARD. DOOR CLOSE. Door was not closed due to something on the way")
                    raise BoardError(action="close_door_check_sensor", message="Could not close door.")
                return res

            logger.error("BEER_BOARD. DOOR CLOSE. Could not start door close process.")
            raise BoardError(action="close_door", message="Could not start door close process.")

    @classmethod
    def open_door(cls):
        """
        Open the door. Set door close actuator to '0', door open actuator to '1' and then to '0' by timeout.
        :return: boolean
        """
        with cls.lock:
            if cls.Board.set_actuator(Actuators.DOOR_OPEN, True):
                cls.Board.set_actuator(Actuators.DOOR_CLOSE, False)
                logger.info("BEER_BOARD. OPEN DOOR. Door open process STARTED.")
                time.sleep(Constants.DOOR_OPEN_TIMEOUT)
                cls.Board.set_actuator(Actuators.DOOR_OPEN, False)
                logger.info("BEER_BOARD. OPEN DOOR. Door open process FINISHED.")
            else:
                logger.error("BEER_BOARD. DOOR CLOSE. Could not start door open process.")
                raise BoardError(action="open_door", message="Could not start door open process.")

    @classmethod
    def pressure_valve_start(cls):
        """
        Set PRESSURE_VALVE on board to True.
        :return: bool
        """
        with cls.lock:
            logger.info(f"BEER_BOARD. PRESSURE VALVE START. Valve pressure actuator is True.")
            return cls.Board.set_actuator(Actuators.PRESSURE_VALVE, True)

    @classmethod
    def is_valve_fully_open(cls):
        """
        Check if valve is fully open.
        :return: True if ValveSensor equal '1' else False.
        """
        is_valve_pressed_bottle = cls.Board.get_system_status()[Sensors.VALVE_SENSOR.value] == '1'
        logger.info(f"BEER_BOARD. PRESSURE VALVE START Current valve pressed bottle: {is_valve_pressed_bottle}.")
        return is_valve_pressed_bottle

    @classmethod
    def pressure_valve_stop(cls):
        """
        Stop pressure valve process. Set PRESSURE_VALVE actuator on board to False.
        :return: bool
        """
        with cls.lock:
            logger.info(f"BEER_BOARD. PRESSURE VALVE STOP. Valve pressure actuator is False.")
            return cls.Board.set_actuator(Actuators.PRESSURE_VALVE, False)

    @classmethod
    def water_start(cls):
        with cls.lock:
            logger.info(f"BEER_BOARD. WATER START. Water actuator is True.")
            return cls.Board.set_actuator(Actuators.WATER, True)

    @classmethod
    def water_stop(cls):
        with cls.lock:
            logger.info(f"BEER_BOARD. WATER STOP. Water actuator is False.")
            return cls.Board.set_actuator(Actuators.WATER, False)

    @classmethod
    def take_air_pressure_into_system(cls):
        """
        Fill the system with air. Check if air pressure is in range.
        :return: bool
        :raise: BoardError
        """
        cls.air_pressure_start()
        for i in range(Constants.AIR_PRESSURE_CHECK_AMOUNT):
            time.sleep(Constants.AIR_PRESSURE_CHECK_TIMEOUT)
            is_pressure_ok = cls.__is_pressure_in_system_ok()
            logger.info(f"BEER_BOARD. AIR PRESSURE INTO SYSTEM. Is pressure in system in range: {is_pressure_ok}.")
            if is_pressure_ok:
                cls.air_pressure_stop()
                return True

        logger.error(f"BEER_BOARD. AIR PRESSURE INTO SYSTEM. Could not fill the system with needed air pressure.")
        cls.air_pressure_stop()
        raise BoardError(
            action="take_air_pressure_into_system",
            message="Could not fill the system with needed air pressure."
        )

    @classmethod
    def beer_pour_start(cls, beer_actuator: Actuators):
        """
        Start beer pour. Beer actuator on board is True
        :param beer_actuator: Actuators
        :return: bool
        """
        with cls.lock:
            logger.info(f"BEER_BOARD. BEER POUR START. Actuator {beer_actuator} is True.")
            return cls.Board.set_actuator(beer_actuator, True)

    @classmethod
    def beer_pour_start_with_counter_on_board(cls, beer_actuator: Actuators, counter_number: int, impulses: int):
        """
        Start beer pour. Beer actuator on board is True
        :param beer_actuator: Actuators
        :param counter: Sensors
        :return: bool
        """
        with cls.lock:
            logger.info(f"BEER_BOARD. BEER POUR START. "
                        f"Actuator {beer_actuator.value} is True. Counter {counter_number}. Impulses: {impulses}")
            return cls.Board.start_filling(beer_actuator, counter_number, impulses)

    @classmethod
    def beer_pour_stop(cls, beer_actuator: Actuators):
        """
        Stop beer pour. Beer actuator on board is False
        :param beer_actuator: Actuators
        :return: bool
        """
        with cls.lock:
            logger.info(f"BEER_BOARD. BEER POUR STOP. Actuator {beer_actuator} is False.")
            return cls.Board.set_actuator(beer_actuator, False)

    @classmethod
    def intake_air_start(cls):
        with cls.lock:
            logger.info(f"BEER_BOARD. INTAKE AIR START. Air actuator is True.")
            return cls.Board.set_actuator(Actuators.INTAKE_AIR, True)

    @classmethod
    def intake_air_stop(cls):
        with cls.lock:
            logger.info(f"BEER_BOARD. INTAKE AIR STOP. Air actuator is False.")
            return cls.Board.set_actuator(Actuators.INTAKE_AIR, False)

    @classmethod
    def intake_air(cls, beer_impulses, count_sensor: Sensors):
        """
        :param beer_impulses:
        :param count_sensor:
        :return: bool
        :raise: BoardError
        """
        timeout = time.time() + Constants.BEER_POUR_FAIL_TIMEOUT
        with cls.lock:
            sensor_impulses = 0
            logger.info(f"BEER_BOARD. INTAKE AIR. Start intake air.Impulses to intake {beer_impulses}.")
            while beer_impulses > sensor_impulses:
                if int((sensor_impulses / beer_impulses) * 100) < Constants.BEER_POUR_SPLIT_PERCENT:
                    cls.Board.blinking_actuator(Actuators.INTAKE_AIR, Constants.BLINK_INTAKE_AIR_TIMEOUT_BEFORE)
                    time.sleep(Constants.ITERATION_TIMEOUT_BEFORE)
                else:
                    cls.Board.blinking_actuator(Actuators.INTAKE_AIR, Constants.BLINK_INTAKE_AIR_TIMEOUT_AFTER)
                    time.sleep(Constants.ITERATION_TIMEOUT_AFTER)
                if time.time() > timeout:
                    logger.error(f"BEER_BOARD. INTAKE AIR. Beer pour timeout exceed.")
                    raise BoardError(action="intake_air", message="Beer pour timeout exceed.")
                sensor_impulses = int(cls.Board.read_counters()[count_sensor.value])
        return True

    @classmethod
    def reset_counters(cls):
        with cls.lock:
            return cls.Board.reset_counters()

    @classmethod
    def set_initial_actuators_state(cls):
        with cls.lock:
            return cls.Board.initial_actuator()


def pour_beer_flow(beer_keg, beer_id, impulses=1000, callback_function=print):
    beer_actuator = Actuators[beer_keg]
    beer_counter = BEER_COUNTER_MAP.get(beer_actuator)
    beer_count_number = BEER_SENSOR_MAP.get(beer_counter)
    logger.info(f"BEER BOARD. POUR BEER FLOW. Pour beer STARTED (keg: {beer_keg}, impulses: {impulses}.")
    beer = Beer.get(beer_id)
    beer_statistics = BeerStatistics.create(beer_name=beer.name, barcode=beer.barcode, remains=beer.quantity - 1)
    system_settings = SystemSettingsSchema.Schema().loads(SystemSettings.get_first().config)
    if beer.quantity <= system_settings.beer_remains_qty:
        send_message(f"Пиво закінчується: {beer.name} - {beer.quantity}л")
    try:
        BoardInteractionInterface.set_initial_actuators_state(),
        callback_function(10, "Initial actuators state.")
        BoardInteractionInterface.close_door(),
        callback_function(20, "Door close.")
        BoardInteractionInterface.pressure_valve_start(),
        time.sleep(1.5)
        if not BoardInteractionInterface.is_valve_fully_open():
            raise BoardError(
                action="press_bottle",
                message="Bottle was not pressed."
            )
        callback_function(30, "Pressure valve start.")
        BoardInteractionInterface.take_air_pressure_into_system(),
        callback_function(40, "Take air pressure into_system")
        BoardInteractionInterface.reset_counters()
        callback_function(50, "Reset counters")
        BoardInteractionInterface.beer_pour_start_with_counter_on_board(beer_actuator, beer_count_number, impulses)
        callback_function(60, "Beer pour start")
        BoardInteractionInterface.intake_air(impulses, beer_counter)
        callback_function(70, "Beer pour stop")
        for _ in range(Constants.INTAKE_AIR_AFTER_POUR_AMOUNT):
            BoardInteractionInterface.blinking_actuator(Actuators.INTAKE_AIR,
                                                        Constants.INTAKE_AIR_AFTER_POUR_BLINK_TIMEOUT)
            time.sleep(Constants.TIMEOUT_BETWEEN_INTAKE_AIR_ITERATION)
        BoardInteractionInterface.intake_air_start()

        # printing receipt and updating quantity TODO move to separate function
        updated_beer = Beer.update_quantity(beer_id)
        print_receipt(barcode=updated_beer.barcode,
                      description=updated_beer.description,
                      filling_date=updated_beer.filling_date)

        time.sleep(5)
        callback_function(80, "Intake air")
        BoardInteractionInterface.pressure_valve_stop()
        callback_function(90, "Pressure valve stop")
        BoardInteractionInterface.open_door()
        BoardInteractionInterface.intake_air_stop()
        callback_function(100, "Open door", True)
        return True
    except BoardError as e:
        logger.error(f"BEER BOARD. POUR BEER FLOW. {e}")
        handle_board_error_action(e.action, beer_statistics)
        try:
            BoardInteractionInterface.set_initial_actuators_state()
            time.sleep(Constants.AFTER_EXCEPTION)
            BoardInteractionInterface.open_door()
        except BoardError as e:
            logger.error("BEER BOARD. POUR BEER FLOW. Error in finally.")
            logger.error(f"BEER BOARD. POUR BEER FLOW. {e}")
    finally:
        BoardInteractionInterface.reset_counters()
        BoardInteractionInterface.set_initial_actuators_state()
    logger.info(f"BEER BOARD. POUR BEER FLOW. Pour beer FINISHED(keg: {beer_keg}, impulses: {impulses}.")
    return False


def system_cleaning_flow(force=False):
    logger.info(f"BEER BOARD. SYSTEM CLEANING. STARTED (force: {force}")
    try:
        BoardInteractionInterface.set_initial_actuators_state()
        BoardInteractionInterface.close_door()
        BoardInteractionInterface.pressure_valve_start()
        time.sleep(1)
        if not force:
            if BoardInteractionInterface.is_valve_fully_open():
                raise BoardError(
                    action="cleaning_flow",
                    message="Bottle was not removed."
                )
        BoardInteractionInterface.blinking_actuator(Actuators.WATER, Constants.BLINK_WATER_CLEANING_TIMEOUT)
        BoardInteractionInterface.blinking_actuator(Actuators.AIR_PRESSURE, Constants.BLINK_AIR_CLEANING_TIMEOUT)
        BoardInteractionInterface.pressure_valve_stop()
        BoardInteractionInterface.open_door()
        return True
    except BoardError as e:
        logger.error(f"BEER BOARD. SYSTEM CLEANING FLOW. {e}")
        try:
            BoardInteractionInterface.set_initial_actuators_state()
            time.sleep(Constants.AFTER_EXCEPTION)
            BoardInteractionInterface.open_door()
        except BoardError as e:
            logger.error("BEER BOARD. SYSTEM CLEANING FLOW. Error in finally.")
            logger.error(f"BEER BOARD. SYSTEM CLEANING FLOW. {e}")
    finally:
        BoardInteractionInterface.set_initial_actuators_state()

    logger.info(f"BEER BOARD. SYSTEM CLEANING. FINISHED. (force {force}")
    return False


def system_sanitization(liquid, beer_keg, impulses=1000):
    beer_actuator = Actuators[beer_keg]
    beer_counter = BEER_COUNTER_MAP.get(beer_actuator)
    logger.info(f"BEER BOARD. SYSTEM SANITIZATION. STARTED (liquid {liquid}, keg: {beer_keg}, impulses: {impulses}.")
    try:
        BoardInteractionInterface.reset_counters()
        BoardInteractionInterface.beer_pour_start(beer_actuator)
        BoardInteractionInterface.intake_air_start()
        timeout = time.time() + Constants.SANITIZATION_FAIL_TIMEOUT
        sensor_impulses = 0

        while impulses > sensor_impulses:
            sensor_impulses = int(BoardInteractionInterface.read_counters()[beer_counter.value])
            time.sleep(Constants.SANITIZATION_IMPULSE_CHECK_TIMEOUT)
            if time.time() > timeout:
                logger.error(f"BEER_BOARD. SYSTEM SANITIZATION. Timeout exceed for liquid {liquid}, keg {beer_keg}.")
                raise BoardError(action="system_sanitization", message=f"Timeout exceed for liquid {liquid}.")

        BoardInteractionInterface.beer_pour_stop(beer_actuator)
        BoardInteractionInterface.intake_air_stop()
        return True
    except BoardError as e:
        logger.error(f"BEER BOARD. SYSTEM SANITIZATION. {e}")
        try:
            BoardInteractionInterface.set_initial_actuators_state()
            time.sleep(Constants.AFTER_EXCEPTION)
            BoardInteractionInterface.open_door()
        except BoardError as e:
            logger.error("BEER BOARD. SYSTEM SANITIZATION. Error in finally.")
            logger.error(f"BEER BOARD. SYSTEM SANITIZATION. {e}")
    logger.info(f"BEER BOARD. SYSTEM SANITIZATION. FINISHED (liquid {liquid}, keg: {beer_keg}, impulses: {impulses}.")
    return False


if __name__ == "__main__":
    print(BoardInteractionInterface.set_initial_actuators_state())
    # BoardInteractionInterface.pressure_valve_start()
    # print(BoardInteractionInterface.air_pressure_stop())
    # print(BoardInteractionInterface.blinking_actuator(Actuators.INTAKE_AIR, 20))
    # print(BoardInteractionInterface.blinking_actuator(Actuators.BEER_KEG_4, 20))
    # print(BoardInteractionInterface.blinking_actuator(Actuators.BEER_KEG_3, 20))
    # pour_beer_flow("BEER_KEG_2", 2250)
    # system_cleaning_flow()
    # system_sanitization("WATER", "BEER_KEG_2", 2250))
    # BoardInteractionInterface.beer_pour_stop(Actuators.BEER_KEG_2)
