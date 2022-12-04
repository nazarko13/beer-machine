import configparser
import os
from functools import lru_cache
from logging import getLogger

logger = getLogger(__name__)
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))


@lru_cache(maxsize=2)
def _read_settings(settings_path):
    config = configparser.ConfigParser()
    config.read(settings_path)
    return config


def read_settings():
    settings_path = os.path.join(PROJECT_DIR, '.environment', 'settings.ini')
    return _read_settings(settings_path)


def _write_settings(settings_path, settings):
    with open(settings_path, 'w') as configfile:
        settings.write(configfile)


def write_settings(settings):
    settings_path = os.path.join(PROJECT_DIR, '.environment', 'settings.ini')
    _write_settings(settings_path, settings)


class Singleton(type):
    """
    Provides metaclass for singleton classes
        EXAMPLE:
            class MyClass(metaclass=Singleton):

    """
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]
