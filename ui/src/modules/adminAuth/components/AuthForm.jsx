import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import DialogActions from '@mui/material/DialogActions';
import { Controller, useForm } from 'react-hook-form';

import Button from 'common/components/Button';
import { keyboardLayouts } from 'common/constants';
import InputField from 'common/components/InputField';
import KeyboardProvider from 'common/components/Keyboard';

const layouts = {
  login: undefined,
  password: keyboardLayouts.numeric,
};

const AuthForm = ({ onSubmit, onClose }) => {
  const [inputValues, setValues] = useState({});
  const [activeInput, setActiveInput] = useState(null);

  const { handleSubmit, control, watch, reset } = useForm();
  const formData = watch();

  const updateVisibleInput = (inputName, e) => {
    if (e.stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }

    return setActiveInput(inputName);
  };

  useEffect(() => {
    reset(inputValues);
  }, [inputValues, reset]);

  return (
    <Grid
      container
      spacing={1}
      component="form"
      direction="column"
      alignItems="center"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid item container>
        <Controller
          name="l"
          control={control}
          rules={{ required: 'Required' }}
          render={({ field, fieldState }) => (
            <InputField
              {...field}
              classes={{}}
              fullWidth
              size="medium"
              placeholder="Логін"
              error={fieldState.error}
              onFocus={(e) => updateVisibleInput(field.name, e)}
            />
          )}
        />
      </Grid>

      <Grid item container>
        <Controller
          name="p"
          control={control}
          rules={{ required: 'Required' }}
          render={({ field, fieldState }) => (
            <InputField
              {...field}
              fullWidth
              size="medium"
              type="password"
              placeholder="Пароль"
              error={fieldState.error}
              onFocus={(e) => updateVisibleInput(field.name, e)}
            />
          )}
        />
      </Grid>

      <Grid item container wrap="nowrap" component={DialogActions} mt={2}>
        <Grid item xs={6}>
          <Button fullWidth size="large" type="submit" text="Вхід" />
        </Grid>

        <Grid item xs={6}>
          <Button
            fullWidth
            size="large"
            color="warning"
            text="Скасувати"
            onClick={onClose}
          />
        </Grid>
      </Grid>

      <KeyboardProvider
        values={formData}
        inputName={activeInput}
        onChangeAll={setValues}
        layout={layouts[activeInput]}
        handleHideKeyboard={setActiveInput}
        width={activeInput === 'password' ? 280 : '100%'}
      />
    </Grid>
  );
};

export default AuthForm;
