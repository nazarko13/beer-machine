import marshmallow_dataclass

from schemas.camel_case import CamelCaseSchema


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class WorkingHoursSchema:
    from_hour: str
    to_hour: str


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class SystemSettingsSchema:
    working_hours: WorkingHoursSchema
    beer_remains_qty: int
    with_over_18_check: bool
