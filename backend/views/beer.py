from flask import jsonify, request
from flask.views import MethodView
from marshmallow import ValidationError

from devices.beer_board import pour_beer_flow, system_cleaning_flow
from models.models import Beer
from schemas.beer import BeerOutput, BeerPourInput


class BeerView(MethodView):
    def get(self):
        beers = BeerOutput.Schema(many=True).dump(Beer.get_all())
        if not beers:
            return jsonify({'description': 'No active beers'}), 400

        return jsonify(beers)

    def put(self):
        try:
            beers_to_update = BeerOutput.Schema(many=True).load(request.json)
        except ValidationError as e:
            return jsonify({"description": str(e), "error": "Validation error"}), 400
        for beer in beers_to_update:
            Beer.update(
                {Beer.name: beer.name,
                 Beer.price: beer.price,
                 Beer.type: beer.type,
                 Beer.pulse_count: beer.pulse_count,
                 Beer.is_active: beer.is_active,
                 Beer.barcode: beer.barcode,
                 Beer.description: beer.description,
                 Beer.keg: beer.keg,
                 Beer.quantity: beer.quantity
                 }
            ).where(Beer.id == beer.id).execute()
        return jsonify({'description': 'OK'})


class BeerActiveView(MethodView):
    def get(self):
        beers = BeerOutput.Schema(many=True).dump(Beer.get_active())
        if not beers:
            return jsonify({'description': 'No active beers'}), 400

        return jsonify(beers)


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
        if pour_beer_flow(beer_to_pour.keg, beer_to_pour.pulse_count, callback_function):
            Beer.update(quantity=Beer.quantity - 1).where(Beer.id == beer_to_pour.id).execute()
            return jsonify({"description": "OK"})
        else:
            return jsonify({"description": "Something went wrong"}), 400


class BeerSystemCleaning(MethodView):
    def post(self):
        if system_cleaning_flow():
            return jsonify({"description": "OK"})
        else:
            return jsonify({"description": "Something went wrong"}), 400
