import React, { useCallback, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';

import BeerItem from './BeerItem';
import { getActiveBeers, pourBeer } from '../ducks';
import { getActiveBeersData } from '../ducks/selectors';

const Beers = () => {
  const dispatch = useDispatch();
  const data = useSelector(getActiveBeersData);

  const getActiveBears = useCallback(() => {
    dispatch(getActiveBeers());
  }, [dispatch]);

  const handlePourBeer = useCallback(
    (beer) => {
      dispatch(pourBeer({ beerId: beer.id }));
    },
    [dispatch]
  );

  useEffect(() => {
    getActiveBears();
  }, [getActiveBears]);

  return (
    <Grid
      container
      flex={1}
      wrap="nowrap"
      direction="column"
      alignItems="center"
    >
      {data.length ? (
        <>
          <Grid item py={2}>
            <Typography variant="h1" fontWeight={100}>
              Сьогодні в наливі
            </Typography>
          </Grid>

          <Grid
            item
            container
            pt={3}
            width="50%"
            spacing={1}
            justifyContent="space-between"
          >
            {data.map((item) => (
              <BeerItem
                key={item.name}
                {...item}
                handlePour={() => handlePourBeer(item)}
              />
            ))}
          </Grid>
        </>
      ) : (
        <Grid item py={8}>
          <Typography variant="h1" fontWeight={100}>
            Вибачте, доступних пив не знайдено
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default Beers;
