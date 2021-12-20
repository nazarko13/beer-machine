import time

from flask import jsonify, request
from flask.views import MethodView
from playhouse.shortcuts import dict_to_model

from models.models import Beer
from schemas.beer import BeerOutput


class BeerView(MethodView):
    def get(self):
        beers = BeerOutput.Schema(many=True).dump(Beer.get_all())
        if not beers:
            return jsonify({'description': 'No active beers'}), 400

        return jsonify(beers)

    def put(self):
        beers_to_update = BeerOutput.Schema(many=True).load(request.json)
        for beer in beers_to_update:
            Beer.update(
                {Beer.name: beer.name,
                 Beer.price: beer.price,
                 Beer.pulse_count: beer.pulse_count}
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
        req = request.json
        beer_id = req.get("beerId")
        if not beer_id:
            return jsonify({'description': 'beerId is required'}), 400
        # TODO implement pour logic here
        time.sleep(5)
        return jsonify({"description": "OK"})
