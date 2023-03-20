from dataclasses import field

import marshmallow_dataclass

from schemas.camel_case import CamelCaseSchema
from views.constants import SystemActions


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class SystemStatusOutput:
    door_sensor: bool = field(metadata={"attribute": "DoorSensor"})
    valve_sensor: bool = field(metadata={"attribute": "ValveSensor"})
    actuators_state: str = field(metadata={"attribute": "Actuators_state"})
    temp_in_system: str = field(metadata={"attribute": "Temp"})
    pressure_in_system: str = field(metadata={"attribute": "Press"})
    beer_counter_1: str = field(metadata={"attribute": "Count_1"})
    beer_counter_2: str = field(metadata={"attribute": "Count_2"})
    beer_counter_3: str = field(metadata={"attribute": "Count_3"})
    beer_counter_4: str = field(metadata={"attribute": "Count_4"})


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class SystemActionInput:
    action: SystemActions


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class LiquidSanitizationSchema:
    liquid: str
    pulse_count: int
    keg: str
