import React from 'react';
import { Route } from 'react-router-dom';

import { routes } from 'common/constants';
import modules from 'modules';

const Admin = modules.adminModule.component;

const privateRoutes = (
  <Route path="/">
    <Route path={routes.private.admin} element={<Admin />} />
    <Route path={routes.private.superAdmin} element={<Admin isSuper />} />
  </Route>
);

export default privateRoutes;
