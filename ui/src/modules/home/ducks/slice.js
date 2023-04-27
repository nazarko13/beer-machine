import { createSlice } from '@reduxjs/toolkit';
import { success, error } from '@redux-requests/core';

import { errorSetter, preActionStateSetter } from 'common/utils';

import * as actionTypes from './actionTypes';

const initialState = {
  data: {
    beers: [],
    progress: 0,
    healthState: null,
    isCooling: false,
  },
  error: null,
  loading: false,
  isSuperUser: false,
  pourLoading: false,
  systemSetting: {},
};

const stockSlice = createSlice({
  name: actionTypes.moduleName,
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: {
    [success(actionTypes.checkHealth)]: (state) => {
      state.data.healthState = true;
      state.data.isCooling = false;
    },

    [error(actionTypes.checkHealth)]: (state, action) => {
      state.data.healthState = false;
      state.data.isCooling = action.error.response.status === 400;
    },

    [actionTypes.getBeers]: preActionStateSetter,

    [success(actionTypes.getBeers)]: (state, action) => {
      state.data.beers = action.response.data;
      state.loading = false;
    },

    [success(actionTypes.pourStatus)]: (state, action) => {
      const { percent, finished } = action.response.data;
      state.data.progress = percent;

      if (finished) {
        state.pourLoading = false;
        state.data.progress = 0;
      }
    },

    [success(actionTypes.adminLogin)]: (state, action) => {
      const { isSuperuser } = action.response.data;
      state.isSuperUser = isSuperuser;
    },

    [error(actionTypes.getBeers)]: errorSetter,

    [actionTypes.pourBeer]: (state) => {
      state.pourLoading = true;
    },

    [success(actionTypes.pourBeer)]: (state) => {
      state.pourLoading = false;
      state.data.progress = 0;
    },

    [success(actionTypes.getSystemSettings)]: (state, action) => {
      state.systemSetting = action.response.data;
    },

    [error(actionTypes.pourBeer)]: (state) => {
      state.pourLoading = false;
      state.data.progress = 0;
    },
  },
});

export default stockSlice.reducer;
