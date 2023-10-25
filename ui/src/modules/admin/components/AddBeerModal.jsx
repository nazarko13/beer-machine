import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import { Controller, useForm } from 'react-hook-form';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { yupResolver } from '@hookform/resolvers/yup';

import { useNotify } from 'common/hooks';
import Button from 'common/components/Button';
import { keyboardLayouts } from 'common/constants';
import KeyboardProvider from 'common/components/Keyboard';
import { InputField, SelectField } from 'common/components';
import { addNewBeer, saveBeers } from '../ducks';
import { addBeerSchema } from '../constants/validations';
import { beerTypeOptions, kagOptions } from '../constants';
import { getBeers } from '../ducks/selectors';
import { parseBeerModel } from '../utils';
import Loader from '../../../common/components/Loader';

const layouts = {
  number: keyboardLayouts.numeric,
  default: undefined,
};

const defObj = {};

const AddBeerModal = ({
  open = false,
  defaultValues,
  onSave = () => null,
  onCancel = () => null,
}) => {
  const notify = useNotify();
  const dispatch = useDispatch();
  const [layout, setLayout] = useState(undefined);
  const [inputValues, setValues] = useState({});
  const [activeInput, setActiveInput] = useState(null);
  const [loading, setLoading] = useState(false);

  const allBeers = useSelector(getBeers);

  const { control, watch, setValue, handleSubmit } = useForm({
    shouldUnregister: true,
    resolver: yupResolver(addBeerSchema),
    defaultValues: { isActive: false, ...(defaultValues || defObj) },
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

  const onSubmit = async (data) => {
    setLoading(true);

    if (defaultValues) {
      const newBeers = Object.keys(allBeers).map((id) => {
        const oldBeer = allBeers[id];

        if (+id === defaultValues.id) {
          return parseBeerModel({ ...oldBeer, ...data });
        }

        return oldBeer;
      });

      dispatch(saveBeers(newBeers)).then(({ error }) => {
        if (error) {
          notify.error('Пиво не оновлено');
          return;
        }

        notify.success('Пиво успішно оновлено');
        Object.keys(data).forEach((k) => {
          onSave(`${defaultValues.id}.${k}`, data[k]);
        });
        onCancel();
        setLoading(false);
      });

      return;
    }

    dispatch(addNewBeer(data)).then(({ error }) => {
      if (error) {
        notify.error('Пиво не додано');
        return;
      }

      notify.success('Нове пиво успішно додано');
      onCancel();
      setLoading(false);
    });
  };

  useEffect(() => {
    const val = inputValues[activeInput];

    if (typeof val === 'undefined') {
      return;
    }

    setValue(activeInput, val);
  }, [activeInput, inputValues, setValue]);

  useEffect(() => {
    if (defaultValues?.id) {
      setValues('id', defaultValues?.id);
    }
  }, [defaultValues, setValues]);

  return (
    <Modal
      hideBackdrop
      open={open}
      component={Grid}
      bgcolor="#00000060"
      alignItems="center"
      justifyContent="center"
    >
      <form noValidate autoComplete="off">
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
                  defaultValue={defaultValues?.name || ''}
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
                  defaultValue={defaultValues?.price || ''}
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
                  defaultValue={defaultValues?.type || beerTypeOptions[0].value}
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
                  name="daysToExpire"
                  defaultValue={defaultValues?.quantity || ''}
                  render={({ field, fieldState }) => (
                    <InputField
                      fullWidth
                      error={fieldState.error}
                      {...field}
                      fieldLabel="До закінчення терміну придатності, днів:"
                      size="large"
                      onFocus={(e) => onFocus(field.name, e, 'number')}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3} px={1} py={1.5}>
                <Controller
                  control={control}
                  name="keg"
                  defaultValue={defaultValues?.keg || kagOptions[0].value}
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

              <Grid item xs={3} px={1} py={1.5}>
                <Controller
                  control={control}
                  name="pulseCount"
                  defaultValue={defaultValues?.pulseCount || ''}
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

              <Grid item xs={3} px={1} py={1.5}>
                <Controller
                  control={control}
                  name="barcode"
                  defaultValue={defaultValues?.barcode || ''}
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

              <Grid item xs={3} px={1} py={1.5}>
                <Controller
                  control={control}
                  name="quantity"
                  defaultValue={defaultValues?.quantity || ''}
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
                  defaultValue={defaultValues?.description || ''}
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
        {loading && <Loader />}
      </form>
    </Modal>
  );
};

export default AddBeerModal;
