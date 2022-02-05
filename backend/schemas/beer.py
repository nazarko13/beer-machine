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
