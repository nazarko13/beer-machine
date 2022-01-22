import React from 'react';
import { useSelector } from 'react-redux';

import AdminFlow from './AdminFlow';
import SuperAdminFlow from './SuperAdminFlow';
import { getIsSuperUser } from './ducks/selectors';
import { superAdminFieldSet, adminFieldSet } from './constants';

const Admin = () => {
  const isSuperUser = useSelector(getIsSuperUser);

  if (isSuperUser) {
    return <SuperAdminFlow fieldSet={superAdminFieldSet} />
  }

  return <AdminFlow fieldSet={adminFieldSet} />
};

export default Admin;
