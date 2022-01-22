import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';

import { healthStates } from 'common/constants';
import { Loader } from 'common/components';

import { getHealthState, getLoading, getPourLoading, getProgress } from './ducks/selectors';
import { AdminAccessControls } from './components';
import { checkHealth, getPourStatus } from './ducks';
import PourLoader from './components/PourLoader';
import { useCheckHealthState } from './hooks';
import Beers from './components/Beers';

const useGetPourStatus = () => {
  const dispatch = useDispatch();
  const pourLoading = useSelector(getPourLoading);
  const [_, setCurrentInterval] = useState(null);

  const getStatus = useCallback(() => {
    if (!pourLoading) {
      setCurrentInterval(i => {
        clearInterval(i);
        return null;
      });

      return;
    }

    const int = setInterval(() => {
      dispatch(getPourStatus()).then((data) => {
        console.log(data);
        if (data.finished) {
          setCurrentInterval(i => {
            console.log(i);
            clearInterval(i);
            return null;
          })
        }
      });
    }, 2000);

    setCurrentInterval(int);
  }, [pourLoading, dispatch]);

  useEffect(() => {
      getStatus();
  }, [getStatus])
};

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

  useGetPourStatus();

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
