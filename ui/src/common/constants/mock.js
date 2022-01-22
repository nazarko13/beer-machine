import { beers, beerNames, beerTypes } from './enums';

export const allBeers = [
  {
    price: 50,
    pulseCount: 1550,
    id: beers.pilsner,
    name: beerNames[beers.pilsner],
    type: beerTypes.light,
    isActive: true,
  },
  {
    price: 45,
    pulseCount: 1545,
    id: beers.lager,
    name: beerNames[beers.lager],
    type: beerTypes.light,
    isActive: false,
  },
  {
    price: 50,
    pulseCount: 1550,
    id: beers.wien,
    name: beerNames[beers.wien],
    type: beerTypes.light,
    isActive: false,
  },
  {
    price: 55,
    pulseCount: 1555,
    id: beers.black,
    name: beerNames[beers.black],
    type: beerTypes.dark,
    isActive: true,
  },
  {
    price: 55,
    pulseCount: 1555,
    id: beers.goldenAle,
    name: beerNames[beers.goldenAle],
    type: beerTypes.light,
    isActive: false,
  },
  {
    price: 50,
    pulseCount: 1550,
    id: beers.ipa,
    name: beerNames[beers.ipa],
    type: beerTypes.light,
    isActive: true,
  },
];

export const beersInStock = allBeers.filter(({ isActive }) => isActive);
