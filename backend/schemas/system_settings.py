import marshmallow_dataclass

from schemas.camel_case import CamelCaseSchema


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class WorkingHoursSchema:
    from_hour: int
    to_hour: int


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class SystemSettingsSchema:
    working_hours: WorkingHoursSchema
    # beer_remains_qty: int # TODO for next version
