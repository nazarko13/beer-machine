import api from 'common/api';

import * as actionTypes from './actionTypes';

export const checkHealth = () => ({
  type: actionTypes.checkHealth,
  request: api.checkHealth(),
});

export const getActiveBeers = () => ({
  type: actionTypes.getBeers,
  request: api.getActiveBeers(),
});

export const pourBeer = (data) => ({
  type: actionTypes.pourBeer,
  request: api.pourBeer(data),
});

export const adminLogin = (params) => ({
  type: actionTypes.adminLogin,
  request: api.adminLogin(params),
});

export const getPourStatus = () => ({
  type: actionTypes.pourStatus,
  request: api.getPourStatus(),
});

export const startWashing = (payload) => ({
  type: actionTypes.startWashing,
  request: api.startWashing(payload),
});

export const getSystemSettings = () => ({
  type: actionTypes.getSystemSettings,
  request: api.getSystemSettings(),
});
