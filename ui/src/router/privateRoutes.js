import React from 'react';
import { Route } from 'react-router-dom';

import { routes } from 'common/constants';
import modules from 'modules';

const Admin = modules.adminModule.component;

const privateRoutes = (
  <Route path={routes.private.admin}>
    <Route path={routes.private.admin} element={<Admin />} />
  </Route>
);

export default privateRoutes;
