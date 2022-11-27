import { createSlice } from '@reduxjs/toolkit';
import { success, error } from '@redux-requests/core';

import { preActionStateSetter, errorSetter } from 'common/utils';

import * as actionTypes from './actionTypes';

const initialState = {
  data: {
    beers: [],
    details: null,
    systemSettings: null,
  },
  error: null,
  loading: false,
};

const adminSlice = createSlice({
  name: actionTypes.moduleName,
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearState(state) {
      state.data = initialState.data;
    },
  },
  extraReducers: {
    [actionTypes.saveBeers]: preActionStateSetter,

    [success(actionTypes.saveBeers)]: (state) => {
      state.data.healthState = true;
      state.loading = false;
    },

    [error(actionTypes.saveBeers)]: errorSetter,

    [actionTypes.getBeers]: preActionStateSetter,

    [success(actionTypes.getBeers)]: (state, action) => {
      state.data.beers = action.response.data;
      state.loading = true;
    },

    [error(actionTypes.getBeers)]: (state) => {
      state.data.beers = [];
      state.loading = false;
    },

    [actionTypes.getSystemInfo]: preActionStateSetter,

    [success(actionTypes.getSystemInfo)]: (state, action) => {
      state.data.detail = action.response.data;
      state.loading = false;
    },

    [actionTypes.saveBeers]: (state) => {
      state.loading = true;
    },

    [success(actionTypes.saveBeers)]: (state, action) => {
      const { request } = action.meta?.requestAction || {};

      if (request?.data?.length) {
        state.data.beers = request.data;
      }

      state.loading = false;
    },

    [error(actionTypes.saveBeers)]: (state) => {
      state.loading = false;
    },

    [error(actionTypes.getSystemInfo)]: errorSetter,

    // system info
    [actionTypes.getSystemInfo]: preActionStateSetter,
    [success(actionTypes.getSystemInfo)]: (state, action) => {
      state.loading = false;
      state.data.details = action.response.data;
    },
    [error(actionTypes.getSystemInfo)]: (state) => {
      state.loading = false;
    },

    [actionTypes.setSystemInfo]: preActionStateSetter,
    [success(actionTypes.setSystemInfo)]: (state) => {
      state.loading = false;
    },
    [error(actionTypes.setSystemInfo)]: (state) => {
      state.loading = false;
    },

    // system settings
    [actionTypes.getSystemSettings]: preActionStateSetter,
    [success(actionTypes.getSystemSettings)]: (state, action) => {
      state.loading = false;
      state.data.systemSettings = action.response.data;
    },
    [error(actionTypes.getSystemSettings)]: (state) => {
      state.loading = false;
    },
  },
});

export const { clearState } = adminSlice.actions;

export default adminSlice.reducer;
