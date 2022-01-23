from models.models import init_database, create_database
from setup import configure_employees, configure_beers

separator = '*' * 100

init_database()
create_database()

print(separator)

print('ADMINISTRATORS SETUP STARTED')
configure_employees.main()
print('ADMINISTRATORS SETUP COMPLETED')

print(separator)

print('BEERS SETUP STARTED')
configure_beers.main()
print('BEERS SETUP COMPLETED')

print(separator)
