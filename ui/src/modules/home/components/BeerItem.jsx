import React, { useState, useRef, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';

import Button from 'common/components/Button';
import { beerTypes } from 'common/constants/enums';

import darkBeer from 'assets/images/dark.png';
import lightBeer from 'assets/images/light.png';

const isTouchEvent = (event) => {
  return 'touches' in event;
};

const preventDefault = (event) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

const useLongPress = (
  onLongPress,
  onClick,
  { shouldPreventDefault = true, delay = 300 } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef();
  const target = useRef();

  const start = useCallback(
    (event) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener('touchend', preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event, shouldTriggerClick = true) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      if (shouldTriggerClick && !longPressTriggered) {
        onClick();
      }
      setLongPressTriggered(false);
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  );

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e),
  };
};

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    width: '90%',
    color: 'black',
    fontSize: '2.25rem',
    borderRadius: 10,
    backgroundColor: '#8bbc2a',
    padding: spacing(2, 1),
  },
}));

const images = {
  [beerTypes.light]: lightBeer,
  [beerTypes.dark]: darkBeer,
};

const defaultOptions = {
  shouldPreventDefault: true,
  delay: 2000,
};

const BeerItem = ({ name, price, type, handlePour }) => {
  const classes = useStyles();

  const bind = useLongPress(handlePour, handlePour, defaultOptions);

  return (
    <Grid
      container
      py={2}
      my={0}
      direction="column"
      justifyContent="center"
      boxShadow="0 0 15px 0.1px #8bbc2a"
      onClick={handlePour}
      {...bind}
    >
      <Grid
        item
        container
        alt={name}
        width="100%"
        component="img"
        maxHeight={300}
        src={images[type] || lightBeer}
        style={{ objectFit: 'contain' }}
      />

      <Grid item container alignItems="center" justifyContent="center">
        <Button
          fullWidth
          size="large"
          classes={classes}
          text={`${name} ${price} UAH`}
        />
      </Grid>
    </Grid>
  );
};

export default BeerItem;
