import { createSlice } from '@reduxjs/toolkit';
import { success, error } from '@redux-requests/core';

import { preActionStateSetter, errorSetter } from 'common/utils';

import * as actionTypes from './actionTypes';

const initialState = {
  data: {
    beers: null,
    details: null,
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

    [error(actionTypes.getSystemInfo)]: errorSetter,
  },
});

export default adminSlice.reducer;
