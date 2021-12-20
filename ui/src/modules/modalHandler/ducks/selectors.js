import { createSelector } from 'reselect';

const getModalState = (store) => store.modals;

export const getModalName = createSelector(
  getModalState,
  (state) => state.name
);

export const getModalProps = createSelector(
  getModalState,
  (state) => state.props
);
