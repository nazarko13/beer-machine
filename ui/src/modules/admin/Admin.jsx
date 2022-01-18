import React from 'react';

import AdminFlow from './AdminFlow';
import SuperAdminFlow from './SuperAdminFlow';
import { superAdminFieldSet, adminFieldSet } from './constants';

const Admin = () => {
  const isSuperUser = false;

  if (isSuperUser) {
    return <SuperAdminFlow fieldSet={superAdminFieldSet} />
  }

  return <AdminFlow fieldSet={adminFieldSet} />
};

export default Admin;
