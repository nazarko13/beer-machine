import React, { useCallback, useEffect, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';

import { healthStates } from 'common/constants';
import { Loader } from 'common/components';

import { getHealthState, getLoading, getPourLoading } from './ducks/selectors';
import { AdminAccessControls } from './components';
import { useCheckHealthState } from './hooks';
import Beers from './components/Beers';
import { checkHealth } from './ducks';

const Home = () => {
  const dispatch = useDispatch();
  const loading = useSelector(getLoading);
  const pourLoading = useSelector(getPourLoading);
  const healthState = useSelector(getHealthState);

  const isLoading = pourLoading || loading;

  const loadingMessage = pourLoading
    ? 'Зачекайте, будь ласка, Ваше пиво наливається.'
    : 'Зачекайте, будь ласка.';

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

      {isLoading && <Loader text={loadingMessage} />}
    </Grid>
  );
};

export default Home;
