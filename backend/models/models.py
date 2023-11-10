import datetime
import os
from enum import Enum
from logging import getLogger

from peewee import SqliteDatabase, PrimaryKeyField, CharField, IntegerField, FloatField, BooleanField, Model, DateField, \
    DateTimeField

from settings import ACTIVE_BEERS_QTY, DAYS_TO_EXPIRE

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
    login = CharField(null=False, unique=True)
    is_superuser = BooleanField(null=False, default=False)

    @staticmethod
    def get_by_login_and_password(login, password):
        return Employees.select().where(Employees.password == password, Employees.login == login)


class BeerType(Enum):
    LIGHT = "light",
    DARK = "dark"


class Beer(Base):
    id = PrimaryKeyField()
    name = CharField(max_length=100, null=False)
    price = FloatField(null=False, default=0)
    type = CharField(max_length=255, choices=BeerType, null=True)
    pulse_count = IntegerField(null=False, default=1000)
    is_active = BooleanField(null=False, default=False)
    barcode = CharField(max_length=13, null=False, default="123")
    description = CharField(max_length=500, null=True)
    keg = CharField(max_length=20, null=True)
    quantity = IntegerField(null=False, default=0)
    filling_date = DateField(null=True)
    expiration_date = DateField(null=True)
    days_to_expire = IntegerField(null=False, default=DAYS_TO_EXPIRE)

    @staticmethod
    def get_active():
        return Beer.select().where(
            Beer.is_active == True,
            Beer.quantity > 1,
            Beer.keg.in_(("BEER_KEG_1", "BEER_KEG_2", "BEER_KEG_3", "BEER_KEG_4")),
            Beer.expiration_date > datetime.date.today()
        ).limit(ACTIVE_BEERS_QTY)

    @staticmethod
    def get_all():
        return Beer.select()

    @staticmethod
    def update_quantity(beer_id):
        beer = Beer.select().where(Beer.id == beer_id).get()
        beer.quantity = beer.quantity - 1
        beer.save()
        return beer


class SystemSettings(Base):
    id = PrimaryKeyField()
    config = CharField(null=False, default='{"workingHours": {"fromHour": 10, "toHour": 12}}')

    @staticmethod
    def get_first():
        return SystemSettings.get_or_none(SystemSettings.id == 1)


class BeerStatistics(Base):
    id = PrimaryKeyField()
    beer_name = CharField(max_length=100, null=False)
    pour_date = DateTimeField(default=datetime.datetime.now)
    remains = IntegerField(default=1, null=False)
    status = CharField(max_length=13, null=False, default="OK")
    error_message = CharField(max_length=250, null=False, default="")


def create_database():
    logger.info("Creating database")
    DB.create_tables(Base.__subclasses__())
    logger.info("Database has been created")


def init_database(db_path=DB_PATH):
    DB.init(db_path)
