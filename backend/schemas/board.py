from dataclasses import field

import marshmallow_dataclass

from schemas.camel_case import CamelCaseSchema
from views.constants import SystemActions


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class SystemStatusOutput:
    voltage: str = field(metadata={"attribute": "V"})
    amperes: str = field(metadata={"attribute": "A"})
    door_sensor: bool = field(metadata={"attribute": "DoorSensor"})
    actuators_state: str = field(metadata={"attribute": "Actuators_state"})
    temp_in_system: str = field(metadata={"attribute": "Temp_1"})
    pressure_in_system: str = field(metadata={"attribute": "Press_2"})
    beer_counter_1: str = field(metadata={"attribute": "Count_1"})
    beer_counter_2: str = field(metadata={"attribute": "Count_2"})
    beer_counter_3: str = field(metadata={"attribute": "Count_3"})
    beer_counter_4: str = field(metadata={"attribute": "Count_4"})


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class SystemActionInput:
    action: SystemActions
