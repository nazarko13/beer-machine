export const errorSetter = (state, action) => {
  state.loading = false;
  state.error = action.error || action.response?.error || action.payload?.error;
};

export const preActionStateSetter = (state) => {
  state.loading = true;
};
