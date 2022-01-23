from typing import Optional

import marshmallow_dataclass

from schemas.camel_case import CamelCaseSchema


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class BeerOutput:
    id: int
    name: str
    price: float
    type: Optional[str]
    pulse_count: Optional[int]
    is_active: bool


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class EmployeesSchema:
    id: int
    name: str
    password: str
    login: str
    is_superuser: bool
