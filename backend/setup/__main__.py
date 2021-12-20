from setup import configure_board, configure_employees, configure_terminal, configure_system
from models import create_database, init_database

separator = '*' * 100

init_database()
create_database()

print(separator)

print('TERMINAL SETUP STARTED')
configure_terminal.main()
print('TERMINAL SETUP COMPLETED')

print(separator)

print('BOARD SETUP STARTED')
configure_board.main()
print('BOARD SETUP COMPLETED')

print(separator)

print('ADMINISTRATORS SETUP STARTED')
configure_employees.main()
print('ADMINISTRATORS SETUP COMPLETED')

print(separator)

print('SYSTEM SETUP STARTED')
configure_system.main()
print('SYSTEM SETUP COMPLETED')

print(separator)
