import React, { useState } from 'react';
import Grid from '@mui/material/Grid';

import { Tabs } from 'common/components';
import { adminTabs, tabKeys } from './constants';
import SettingsForm from './components/SettingsForm';
import SystemInfo from './components/SystemInfo';

const Admin = ({ fieldSet }) => {
  const [activeTab, setActiveTab] = useState(tabKeys.settingsForm);

  return (
    <Grid container wrap="nowrap" minHeight="100%" direction="column">
      <Grid item container position="fixed" zIndex={10}>
        <Tabs
          tabs={adminTabs}
          activeTab={activeTab}
          handleChangeTab={setActiveTab}
        />
      </Grid>

      <Grid xs item container mt={6} flex={1} bgcolor="#ffffff90">
        {
          {
            [tabKeys.settingsForm]: <SettingsForm fieldSet={fieldSet} />,
            [tabKeys.systemInfo]: <SystemInfo />,
          }[activeTab]
        }
      </Grid>
    </Grid>
  );
};

export default Admin;
