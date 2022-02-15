from dataclasses import field

import marshmallow_dataclass

from schemas.camel_case import CamelCaseSchema
from views.constants import SystemActions


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class SystemStatusOutput:
    voltage: str
    amperes: str
    door_sensor: bool
    actuators_state: str
    temp_in_system: str
    pressure_in_system: str
    beer_counter_1: str
    beer_counter_2: str
    beer_counter_3: str
    beer_counter_4: str

    # def __init__(self, **kwargs):
    #     print("KWARGS 11", kwargs)
    #     kwargs["voltage"] = kwargs["V"]
    #     kwargs["amperes"] = kwargs["A"]
    #     kwargs["door_sensor"] = kwargs["DoorSensor"]
    #     kwargs["actuators_state"] = kwargs["Actuators_state"]
    #     kwargs["temp_in_system"] = kwargs[Sensors.SYSTEM_TEMP.value]
    #     kwargs["pressure_in_system"] = kwargs[Sensors.SYSTEM_PRESSURE.value]
    #     kwargs["beer_counter_1"] = kwargs[Sensors.BEER_COUNTER_1.value]
    #     kwargs["beer_counter_2"] = kwargs[Sensors.BEER_COUNTER_2.value]
    #     kwargs["beer_counter_3"] = kwargs[Sensors.BEER_COUNTER_3.value]
    #     kwargs["beer_counter_4"] = kwargs[Sensors.BEER_COUNTER_4.value]
    #     print("KWARGS", kwargs)
    #     super().__init__(**kwargs)


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class SystemActionInput:
    action: SystemActions
