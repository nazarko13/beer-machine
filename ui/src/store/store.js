import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducer';
import requestProvider from './requestProvider';

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(requestProvider?.requestsMiddleware),
});

export default store;
