from enum import Enum

CONTROL_BOARD_PORT = "/dev/ttyUSB0"


class Constants:
    # PRESSURE
    GAS_BAG_PRESSURE_MIN = 0  # тиск в газовому балоні мінімальне значення
    GAS_BAG_PRESSURE_MAX = 1000  # тиск в газовому балоні максимальне значення
    SYSTEM_PRESSURE_MIN = 2410  # тиск в системі мінімальне значення
    SYSTEM_PRESSURE_MAX = 2900  # тиск в системі максимальне значення
    AIR_PRESSURE_CHECK_AMOUNT = 10  # к-ть спроб щоб наповнити систему необхідним тиском
    AIR_PRESSURE_CHECK_TIMEOUT = 1  # час в секундах перед перевіркою тиску повітря в системі
    INTAKE_ALL_AIR_TIMEOUT = 5  # час в секундах для стравлення повітрян з системи
    # TEMPERATURE
    COOLER_TEMP_MIN = 0  # температура в холодильнику мінімальне значення
    COOLER_TEMP_MAX = 25  # температура в холодильнику максимальне значення
    SYSTEM_TEMP_MIN = 0  # температура в системі мінімальне значення
    SYSTEM_TEMP_MAX = 25  # температура в системі мінімальне значення
    # DOOR
    DOOR_CLOSE_TIMEOUT = 1  # час в секундах повного закривання шторки в секундах
    DOOR_OPEN_TIMEOUT = 2  # час в секундах повного відкриття шторки в секундах
    # CLEANING промивка системи
    BLINK_WATER_CLEANING_TIMEOUT = 100  # час в мілісекундах для промивки системи водою (blinking on board)
    BLINK_AIR_CLEANING_TIMEOUT = 100  # час в мілісекундах для продування системи повітрям (blinking on board)
    # INTAKE AIR AFTER POUR стравка повітря після наливання пива
    INTAKE_AIR_AFTER_POUR_AMOUNT = 3  # к-ть стравок повітря після наливання пива
    INTAKE_AIR_AFTER_POUR_BLINK_TIMEOUT = 100  # час в мілісекундах стравки повітря після наливання пива
    # OTHER
    BEER_POUR_FAIL_TIMEOUT = 90  # час в секундах для повного наливання пива, якщо більше то зупинити налив
    BLINK_INTAKE_AIR_TIMEOUT = 100  # час в мілісекундах між відкриттям і закриттям клапана стравки (blinking on board)
    BEER_POUR_ITERATION_TIMEOUT = 0.5  # час в секундах для наливання пива в межах одного проходу циклу

    # EXCEPTION
    AFTER_EXCEPTION = 1  # час в секундах для виконнаня команди після отримання помилки


class Actuators(Enum):
    DOOR_CLOSE = 1  # клапан для закриття шторки
    DOOR_OPEN = 2  # клапан для відкриття шторки
    PRESSURE_VALVE = 3  # клапан для прижиму пляшки
    AIR_PRESSURE = 4  # клапан для запуску повітря в систему
    BEER_KEG_1 = 5  # клапан для запуску пива з кеги 1 в систему
    BEER_KEG_2 = 6  # клапан для запуску пива з кеги 2 в систему
    BEER_KEG_3 = 7  # клапан для запуску пива з кеги 3 в систему
    BEER_KEG_4 = 8  # клапан для запуску пива з кеги4 в систему
    INTAKE_AIR = 9  # клапан для стравки повітря
    WATER = 10  # клапан води


class Sensors(Enum):
    GAS_BAG_PRESSURE = "Press_1"  # датчик тиску в балоні
    SYSTEM_PRESSURE = "Press_2"  # датчик тиску в системі
    COOLER_TEMP = "Temp_1"  # датчик температури в холодильнику
    SYSTEM_TEMP = "Temp_2"  # датчик температури в системі
    DOOR = "DoorSensor"  # датчик дверки
    BEER_COUNTER_1 = "Count_1"  # датчик к-ті пива
    BEER_COUNTER_2 = "Count_2"  # датчик к-ті пива
    BEER_COUNTER_3 = "Count_3"  # датчик к-ті пива
    BEER_COUNTER_4 = "Count_4"  # датчик к-ті пива


BEER_COUNTER_MAP = {
    Actuators.BEER_KEG_1: Sensors.BEER_COUNTER_1,
    Actuators.BEER_KEG_2: Sensors.BEER_COUNTER_2,
    Actuators.BEER_KEG_3: Sensors.BEER_COUNTER_3,
    Actuators.BEER_KEG_4: Sensors.BEER_COUNTER_4,
}
