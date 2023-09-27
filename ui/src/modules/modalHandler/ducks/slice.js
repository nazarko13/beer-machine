import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal(state, action) {
      const modal = action.payload;
      const existIndex = state.findIndex((m) => m.name === modal.name);

      if (existIndex >= 0) {
        const existModal = state[existIndex];
        const newState = [...state];

        newState[existIndex] = {
          name: existModal.name,
          props: { ...(existModal?.props || {}), ...(modal?.props || {}) },
        };

        return newState;
      }

      return [...state, modal];
    },

    closeModal(state, action) {
      const { payload } = action;

      const modalsToClose = [payload].flat().filter(Boolean);

      if (!modalsToClose.length) {
        return [];
      }

      return state.filter((m) => !modalsToClose.includes(m.name));
    },
  },
});

export const { openModal, closeModal } = modalsSlice.actions;

export default modalsSlice.reducer;
