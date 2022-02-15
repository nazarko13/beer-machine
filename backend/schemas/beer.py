import datetime
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
    barcode: str
    description: Optional[str]
    keg: Optional[str]
    quantity: Optional[int]
    filling_date: Optional[datetime.date]
    expiration_date: Optional[datetime.date]


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class BeerPourInput:
    id: int
    pulse_count: Optional[int]
    keg: Optional[str]
