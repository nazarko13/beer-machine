import React from 'react';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';

import Button from 'common/components/Button';
import { beerTypes } from 'common/constants/enums';

import darkBeer from 'assets/images/dark.png';
import lightBeer from 'assets/images/light.png';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    width: '90%',
    fontSize: '1.1rem',
    borderRadius: 10,
    backgroundColor: '#8bbc2a',
    height: ({ height }) => height || 60,
    padding: spacing(0, 0.5),

    '&:hover': {
      backgroundColor: '#8bbc2a',
    },
  },
}));

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
      onMouseUp={handlePour}
      justifyContent="center"
      boxShadow="0 0 15px 0.1px #8bbc2a"
    >
      <Grid
        item
        container
        alt={name}
        width="100%"
        component="img"
        maxHeight={300}
        src={images[type] || lightBeer}
        style={{ objectFit: 'contain' }}
      />

      <Grid item container alignItems="center" justifyContent="center">
        <Button
          fullWidth
          size="large"
          color="neutral"
          classes={classes}
          text={`${name} ${price} UAH`}
        />
      </Grid>
    </Grid>
  );
};

export default BeerItem;
