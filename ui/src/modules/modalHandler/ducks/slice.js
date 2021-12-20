import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: null,
  props: {},
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal(state, action) {
      state.name = action.payload.name;
      state.props = action.payload;
    },

    closeModal(state) {
      state.name = null;
      state.props = null;
    },
  },
});

export const { openModal, closeModal } = modalsSlice.actions;

export default modalsSlice.reducer;
