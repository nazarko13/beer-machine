import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { healthStates, modalNames } from 'common/constants';
import { getError, getHealthState } from '../ducks/selectors';
import { openModal } from '../../modalHandler/ducks';
import { checkHealth } from '../ducks';

const checkInterval = 1000 * 30 * 60;

const useCheckHealthState = () => {
  const dispatch = useDispatch();
  const error = useSelector(getError);
  const healthState = useSelector(getHealthState);

  const isNotHealthy = useMemo(
    () => healthState === healthStates.notHealth,
    [healthState]
  );

  const invokeHealthStateError = useCallback(() => {
    if (isNotHealthy && error) {
      dispatch(
        openModal({
          name: modalNames.healthStateMessage,
          message: error.message,
        })
      );
    }
  }, [dispatch, error, isNotHealthy]);

  const startCheckWithInterval = useCallback(() => {
    return setInterval(() => {
      dispatch(checkHealth());
    }, checkInterval);
  }, [dispatch]);

  useEffect(() => {
    invokeHealthStateError();
  }, [invokeHealthStateError]);

  useEffect(() => {
    const interval = startCheckWithInterval();

    return () => clearInterval(interval);
  }, [startCheckWithInterval]);
};

export default useCheckHealthState;
