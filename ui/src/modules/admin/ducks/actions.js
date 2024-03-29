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

export const addNewBeer = (data) => ({
  type: actionTypes.addNewBeer,
  request: api.addNewBeer(data),
});

export const getSystemInfo = () => ({
  type: actionTypes.getSystemInfo,
  request: api.getSystemSetting(),
});

export const setSystemInfo = (params) => ({
  type: actionTypes.setSystemInfo,
  request: api.setSystemSetting(params),
});

export const sendSanitizeAction = (params) => ({
  type: actionTypes.setSystemInfo,
  request: api.sendSanitizeAction(params),
});

export const getSystemSettings = () => ({
  type: actionTypes.getSystemSettings,
  request: api.getSystemSettings(),
});

export const updateSystemSettings = (params) => ({
  type: actionTypes.updateSystemSettings,
  request: api.updateSystemSettings(params),
});

export const testPourBeer = (data) => ({
  type: actionTypes.testPourBeer,
  request: api.testPourBeer(data),
});

export const testPrint = (data) => ({
  type: actionTypes.testPrint,
  request: api.testPrint(data),
});

export const washing = (data) => ({
  type: actionTypes.washing,
  request: api.startWashing(data),
});
