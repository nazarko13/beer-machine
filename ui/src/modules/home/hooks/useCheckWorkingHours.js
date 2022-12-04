import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { modalNames } from 'common/constants';

import { openModal, closeModal } from '../../modalHandler/ducks';
import { getIsModalOpened } from '../../modalHandler/ducks/selectors';
import { getSystemSettings } from '../ducks';

const checkInterval = 15 * 10000;

const useCheckWorkingHours = () => {
  const dispatch = useDispatch();
  const isWorkingHoursAlert = useSelector(
    getIsModalOpened(modalNames.workingHours)
  );

  const invokeWorkingHoursError = useCallback(
    (from, to) => {
      dispatch(
        openModal({
          name: modalNames.workingHours,
          title: 'Апарат не працює',
          message: `Робочі години з ${from} по ${to}.`,
        })
      );
    },
    [dispatch]
  );

  const checkHours = useCallback(async () => {
    try {
      const { data } = await dispatch(getSystemSettings());
      const currentHour = moment().hour();
      const currentMinutes = moment().minutes();
      const currentTime = currentHour + currentMinutes / 60;
      const { fromHour, toHour } = data.workingHours;

      const [fromH, fromM] = (fromHour || '').split(':').map(Number);
      const [toH, toM] = (toHour || '').split(':').map(Number);

      const from = fromH + fromM / 60;
      const to = toH + toM / 60;

      const isWorking = currentTime >= from && currentTime < to;

      if (!isWorking && !isWorkingHoursAlert) {
        invokeWorkingHoursError(fromHour, toHour);
      }

      if (isWorking && isWorkingHoursAlert) {
        dispatch(closeModal(modalNames.workingHours));
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

  useEffect(
    () => () => dispatch(closeModal(modalNames.workingHours)),
    [dispatch]
  );
};

export default useCheckWorkingHours;
