import React, { useCallback, useEffect, useState, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Keyboard from 'react-simple-keyboard';
import Grid from '@mui/material/Grid';
import get from 'lodash/get';

import { useClickOutside } from 'common/hooks';

const defaultTheme = 'hg-theme-default';

const useStyles = makeStyles({
  simpleKeyboard: {
    display: 'none',
  },
  showKeyboard: {
    display: 'block',
  },
  base: {
    '& .hg-rows .hg-row .hg-button': {
      height: 60,
    },
  },
});

const KeyboardProvider = ({
  layout,
  width = 'inherit',
  values,
  inputName,
  onChangeAll,
  layoutType = 'default',
  handleHideKeyboard,
}) => {
  const styles = useStyles({ width });
  const [keyboard, setKeyboard] = useState(null);
  const [layoutName, setLayoutName] = useState(layoutType);

  const keyboardVisible = useMemo(() => !!inputName, [inputName]);

  const [container] = useClickOutside(keyboardVisible, handleHideKeyboard);

  const theme = useMemo(
    () =>
      `${defaultTheme} ${
        keyboardVisible ? styles.showKeyboard : styles.simpleKeyboard
      }`,
    [keyboardVisible, styles]
  );

  const handleShift = () => {
    setLayoutName((prevLayout) =>
      prevLayout === 'default' ? 'shift' : 'default'
    );
  };

  const onKeyPress = (button) => {
    if (button === '{shift}' || button === '{lock}') {
      handleShift();
    }
  };

  const valueListener = useCallback(() => {
    if (!keyboard || !values || !inputName) {
      return;
    }

    const value = get(values, inputName);

    keyboard.setInput(typeof value !== 'string' ? String(value) : value);
  }, [inputName, keyboard, values]);

  useEffect(() => {
    valueListener();
  }, [valueListener]);

  return (
    <Grid
      container
      px={2}
      bottom={65}
      zIndex={10}
      height={270}
      width={width}
      ref={container}
      position="absolute"
      alignItems="center"
      justifyContent="center"
    >
      <Keyboard
        theme={theme}
        layout={layout}
        inputName={inputName}
        baseClass={styles.base}
        onKeyPress={onKeyPress}
        layoutName={layoutName}
        keyboardRef={setKeyboard}
        onChangeAll={onChangeAll}
      />
    </Grid>
  );
};

export default KeyboardProvider;
