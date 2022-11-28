import { createSelector } from 'reselect';

export const getModalState = (store) => store.modals;

export const getIsModalOpened = (name) =>
  createSelector(
    getModalState,
    (state) => !!state.find((m) => m.name === name)
  );
