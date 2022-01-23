import time

from flask import jsonify, request
from flask.views import MethodView
from marshmallow import ValidationError

from models.models import Beer
from schemas.beer import BeerOutput


class BeerView(MethodView):
    def get(self):
        beers = BeerOutput.Schema(many=True).dump(Beer.get_all())
        if not beers:
            return jsonify({'description': 'No active beers'}), 400

        return jsonify(beers)

    def put(self):
        print(request.json)
        try:
            beers_to_update = BeerOutput.Schema(many=True).load(request.json)
        except ValidationError:
            return jsonify({"description": "Validation error"}), 400
        for beer in beers_to_update:
            Beer.update(
                {Beer.name: beer.name,
                 Beer.price: beer.price,
                 Beer.pulse_count: beer.pulse_count,
                 Beer.is_active: beer.is_active,
                 Beer.type: beer.type,
                 }
            ).where(Beer.id == beer.id).execute()
        return jsonify({'description': 'OK'})


class BeerActiveView(MethodView):
    def get(self):
        beers = BeerOutput.Schema(many=True).dump(Beer.get_active())
        if not beers:
            return jsonify({'description': 'No active beers'}), 400

        return jsonify(beers)


class BeerPourView(MethodView):
    def post(self):
        RESP["percent"] = 0
        RESP["finished"] = False
        req = request.json
        beer_id = req.get("beerId")
        if not beer_id:
            return jsonify({'description': 'beerId is required'}), 400
        # TODO implement pour logic here
        return jsonify({"description": "OK"})


RESP = {
    "percent": 0,
    "finished": False,
    "message": "pour started"
}


class BeerPourStatus(MethodView):
    def get(self):
        time.sleep(1)
        RESP["percent"] += 10
        if RESP["percent"] >= 100:
            RESP["finished"] = True
        return jsonify(RESP)
