import React from 'react';
import Grid from '@mui/material/Grid';

import Button from 'common/components/Button';

import lagerImg from 'assets/images/lager.png';

const BeerItem = ({ name, image, price, handlePour }) => (
  <Grid
    item
    container
    xs={6}
    py={2}
    direction="column"
    onClick={handlePour}
    justifyContent="center"
  >
    <Grid
      item
      alt={name}
      width="100%"
      component="img"
      maxHeight={200}
      src={image || lagerImg}
      style={{ objectFit: 'contain' }}
    />

    <Grid item>
      <Button fullWidth size="large" text={`${name} ${price} UAH`} />
    </Grid>
  </Grid>
);

export default BeerItem;
