import { createSelector } from 'reselect';

import { healthStates } from 'common/constants';

const getHomeState = (store) => store.home;

const getHomeData = createSelector(getHomeState, (state) => state.data);

export const getLoading = createSelector(
  getHomeState,
  (state) => state.loading
);

export const getPourLoading = createSelector(
  getHomeState,
  (state) => state.pourLoading
);

export const getError = createSelector(getHomeState, (state) => state.error);

export const getProgress = createSelector(getHomeData, (data) => data.progress);

export const getHealthState = createSelector(getHomeData, (data) => {
  const health = data.healthState;

  if (typeof health !== 'boolean') {
    return healthStates.unknown;
  }

  return health ? healthStates.health : healthStates.notHealth;
});

export const getActiveBeersData = createSelector(
  getHomeData,
  (data) => data.beers
);
