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

const getDoorSensorValue = (v) => (v ? 'Активний' : 'Неактивний');

export const getSystemInfoData = createSelector(getDetails, (info) =>
  Object.keys(systemInfoModel).map((val) => {
    const value = info?.[val];

    return {
      id: val,
      value:
        typeof value === 'boolean'
          ? getDoorSensorValue(value)
          : value || 'невідомо',
      label: systemInfoModelLabels[val],
    };
  })
);

export const getStateSystemSettings = createSelector(
  getData,
  (data) => data.systemSettings
);
