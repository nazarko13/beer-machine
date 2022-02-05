import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import logo from 'assets/images/logo.png';
import { PourProgress } from 'common/components';

const PourLoader = ({ progress }) => (
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
    style={{ backdropFilter: 'blur(3 px)' }}
  >
    <Grid
      item
      src={logo}
      width="250px"
      component="img"
      style={{ objectFit: 'contain' }}
    />

    <Grid
      item
      container
      py={2}
      width="70%"
      variant="h2"
      color="white"
      direction="column"
      textAlign="center"
      component={Typography}
      justifyContent="center"
    >
      ЗАЧЕКАЙТЕ, БУДЬ ЛАСКА, ВАШЕ ПИВО НАЛИВАЄТЬСЯ
    </Grid>

    <Grid item>
      <PourProgress progress={progress} />
    </Grid>
  </Grid>
);

export default PourLoader;
