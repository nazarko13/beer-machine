import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const TabItem = ({ active, name, value, count, handleTabClick }) => {
  const tabClick = () => handleTabClick(value);

  return (
    <Grid
      item
      container
      onClick={tabClick}
      alignItems="center"
      justifyContent="center"
      xs={Math.floor(12 / count)}
      bgcolor={active ? 'background.main50' : 'background.primary'}
    >
      <Typography>{name}</Typography>
    </Grid>
  );
};

const Tabs = ({ tabs, activeTab, handleChangeTab }) => (
  <Grid
    container
    height={50}
    wrap="nowrap"
    bgcolor="background.primary"
    boxShadow="0 0 10px rgb(0 0 0 / 10%)"
  >
    {tabs.map((tab) => (
      <TabItem
        {...tab}
        count={tabs.length}
        key={tab.name || tab.value}
        active={tab.value === activeTab}
        handleTabClick={handleChangeTab}
      />
    ))}
  </Grid>
);

export default Tabs;
