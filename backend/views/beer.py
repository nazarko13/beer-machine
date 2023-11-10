from datetime import date, timedelta

from flask import jsonify, request
from flask.views import MethodView
from marshmallow import ValidationError

from devices.beer_board import pour_beer_flow, system_cleaning_flow, pour_beer_test_flow
from devices.printing import print_receipt
from models.models import Beer
from schemas.beer import BeerOutput, BeerPourInput, BeerInput
from settings import TEST_BEER_POUR_DIVIDER


class BeerView(MethodView):
    def get(self):
        beers = BeerOutput.Schema(many=True).dump(Beer.get_all())
        if not beers:
            return jsonify({'description': 'No beers'}), 400

        return jsonify(beers)

    def put(self):
        try:
            beers_to_update = BeerOutput.Schema(many=True).load(request.json)
        except ValidationError as e:
            return jsonify({"description": str(e), "error": "Validation error"}), 400
        for beer in beers_to_update:
            beer_from_db = Beer.get(Beer.id == beer.id)
            if beer_from_db.quantity != beer.quantity:
                Beer.update({
                    Beer.filling_date: date.today(),
                    Beer.expiration_date: date.today() + timedelta(days=beer.days_to_expire)
                }).where(Beer.id == beer.id).execute()
            Beer.update(
                {Beer.name: beer.name,
                 Beer.price: beer.price,
                 Beer.type: beer.type,
                 Beer.pulse_count: beer.pulse_count,
                 Beer.is_active: beer.is_active,
                 Beer.barcode: beer.barcode,
                 Beer.description: beer.description,
                 Beer.keg: beer.keg,
                 Beer.quantity: beer.quantity,
                 Beer.days_to_expire: beer.days_to_expire
                 }
            ).where(Beer.id == beer.id).execute()
        return jsonify({'description': 'OK'})

    def post(self):
        try:
            beer_to_create = BeerInput.Schema().load(request.json)
        except ValidationError as e:
            return jsonify({"description": str(e), "error": "Validation error"}), 400
        created_beer = Beer.create(
            name=beer_to_create.name,
            price=beer_to_create.price,
            type=beer_to_create.type,
            pulse_count=beer_to_create.pulse_count,
            barcode=beer_to_create.barcode,
            description=beer_to_create.description,
            keg=beer_to_create.keg,
            quantity=beer_to_create.quantity,
            filling_date=date.today(),
            expiration_date=date.today() + timedelta(days=beer_to_create.days_to_expire),
            days_to_expire=beer_to_create.days_to_expire
        )
        return jsonify(BeerOutput.Schema().dump(created_beer))


class BeerActiveView(MethodView):
    def get(self):
        beers = BeerOutput.Schema(many=True).dump(Beer.get_active())
        if not beers:
            return jsonify([])

        return jsonify(beers)


# TODO change approach with RESP
RESP = {}


def callback_function(process_percent: int, message: str = "", finished: bool = False):
    RESP["percent"] = process_percent
    RESP["message"] = message
    RESP["finished"] = finished


class BeerPourStatus(MethodView):
    def get(self):
        return jsonify(RESP)


class BeerPourView(MethodView):
    def post(self):
        try:
            beer_to_pour = BeerPourInput.Schema().load(request.json)
        except ValidationError as e:
            return jsonify({"description": str(e), "error": "Validation error"}), 400
        if pour_beer_flow(beer_to_pour.keg, beer_to_pour.id, beer_to_pour.pulse_count, callback_function):
            return jsonify({"description": "OK"})
        else:
            return jsonify({"description": "Something went wrong"}), 400


class BeerPourTestView(MethodView):
    def post(self):
        try:
            beer_to_pour = BeerPourInput.Schema().load(request.json)
        except ValidationError as e:
            return jsonify({"description": str(e), "error": "Validation error"}), 400
        if pour_beer_test_flow(beer_to_pour.keg, int(beer_to_pour.pulse_count / TEST_BEER_POUR_DIVIDER)):
            return jsonify({"description": "OK"})
        else:
            return jsonify({"description": "Something went wrong"}), 400


class BeerSystemCleaning(MethodView):
    def post(self):
        resp = request.json
        force = resp.get("force") if resp else False
        if system_cleaning_flow(force):
            return jsonify({"description": "OK"})
        else:
            return jsonify({"description": "Something went wrong"}), 400


class PrinterView(MethodView):

    def post(self):
        try:
            beer_id = request.json["id"]
        except KeyError as e:
            return jsonify({"description": str(e), "error": "Validation error"}), 400
        beer = Beer.get(Beer.id == beer_id)
        if not beer:
            return jsonify({"description": "Beer not found"}), 404
        print_receipt(beer.barcode, beer.description, beer.filling_date, beer.expiration_date)
        return jsonify({"description": "OK"})
