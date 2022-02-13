import api from 'common/api';

import * as actionTypes from './actionTypes';

export const getBeers = (params) => ({
  type: actionTypes.getBeers,
  request: api.getBeers(params),
});

export const saveBeers = (params) => ({
  type: actionTypes.saveBeers,
  request: api.saveBeers(params),
});

export const getSystemInfo = () => ({
  type: actionTypes.getSystemInfo,
  request: api.getSystemSetting(),
});

export const setSystemInfo = (params) => ({
  type: actionTypes.setSystemInfo,
  request: api.setSystemSetting(params),
});
