import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';

import { createEnum } from 'common/utils';
import { modalNames } from 'common/constants';
import { getActiveBeers, pourBeer, startWashing } from '../ducks';
import { openModal } from '../../modalHandler/ducks';
import { getActiveBeersData } from '../ducks/selectors';
import GetBottlePopup from './GetBottlePopup';
import WashingLoader from './WashingLoader';
import { useGetPourStatus } from '../hooks';
import BeerItem from './BeerItem';

const modalTypes = createEnum({
  getBottle: null,
  washingLoader: null,
  error: null,
});

const requestWashingCount = 1;

const Beers = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);
  const [, setWashingRequestNum] = useState(0);
  const data = useSelector(getActiveBeersData);

  const [runGetStatus, stopGetStatus] = useGetPourStatus();

  const openGetBottleModal = useCallback(
    () => setModal(modalTypes.getBottle),
    []
  );

  const openErrorModal = useCallback(() => {
    setModal(null);
    dispatch(
      openModal({
        name: modalNames.message,
        message: 'Сталася помилка',
      })
    );
  }, [dispatch]);

  const handleWashing = useCallback(() => {
    setModal(modalTypes.washingLoader);
    dispatch(startWashing()).then(({ error }) => {
      if (error) {
        setWashingRequestNum((num) => {
          if (num === requestWashingCount) {
            openErrorModal();
            return 0;
          }

          openGetBottleModal();
          return num + 1;
        });

        return;
      }

      setModal(null);
      setWashingRequestNum(0);
    });
  }, [dispatch, openErrorModal, openGetBottleModal]);

  const getActiveBears = useCallback(() => {
    dispatch(getActiveBeers());
  }, [dispatch]);

  const handlePourBeer = useCallback(
    ({ id, pulseCount, keg }) => {
      runGetStatus();

      dispatch(pourBeer({ id, pulseCount, keg })).then(({ error }) => {
        stopGetStatus();

        if (error) {
          openErrorModal();
          return;
        }

        openGetBottleModal();
      });
    },
    [runGetStatus, dispatch, stopGetStatus, openGetBottleModal, openErrorModal]
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
              ВСТАВТЕ ПЛЯШКУ І ОБЕРІТЬ ПИВО
            </Typography>
          </Grid>

          <Grid
            item
            container
            pt={3}
            width="80%"
            height="95%"
            spacing={1}
            alignItems="center"
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

      <GetBottlePopup
        open={modal === modalTypes.getBottle}
        onClose={handleWashing}
      />

      <WashingLoader open={modal === modalTypes.washingLoader} />
    </Grid>
  );
};

export default Beers;
