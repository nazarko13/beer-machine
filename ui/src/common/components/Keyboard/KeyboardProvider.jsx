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
});

const KeyboardProvider = ({
  layout,
  width,
  values,
  inputName,
  onChangeAll,
  handleHideKeyboard,
}) => {
  const styles = useStyles();
  const [keyboard, setKeyboard] = useState(null);
  const [layoutName, setLayoutName] = useState('default');

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
    if (!keyboard || !values) {
      return;
    }

    keyboard.setInput(get(values, inputName));
  }, [inputName, keyboard, values]);

  useEffect(() => {
    valueListener();
  }, [valueListener]);

  return (
    <Grid
      container
      px={2}
      bottom={10}
      zIndex={10}
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
        onKeyPress={onKeyPress}
        layoutName={layoutName}
        keyboardRef={setKeyboard}
        onChangeAll={onChangeAll}
      />
    </Grid>
  );
};

export default KeyboardProvider;
