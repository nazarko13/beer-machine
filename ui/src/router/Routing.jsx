import React from 'react';
import { Routes, BrowserRouter } from 'react-router-dom';

import ModalHandler from 'modules/modalHandler/ModalHandler';
import publicRoutes from './publicRoutes';
import privateRoutes from './privateRoutes';

const Routing = () => (
  <BrowserRouter>
    <Routes>
      {publicRoutes}

      {privateRoutes}
    </Routes>
    <ModalHandler />
  </BrowserRouter>
);

export default Routing;
