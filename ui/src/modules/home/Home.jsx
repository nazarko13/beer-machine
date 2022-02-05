import React, { useCallback, useEffect, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';

import { healthStates } from 'common/constants';
import { Loader } from 'common/components';

import {
  getHealthState,
  getLoading,
  getPourLoading,
  getProgress,
} from './ducks/selectors';
import { AdminAccessControls } from './components';
import PourLoader from './components/PourLoader';
import { useCheckHealthState } from './hooks';
import Beers from './components/Beers';
import { checkHealth } from './ducks';

const Home = () => {
  const dispatch = useDispatch();
  const loading = useSelector(getLoading);
  const pourLoading = useSelector(getPourLoading);
  const healthState = useSelector(getHealthState);
  const pourProgress = useSelector(getProgress);

  const isHealthy = useMemo(
    () => healthStates.health === healthState,
    [healthState]
  );

  const checkHealthState = useCallback(() => {
    dispatch(checkHealth());
  }, [dispatch]);

  useEffect(() => {
    checkHealthState();
  }, [checkHealthState]);

  useCheckHealthState();

  return (
    <Grid container height="100%">
      <AdminAccessControls />

      {isHealthy && <Beers />}

      {loading && <Loader />}

      {pourLoading && <PourLoader progress={pourProgress} />}
    </Grid>
  );
};

export default Home;
