import React from 'react';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';

import logo from 'assets/images/logo.png';
import Typography from '@mui/material/Typography';

const Loader = ({ text, withoutLogo }) => (
  <Grid
    top={0}
    left={0}
    bottom={0}
    right={0}
    container
    direction="column"
    position="absolute"
    alignItems="center"
    bgcolor="#00000050"
    justifyContent="center"
    style={{ backdropFilter: 'blur(3 px)', zIndex: 90000 }}
  >
    {!withoutLogo && (
      <Grid
        item
        src={logo}
        width="250px"
        component="img"
        style={{ objectFit: 'contain' }}
      />
    )}

    <Grid
      item
      container
      py={2}
      width="60%"
      variant="h2"
      color="white"
      direction="column"
      textAlign="center"
      component={Typography}
      justifyContent="center"
    >
      {text || 'Зачекайте, будь ласка.'}
    </Grid>

    <Grid item width="60%">
      <LinearProgress color="primary" />
    </Grid>
  </Grid>
);

export default Loader;
