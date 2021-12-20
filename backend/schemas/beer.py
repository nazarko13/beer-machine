from typing import Optional

import marshmallow_dataclass

from schemas.camel_case import CamelCaseSchema


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class BeerOutput:
    id: int
    name: str
    price: float
    image: Optional[str]
    pulse_count: int
    is_active: bool
