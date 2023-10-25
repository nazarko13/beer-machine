import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';

import { keyboardLayouts, routes } from 'common/constants';
import KeyboardProvider from 'common/components/Keyboard';
import Button from 'common/components/Button';
import { useNotify } from 'common/hooks';
import { Loader } from 'common/components';

import { saveBeers } from '../ducks';
import { parseBeerModel } from '../utils';
import { getBeers } from '../ducks/selectors';
import FormFieldset from './FormFieldset';
import AddBeerModal from './AddBeerModal';
import { fieldSizes, fieldLabels, maxActiveBeersCount } from '../constants';

const layouts = {
  number: keyboardLayouts.numeric,
  default: undefined,
};

const SettingsForm = ({ fieldSet, isSuperAdmin }) => {
  const notify = useNotify();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allBeers = useSelector(getBeers);
  const [loading, setLoading] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [editableBeer, setEditableBeer] = useState(false);
  const [layout, setLayout] = useState(undefined);
  const [inputValues, setValues] = useState({});
  const [activeInput, setActiveInput] = useState(null);
  const { watch, setValue, control, handleSubmit } = useForm({
    defaultValues: allBeers,
    shouldUnregister: true,
  });

  const formData = watch();

  const toggleAddNewBeer = () => {
    setAddNew((isAdd) => !isAdd);
  };

  const handleCloseEdit = () => setEditableBeer(null);

  const isMaxCountReached = useMemo(() => {
    const data = Object.values(formData).length ? formData : allBeers;
    const activeBeers = Object.values(data).filter(({ isActive }) => isActive);

    return activeBeers.length === maxActiveBeersCount;
  }, [formData, allBeers]);

  const onSubmit = useCallback(
    (data) => {
      const newBeers = Object.keys(data).map((id) => {
        const oldBeer = allBeers[id];

        return parseBeerModel({
          ...oldBeer,
          ...data[id],
        });
      });

      dispatch(saveBeers(newBeers)).then(({ error }) => {
        if (error) {
          notify.error('Помилка збереження');
          return;
        }

        notify.success('Дані успішно збережено');
      });
    },
    [dispatch, allBeers, notify]
  );

  const updateVisibleInput = useCallback((inputName, e, l) => {
    if (e.stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }

    setTimeout(() => {
      e.target.scrollIntoView({ block: 'center' });
    }, 100);

    setLayout(l);
    return setActiveInput(inputName);
  }, []);

  useEffect(() => {
    const val = inputValues[activeInput];

    if (typeof val === 'undefined') {
      return;
    }

    setValue(activeInput, val);
  }, [activeInput, inputValues, setValue]);

  return (
    <>
      {loading && <Loader />}
      <Grid position="relative" container maxHeight="100%">
        {!addNew && !editableBeer && (
          <Grid
            item
            container
            bottom={0}
            zIndex={100}
            width="100%"
            position="fixed"
            justifyContent="center"
            id="keyboardLayout"
          >
            <KeyboardProvider
              values={formData}
              inputName={activeInput}
              onChangeAll={setValues}
              layout={layouts[layout]}
              handleHideKeyboard={setActiveInput}
              width={layout === 'number' ? 350 : '100%'}
            />
          </Grid>
        )}

        <Grid component="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
          <Grid
            item
            container
            pt={2}
            pr={2}
            spacing={2}
            justifyContent="flex-end"
          >
            <Grid item>
              <Button text="Зберегти" type="submit" />
            </Grid>

            {isSuperAdmin && (
              <Grid item>
                <Button
                  text="Додати пиво"
                  color="info"
                  onClick={toggleAddNewBeer}
                />
              </Grid>
            )}

            <Grid item>
              <Button
                text="Вийти"
                color="error"
                onClick={() => navigate(routes.public.home)}
              />
            </Grid>
          </Grid>

          <Grid item xs container spacing={2} px={2} pt={1} width="100%">
            {fieldSet.map((fieldName) => (
              <Grid key={fieldName} item width={fieldSizes[fieldName]}>
                <Typography>{fieldLabels[fieldName]}</Typography>
              </Grid>
            ))}
          </Grid>

          <Grid
            container
            overflow="auto"
            justifyContent="center"
            minHeight={activeInput ? 'calc(100% + 240px)' : '100%'}
          >
            <Grid p={2} spacing={1} container wrap="nowrap" direction="column">
              {Object.keys(allBeers || {}).map((key) => (
                <FormFieldset
                  {...allBeers[key]}
                  key={key}
                  admin={!isSuperAdmin}
                  control={control}
                  setValue={setValue}
                  fieldSet={fieldSet}
                  onFocus={updateVisibleInput}
                  setLoading={setLoading}
                  disableActivation={isMaxCountReached}
                  setEditableBeer={() => setEditableBeer(allBeers[key])}
                />
              ))}
            </Grid>
          </Grid>
        </Grid>

        <AddBeerModal open={addNew} onCancel={toggleAddNewBeer} />

        <AddBeerModal
          key={editableBeer?.id}
          open={Boolean(editableBeer)}
          onSave={setValue}
          defaultValues={editableBeer}
          onCancel={handleCloseEdit}
        />
      </Grid>
    </>
  );
};

export default SettingsForm;
