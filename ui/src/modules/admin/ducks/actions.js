import api from 'common/api';

import * as actionTypes from './actionTypes';

export const getBeers = (params) => ({
  type: actionTypes.getBeers,
  request: api.getBeers(params),
});

export const getDetails = () => ({
  type: actionTypes.getSystemInfo,
  request: api.getDetails(),
});

export const saveBeers = (params) => ({
  type: actionTypes.saveBeers,
  request: api.saveBeers(params),
});
