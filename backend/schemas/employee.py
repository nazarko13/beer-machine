import marshmallow_dataclass

from schemas.camel_case import CamelCaseSchema


@marshmallow_dataclass.dataclass(base_schema=CamelCaseSchema)
class EmployeesSchema:
    id: int
    name: str
    password: str
    login: str
    is_superuser: bool
