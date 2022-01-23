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
  getDetails: (params = {}) => requests.getDataAction(apiUrls.details, params),
  saveBeers: (params = {}) => requests.putDataAction(apiUrls.beer, params),
};

export default api;
