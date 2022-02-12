import { createSelector } from 'reselect';

import { systemInfoModelLabels, systemInfoModel } from '../constants';

const getAdminState = (store) => store.admin;
const getHomeState = (store) => store.home;

export const getData = createSelector(getAdminState, (state) => state.data);

export const getBeers = createSelector(getData, (data) => {
  const allBeers = data.beers || [];

  return allBeers.reduce((acc, val) => ({ ...acc, [val.id]: val }), {});
});

export const getDetails = createSelector(getData, (data) => data.details);

export const getIsSuperUser = createSelector(
  getHomeState,
  (state) => state.isSuperUser
);

export const getLoading = createSelector(
  getAdminState,
  (state) => state.loading
);

export const getErrors = createSelector(getAdminState, (state) => state.errors);

export const getSystemInfoData = createSelector(getDetails, (info) =>
  Object.keys(systemInfoModel).map((val) => ({
    id: val,
    value: info?.[val] || 'невідомо',
    label: systemInfoModelLabels[val],
  }))
);
