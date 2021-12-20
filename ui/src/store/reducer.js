import { combineReducers } from '@reduxjs/toolkit';

import modules from 'modules';
import requestProvider from './requestProvider';

const rootReducer = combineReducers({
  home: modules.homeModule.reducer,
  admin: modules.adminModule.reducer,
  modals: modules.modalHandlerModule.reducer,
  requests: requestProvider.requestsReducer,
  notification: modules.notificationModule.reducer,
});

export default rootReducer;
