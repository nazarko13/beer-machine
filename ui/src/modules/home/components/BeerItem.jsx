import React from 'react';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';

import Button from 'common/components/Button';
import { beerTypes } from 'common/constants/enums';

import darkBeer from 'assets/images/dark.png';
import lightBeer from 'assets/images/light.png';

const useStyles = makeStyles({
  root: {
    fontSize: '1.1rem',
    borderRadius: 10,
    backgroundColor: '#8bbc2a',
    height: ({ height }) => height || 60,
  },
});

const images = {
  [beerTypes.light]: lightBeer,
  [beerTypes.dark]: darkBeer,
};


const BeerItem = ({ name, price, type, handlePour }) => {
  const classes = useStyles();

  return (
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
        src={images[type] || lightBeer}
        style={{ objectFit: 'contain' }}
      />

      <Grid item>
        <Button
          fullWidth
          size="large"
          classes={classes}
          text={`${name} ${price} UAH`}
        />
      </Grid>
    </Grid>
  );
};

export default BeerItem;
