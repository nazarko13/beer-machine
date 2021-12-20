import React from 'react';
import { Route } from 'react-router-dom';

import { routes } from 'common/constants';
import modules from 'modules';

const Home = modules.homeModule.component;

const publicRoutes = (
  <Route path="/">
    <Route index path={routes.public.home} element={<Home />} />
  </Route>
);

export default publicRoutes;
