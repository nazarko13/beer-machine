import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { modalNames } from 'common/constants';

import moment from 'moment';
import { openModal, closeModal } from '../../modalHandler/ducks';
import { getModalName } from '../../modalHandler/ducks/selectors';
import { getSystemSettings } from '../ducks';

const checkInterval = 15 * 10000;

const useCheckWorkingHours = () => {
  const dispatch = useDispatch();
  const modalName = useSelector(getModalName);

  const isWorkingHoursAlert = useMemo(
    () => modalName === modalNames.workingHours,
    [modalName]
  );

  const invokeWorkingHoursError = useCallback(
    (from, to) => {
      dispatch(
        openModal({
          name: modalNames.workingHours,
          title: 'Апарат не працює',
          message: `Робочі години з ${from}:00 по ${to}:00.`,
        })
      );
    },
    [dispatch]
  );

  const checkHours = useCallback(async () => {
    try {
      const { data } = await dispatch(getSystemSettings());
      const currentHour = moment().hour();
      const { fromHour, toHour } = data.workingHours;

      const isWorking = currentHour >= fromHour && currentHour < toHour;

      if (!isWorking) {
        invokeWorkingHoursError(fromHour, toHour);
      }

      if (isWorking && isWorkingHoursAlert) {
        dispatch(closeModal());
      }
    } catch (e) {
      console.error(e);
    }
  }, [dispatch, isWorkingHoursAlert, invokeWorkingHoursError]);

  const startCheckWithInterval = useCallback(() => {
    return setInterval(() => checkHours(), checkInterval);
  }, [checkHours]);

  useEffect(() => {
    checkHours();
  }, [checkHours]);

  useEffect(() => {
    const interval = startCheckWithInterval();

    return () => clearInterval(interval);
  }, [startCheckWithInterval]);
};

export default useCheckWorkingHours;
