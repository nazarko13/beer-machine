import os
from logging import getLogger

from peewee import SqliteDatabase, PrimaryKeyField, CharField, IntegerField, FloatField, BooleanField, Model
from playhouse.shortcuts import model_to_dict

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(CURRENT_DIR, 'default.db')
DB = SqliteDatabase(None)

logger = getLogger(__name__)


class Base(Model):
    class Meta:
        database = DB


class Employees(Base):
    id = PrimaryKeyField()
    name = CharField(max_length=100, null=True, default="Service user")
    password = CharField(max_length=100, null=False, default='0')
    login = CharField(null=False)

    @staticmethod
    def get_by_login_and_password(login, password):
        return map(model_to_dict, Employees.select().where(Employees.password == password, Employees.login == login))


class Beer(Base):
    id = PrimaryKeyField()
    name = CharField(max_length=100, null=False)
    price = FloatField(null=False, default=0)
    image = CharField(max_length=255, null=True)
    pulse_count = IntegerField(null=False, default=1000)
    is_active = BooleanField(null=False, default=False)

    @staticmethod
    def get_active():
        return Beer.select().where(Beer.is_active == True)

    @staticmethod
    def get_all():
        return Beer.select()


def create_database():
    logger.info("Creating database")
    DB.create_tables(Base.__subclasses__())
    logger.info("Database has been created")


def init_database(db_path=DB_PATH):
    DB.init(db_path)
