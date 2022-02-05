import { createSlice } from '@reduxjs/toolkit';
import { success, error } from '@redux-requests/core';

import { errorSetter, preActionStateSetter } from 'common/utils';

import * as actionTypes from './actionTypes';

const initialState = {
  data: {
    beers: [],
    progress: 0,
    healthState: null,
  },
  error: null,
  loading: false,
  isSuperUser: false,
  pourLoading: false,
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
    },

    [error(actionTypes.checkHealth)]: (state) => {
      state.data.healthState = false;
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
    },

    [error(actionTypes.pourBeer)]: (state) => {
      state.pourLoading = false;
    },
  },
});

export default stockSlice.reducer;
