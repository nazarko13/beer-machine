import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { healthStates, modalNames } from 'common/constants';
import { getError, getHealthState, getIsCooling } from '../ducks/selectors';
import { closeModal, openModal } from '../../modalHandler/ducks';
import { checkHealth } from '../ducks';

const checkInterval = 15 * 60000;

const useCheckHealthState = () => {
  const dispatch = useDispatch();
  const error = useSelector(getError);
  const isCooling = useSelector(getIsCooling);
  const healthState = useSelector(getHealthState);

  const isNotHealthy = useMemo(
    () => healthState === healthStates.notHealth,
    [healthState]
  );

  const invokeHealthStateError = useCallback(() => {
    if ((isNotHealthy && error) || isCooling) {
      dispatch(
        openModal({
          name: modalNames.healthStateMessage,
          title: isCooling ? 'Зачекайте, будь ласка.' : undefined,
          message: isCooling ? 'Апарат охолоджується!' : error.message,
        })
      );
    }
  }, [dispatch, error, isCooling, isNotHealthy]);

  const startCheckWithInterval = useCallback(() => {
    return setInterval(() => {
      dispatch(checkHealth());
    }, checkInterval);
  }, [dispatch]);

  useEffect(() => {
    invokeHealthStateError();
  }, [invokeHealthStateError]);

  useEffect(() => {
    if (!isCooling) {
      dispatch(closeModal(modalNames.healthStateMessage));
    }
  }, [dispatch, isCooling]);

  useEffect(() => {
    const interval = startCheckWithInterval();

    return () => {
      clearInterval(interval);
    };
  }, [startCheckWithInterval]);
};

export default useCheckHealthState;
