import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';

import { createEnum } from 'common/utils';
import { modalNames } from 'common/constants';
import BeerItem from './BeerItem';
import WashingLoader from './WashingLoader';
import GetBottlePopup from './GetBottlePopup';
import { useGetPourStatus } from '../hooks';
import { openModal } from '../../modalHandler/ducks';
import { getActiveBeersData, getIsWithOver18Check } from '../ducks/selectors';
import {
  pourBeer,
  startWashing,
  getActiveBeers,
  getSystemSettings,
} from '../ducks';
import Ask18Popup from './Ask18Popup';

const modalTypes = createEnum({
  error: null,
  getBottle: null,
  washingLoader: null,
  checkIsOver18: null,
});

const requestWashingCount = 2;

const Beers = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);
  const [beerForPour, setBeerForPour] = useState(null);
  const [count, setWashingRequestNum] = useState(0);
  const data = useSelector(getActiveBeersData);
  const withOver18Check = useSelector(getIsWithOver18Check);

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
    dispatch(startWashing({ force: count === requestWashingCount })).then(
      ({ error }) => {
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
      }
    );
  }, [dispatch, openErrorModal, openGetBottleModal, count]);

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
        getActiveBears();
      });
    },
    [
      runGetStatus,
      dispatch,
      stopGetStatus,
      openGetBottleModal,
      openErrorModal,
      getActiveBears,
    ]
  );

  const onBeerClick = (beer) => {
    if (withOver18Check) {
      setBeerForPour(beer);
      setModal(modalTypes.checkIsOver18);
      return;
    }

    handlePourBeer(beer);
  };

  const pourBeerOnAcceptAge = () => {
    setModal(null);
    handlePourBeer(beerForPour);
    setBeerForPour(null);
  };

  useEffect(() => {
    getActiveBears();
  }, [getActiveBears]);

  useEffect(() => {
    dispatch(getSystemSettings());
  }, [dispatch]);

  if (!data.length) {
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Typography
          item
          variant="h1"
          fontWeight={300}
          component={Grid}
          fontSize="3rem"
        >
          Вибачте, доступних пив не знайдено
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid
      container
      flex={1}
      wrap="nowrap"
      direction="column"
      alignItems="center"
    >
      {!!data.length && (
        <Grid item pt={2}>
          <Typography fontWeight={100} fontSize="3rem">
            ВСТАВТЕ ПЛЯШКУ І ОБЕРІТЬ ПИВО
          </Typography>
        </Grid>
      )}

      <Grid container height="100%" alignItems="center" justifyContent="center">
        {!!data.length && (
          <Grid
            container
            px={1.5}
            spacing={data.length <= 2 ? 3 : 2}
            alignItems="stretch"
            justifyContent="center"
          >
            {data.map((item) => (
              <Grid item xs={6} key={item.name}>
                <BeerItem
                  {...item}
                  count={data.length}
                  handlePour={() => onBeerClick(item)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>

      <GetBottlePopup
        open={modal === modalTypes.getBottle}
        onClose={handleWashing}
      />

      <Ask18Popup
        open={modal === modalTypes.checkIsOver18}
        onClose={() => setModal(null)}
        onSuccess={pourBeerOnAcceptAge}
      />

      <WashingLoader open={modal === modalTypes.washingLoader} />
    </Grid>
  );
};

export default Beers;
