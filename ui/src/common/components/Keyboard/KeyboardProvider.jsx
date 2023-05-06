import React, { useCallback, useEffect, useState, useMemo } from 'react';
import ukrLayout from 'simple-keyboard-layouts/build/layouts/ukrainian';
import engLayout from 'simple-keyboard-layouts/build/layouts/english';
import makeStyles from '@mui/styles/makeStyles';
import Keyboard from 'react-simple-keyboard';
import Grid from '@mui/material/Grid';
import get from 'lodash/get';

import { useClickOutside } from 'common/hooks';
import createEnum from '../../utils/createEnum';

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

    '& .hg-button-lang': {
      maxWidth: 90,
    },
  },
});

const modifyLayout = ({ layout }) => {
  if (!layout) {
    return undefined;
  }

  const defaultL = layout.default;
  const shiftL = layout.shift;

  defaultL[4] = defaultL[4].replace('.com', '{lang}');
  shiftL[4] = shiftL[4].replace('.com', '{lang}');

  return {
    default: defaultL,
    shift: shiftL,
  };
};

const EngLayout = modifyLayout(engLayout);
const UkrLayout = modifyLayout(ukrLayout);

const languages = {
  ua: 'УКР',
  en: 'ENG',
};

const layoutAccordingLanguage = createEnum({
  [languages.ua]: UkrLayout,
  [languages.en]: EngLayout,
  default: EngLayout,
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
  const [optLayout, setOptLayout] = useState(languages.en);

  const currentLayout = useMemo(
    () => layout || layoutAccordingLanguage[optLayout],
    [layout, optLayout]
  );

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

  const onKeyPress = (button, e) => {
    if (button === '{shift}' || button === '{lock}') {
      handleShift();
    }

    if (button === '{lang}') {
      e.preventDefault();
      e.stopPropagation();
      setOptLayout((l) => (l === languages.en ? languages.ua : languages.en));
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
      height={inputName ? 270 : 0}
      width={width}
      ref={container}
      position="absolute"
      alignItems="center"
      justifyContent="center"
    >
      <Keyboard
        physicalKeyboardHighlight
        theme={theme}
        layout={currentLayout}
        inputName={inputName}
        baseClass={styles.base}
        onKeyPress={onKeyPress}
        layoutName={layoutName}
        keyboardRef={setKeyboard}
        onChangeAll={onChangeAll}
        display={{
          '{bksp}': 'Backspace',
          '{enter}': 'Enter',
          '{shift}': 'Shift',
          '{lock}': 'Caps',
          '{tab}': 'Tab',
          '{space}': ' ',
          '{lang}':
            layoutName === 'shift'
              ? optLayout.toUpperCase()
              : optLayout.toLowerCase(),
        }}
      />
    </Grid>
  );
};

export default KeyboardProvider;
