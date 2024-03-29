import React, { useState, useRef, useCallback, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';

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
    fontSize: '25px',
    borderRadius: 10,
    backgroundColor: '#8bbc2a',
    padding: spacing(1, 1),
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

const BeerItem = ({ name, price, type, count, handlePour }) => {
  const classes = useStyles();

  const bind = useLongPress(handlePour, handlePour, defaultOptions);

  const btnText = useMemo(
    () => (
      <Typography fontSize="inherit">
        {name}
        <div style={{ wordBreak: 'unset' }}>{`${price} UAH`}</div>
      </Typography>
    ),
    [name, price]
  );

  return (
    <Grid
      flex={1}
      height="100%"
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
        maxHeight={count > 2 ? 170 : 300}
        src={images[type] || lightBeer}
        style={{ objectFit: 'contain' }}
      />

      <Grid item container alignItems="center" justifyContent="center">
        <Button fullWidth size="large" classes={classes} text={btnText} />
      </Grid>
    </Grid>
  );
};

export default BeerItem;
