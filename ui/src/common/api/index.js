import { apiUrls } from 'common/constants';
import { requests } from 'common/services';

const api = {
  checkHealth: () => requests.getDataAction(apiUrls.health),
  getBeers: (params = {}) => requests.getDataAction(apiUrls.beer, params),
  getActiveBeers: (params = {}) =>
    requests.getDataAction(apiUrls.activeBeer, params),
  pourBeer: (data = {}) => requests.postDataAction(apiUrls.pour, data),
  getPourStatus: () => requests.getDataAction(apiUrls.pourStatus),
  adminLogin: (params = {}) => requests.getDataAction(apiUrls.admin, params),
  saveBeers: (params = {}) => requests.putDataAction(apiUrls.beer, params),
  startWashing: (data) => requests.postDataAction(apiUrls.cleaning, data),
  getSystemSetting: () => requests.getDataAction(apiUrls.systemStatus),
  setSystemSetting: (params) => requests.postDataAction(apiUrls.system, params),
  sendSanitizeAction: (params) =>
    requests.postDataAction(apiUrls.sanitization, params),
};

export default api;
