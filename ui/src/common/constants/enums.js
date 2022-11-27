import { createEnum } from 'common/utils';

import ipaImage from 'assets/images/ipa.png';
import wienImage from 'assets/images/wien.png';
import blackImage from 'assets/images/black.png';
import lagerImage from 'assets/images/lager.png';
import pilsnerImage from 'assets/images/pilsner.png';
import goldenAleImage from 'assets/images/goldenAle.png';

export const beers = createEnum({
  pilsner: null,
  lager: null,
  wien: null,
  black: null,
  goldenAle: null,
  ipa: null,
});

export const beerNames = createEnum({
  [beers.pilsner]: 'Pilsner',
  [beers.lager]: 'Lager',
  [beers.wien]: 'Wien',
  [beers.black]: 'Black',
  [beers.goldenAle]: 'Golden Ale',
  [beers.ipa]: 'India Pale Ale',
});

export const beerImages = createEnum({
  [beers.pilsner]: pilsnerImage,
  [beers.lager]: lagerImage,
  [beers.wien]: wienImage,
  [beers.black]: blackImage,
  [beers.goldenAle]: goldenAleImage,
  [beers.ipa]: ipaImage,
});

export const modalNames = createEnum({
  adminAuth: null,
  message: null,
  workingHours: null,
  healthStateMessage: null,
});

export const healthStates = createEnum({
  health: null,
  unknown: null,
  notHealth: null,
});

export const notificationTypes = createEnum({
  success: null,
  error: null,
  info: null,
  warning: null,
});

export const beerTypes = createEnum({
  light: null,
  dark: null,
});

export const beerLabels = createEnum({
  [beerTypes.light]: 'Світле',
  [beerTypes.dark]: 'Темне',
});
