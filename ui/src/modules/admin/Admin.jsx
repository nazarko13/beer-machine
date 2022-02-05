import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AdminFlow from './AdminFlow';
import SuperAdminFlow from './SuperAdminFlow';
import { getIsSuperUser } from './ducks/selectors';
import { superAdminFieldSet, adminFieldSet } from './constants';
import * as actions from './ducks';

const Admin = () => {
  const dispatch = useDispatch();
  const isSuperUser = useSelector(getIsSuperUser);

  const getAllBeers = useCallback(() => {
    dispatch(actions.getBeers());
  }, [dispatch]);

  useEffect(() => getAllBeers(), [getAllBeers]);

  if (isSuperUser) {
    return <SuperAdminFlow fieldSet={superAdminFieldSet} />;
  }

  return <AdminFlow fieldSet={adminFieldSet} />;
};

export default Admin;
