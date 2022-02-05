import os

from .setup_logging import setup_logging

path = 'logs/'

if not os.path.exists(path):
    if not os.path.isdir(os.path.dirname(path)):
        os.makedirs(path)

__add__ = ['setup_logging']
