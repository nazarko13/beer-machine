import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import { Controller, useForm } from 'react-hook-form';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from 'common/components/Button';
import { keyboardLayouts } from 'common/constants';
import KeyboardProvider from 'common/components/Keyboard';
import { InputField, SelectField } from 'common/components';
import { addBeerSchema } from '../constants/validations';
import { beerTypeOptions, kagOptions } from '../constants';

const layouts = {
  number: keyboardLayouts.numeric,
  default: undefined,
};

const AddBeerModal = ({ open = false, onCancel = () => null }) => {
  const [layout, setLayout] = useState(undefined);
  const [inputValues, setValues] = useState({});
  const [activeInput, setActiveInput] = useState(null);

  const { control, watch, setValue, handleSubmit } = useForm({
    shouldUnregister: true,
    resolver: yupResolver(addBeerSchema),
    defaultValues: { isActive: false },
  });
  const formData = watch();

  const onFocus = useCallback((inputName, e, l) => {
    if (e.stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }

    setLayout(l);
    return setActiveInput(inputName);
  }, []);

  // eslint-disable-next-line no-console
  const onSubmit = (data) => console.log(data);

  useEffect(() => {
    const val = inputValues[activeInput];

    if (typeof val === 'undefined') {
      return;
    }

    setValue(activeInput, val);
  }, [activeInput, inputValues, setValue]);

  return (
    <Modal
      hideBackdrop
      open={open}
      component={Grid}
      bgcolor="#00000060"
      alignItems="center"
      justifyContent="center"
    >
      <Paper component={Grid} m={2} justifyContent="center">
        <DialogTitle>
          <Typography variant="h3" component="span">
            Додати нове пиво
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          <Grid item container>
            <Grid item xs={6} px={1} py={1.5}>
              <Controller
                control={control}
                name="name"
                defaultValue=""
                render={({ field, fieldState }) => (
                  <InputField
                    {...field}
                    error={fieldState.error}
                    fullWidth
                    size="large"
                    fieldLabel="Імʼя"
                    onFocus={(e) => onFocus(field.name, e)}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6} px={1} py={1.5}>
              <Controller
                control={control}
                name="price"
                defaultValue=""
                render={({ field, fieldState }) => (
                  <InputField
                    fullWidth
                    error={fieldState.error}
                    fieldLabel="Ціна"
                    size="large"
                    {...field}
                    onFocus={(e) => onFocus(field.name, e, 'number')}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6} px={1} py={1.5}>
              <Controller
                control={control}
                name="type"
                defaultValue={beerTypeOptions[0].value}
                render={({ field, fieldState }) => (
                  <SelectField
                    fullWidth
                    error={fieldState.error}
                    type="number"
                    fieldLabel="Тип"
                    size="large"
                    variant="outlined"
                    {...field}
                    options={beerTypeOptions}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6} px={1} py={1.5}>
              <Controller
                control={control}
                name="pulseCount"
                defaultValue=""
                render={({ field, fieldState }) => (
                  <InputField
                    {...field}
                    error={fieldState.error}
                    fullWidth
                    size="large"
                    fieldLabel="Кількість імпульсів"
                    onFocus={(e) => onFocus(field.name, e, 'number')}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4} px={1} py={1.5}>
              <Controller
                control={control}
                name="barcode"
                defaultValue=""
                render={({ field, fieldState }) => (
                  <InputField
                    {...field}
                    error={fieldState.error}
                    fullWidth
                    size="large"
                    fieldLabel="Баркод"
                    onFocus={(e) => onFocus(field.name, e)}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4} px={1} py={1.5}>
              <Controller
                control={control}
                name="keg"
                defaultValue={kagOptions[0].value}
                render={({ field, fieldState }) => (
                  <SelectField
                    fullWidth
                    error={fieldState.error}
                    {...field}
                    fieldLabel="Кега"
                    size="large"
                    variant="outlined"
                    options={kagOptions}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4} px={1} py={1.5}>
              <Controller
                control={control}
                name="quantity"
                defaultValue=""
                render={({ field, fieldState }) => (
                  <InputField
                    fullWidth
                    error={fieldState.error}
                    {...field}
                    fieldLabel="Кількість"
                    size="large"
                    onFocus={(e) => onFocus(field.name, e, 'number')}
                  />
                )}
              />
            </Grid>

            <Grid item xs px={1} py={1.5}>
              <Controller
                control={control}
                name="description"
                defaultValue=""
                render={({ field }) => (
                  <InputField
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={2}
                    {...field}
                    fieldLabel="Опис"
                    size="large"
                    onFocus={(e) => onFocus(field.name, e)}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button text="Зберегти" onClick={handleSubmit(onSubmit)} />
          <Button text="Скасувати" color="error" onClick={onCancel} />
        </DialogActions>

        {!!activeInput && (
          <Grid container justifyContent="center">
            <Grid item width={layout === 'number' ? 350 : 850}>
              <KeyboardProvider
                values={formData}
                inputName={activeInput}
                onChangeAll={setValues}
                layout={layouts[layout]}
                handleHideKeyboard={setActiveInput}
              />
            </Grid>
          </Grid>
        )}
      </Paper>
    </Modal>
  );
};

export default AddBeerModal;
