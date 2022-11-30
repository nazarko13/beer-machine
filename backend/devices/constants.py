from enum import Enum

from settings import E_INTAKE_AIR_AFTER_POUR_AMOUNT, E_INTAKE_AIR_AFTER_POUR_BLINK_TIMEOUT, E_BEER_POUR_FAIL_TIMEOUT, \
    E_ITERATION_TIMEOUT_BEFORE, E_ITERATION_TIMEOUT_AFTER, E_BEER_POUR_SPLIT_PERCENT, \
    E_BLINK_INTAKE_AIR_TIMEOUT_BEFORE, E_BLINK_INTAKE_AIR_TIMEOUT_AFTER, E_TIMEOUT_BETWEEN_INTAKE_AIR_ITERATION


class Constants:
    # PRESSURE
    SYSTEM_PRESSURE_MIN = 1800  # тиск в системі мінімальне значення
    SYSTEM_PRESSURE_MAX = 2500  # тиск в системі максимальне значення
    AIR_PRESSURE_CHECK_AMOUNT = 10  # к-ть спроб щоб наповнити систему необхідним тиском
    AIR_PRESSURE_CHECK_TIMEOUT = 0.5  # час в секундах перед перевіркою тиску повітря в системі
    # TEMPERATURE
    COOLER_TEMP_MIN = 0  # температура в холодильнику мінімальне значення
    COOLER_TEMP_MAX = 7  # температура в холодильнику максимальне значення
    # DOOR
    DOOR_CLOSE_TIMEOUT = 1  # час в секундах повного закривання шторки в секундах
    DOOR_OPEN_TIMEOUT = 2  # час в секундах повного відкриття шторки в секундах
    # CLEANING промивка системи
    BLINK_WATER_CLEANING_TIMEOUT = 200  # час в мілісекундах для промивки системи водою (blinking on board)
    BLINK_AIR_CLEANING_TIMEOUT = 200  # час в мілісекундах для продування системи повітрям (blinking on board)
    # INTAKE AIR AFTER POUR стравка повітря після наливання пива
    INTAKE_AIR_AFTER_POUR_AMOUNT = E_INTAKE_AIR_AFTER_POUR_AMOUNT  # к-ть стравок повітря після наливання пива
    INTAKE_AIR_AFTER_POUR_BLINK_TIMEOUT = E_INTAKE_AIR_AFTER_POUR_BLINK_TIMEOUT  # час в мілісекундах стравки повітря після наливання пива
    # POUR
    BEER_POUR_FAIL_TIMEOUT = E_BEER_POUR_FAIL_TIMEOUT  # час в секундах для повного наливання пива, якщо більше то зупинити налив
    ITERATION_TIMEOUT_BEFORE = E_ITERATION_TIMEOUT_BEFORE  # час в секундах для наливання пива в межах одного проходу циклу до відсотка
    ITERATION_TIMEOUT_AFTER = E_ITERATION_TIMEOUT_AFTER  # час в секундах для наливання пива в межах одного проходу циклу після відсотка
    BEER_POUR_SPLIT_PERCENT = E_BEER_POUR_SPLIT_PERCENT  # відсоток  для розподілу між стравками (ціле частина)
    BLINK_INTAKE_AIR_TIMEOUT_BEFORE = E_BLINK_INTAKE_AIR_TIMEOUT_BEFORE  # час в мілісекундах між відкриттям і закриттям клапана стравки до відсотка
    BLINK_INTAKE_AIR_TIMEOUT_AFTER = E_BLINK_INTAKE_AIR_TIMEOUT_AFTER  # час в мілісекундах між відкриттям і закриттям клапана стравки після відсотка
    TIMEOUT_BETWEEN_INTAKE_AIR_ITERATION = E_TIMEOUT_BETWEEN_INTAKE_AIR_ITERATION  # час в секундах між відкриттям і закриттям клапана стравки після відсотка

    # SANITIZATION
    SANITIZATION_FAIL_TIMEOUT = 180  # час в секундах для санітизації системи, якщо більше то зупинити санітизацію
    SANITIZATION_IMPULSE_CHECK_TIMEOUT = 0.5  # час в секундах між зчитуванням сенсора наливу під час санітизації

    # EXCEPTION
    AFTER_EXCEPTION = 1  # час в секундах для виконання команди після отримання помилки


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
    SYSTEM_PRESSURE = "Press"  # датчик тиску в системі
    COOLER_TEMP = "Temp"  # датчик температури в холодильнику
    VALVE_SENSOR = "ValveSensor"  # датчик кінцевика
    DOOR = "DoorSensor"  # датчик дверки
    BEER_COUNTER_1 = "Count_1"  # датчик к-ті пива
    BEER_COUNTER_2 = "Count_2"  # датчик к-ті пива
    BEER_COUNTER_3 = "Count_3"  # датчик к-ті пива
    BEER_COUNTER_4 = "Count_4"  # датчик к-ті пива


BEER_SENSOR_MAP = {
    Sensors.BEER_COUNTER_1: 1,
    Sensors.BEER_COUNTER_2: 2,
    Sensors.BEER_COUNTER_3: 3,
    Sensors.BEER_COUNTER_4: 4
}

BEER_COUNTER_MAP = {
    Actuators.BEER_KEG_1: Sensors.BEER_COUNTER_1,
    Actuators.BEER_KEG_2: Sensors.BEER_COUNTER_2,
    Actuators.BEER_KEG_3: Sensors.BEER_COUNTER_3,
    Actuators.BEER_KEG_4: Sensors.BEER_COUNTER_4,
}
