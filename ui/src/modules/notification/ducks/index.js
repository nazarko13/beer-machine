import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  message: '',
  type: null,
  undoable: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.message = action?.payload?.message;
      state.type = action?.payload?.type;
      state.autoHideDuration = action?.payload?.autoHideDuration;
    },

    hideNotification: (state) => {
      state.message = null;
      state.type = null;
      state.udoable = null;
      state.autoHideDuration = null;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
