import React from 'react';
import { Provider } from 'react-redux';
import 'react-simple-keyboard/build/css/index.css';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import store from './store';
import theme from './theme';
import Router from './router';
import notificationModule from './modules/notification';

const Notification = notificationModule.component;

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router />
      <Notification />
    </ThemeProvider>
  </Provider>
);

export default App;
