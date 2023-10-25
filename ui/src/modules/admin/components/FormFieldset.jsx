import React, { useCallback, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

import { useNotify } from 'common/hooks';
import {
  Button,
  TextBlock,
  InputField,
  SelectField,
  CheckBoxField,
} from 'common/components';
import { testPrint, testPourBeer, washing } from '../ducks';
import { fields, fieldSizes, kagOptions, beerTypeOptions } from '../constants';

const requestWashingCount = 2;

const FormFieldset = ({
  id,
  keg,
  name,
  type,
  price,
  admin,
  barcode,
  isActive,
  control,
  fieldSet,
  onFocus,
  quantity = 0,
  setValue,
  pulseCount,
  setLoading,
  expirationDate,
  setEditableBeer,
  disableActivation,
}) => {
  const notify = useNotify();
  const dispatch = useDispatch();
  const [countWashing, setWashingRequestNum] = useState(0);

  const handleTestPour = useCallback(() => {
    setLoading(true);

    dispatch(testPourBeer({ id, pulseCount, keg })).then(({ error }) => {
      if (error) {
        setLoading(false);
        return;
      }

      dispatch(washing({ force: countWashing === requestWashingCount })).then(
        ({ error: err }) => {
          if (err) {
            setWashingRequestNum((num) => {
              if (num === requestWashingCount) {
                setLoading(false);
                return 0;
              }

              return num + 1;
            });

            return;
          }

          setLoading(false);

          setWashingRequestNum(0);
        }
      );
    });
  }, [countWashing, dispatch, id, pulseCount, keg, setLoading]);

  const handleTestPrint = useCallback(() => {
    setLoading(true);

    dispatch(testPrint({ id })).then(() => {
      setLoading(false);
    });
  }, [dispatch, id, setLoading]);

  const onChangeActive =
    ({ onChange }) =>
    (e, v) => {
      if (v && disableActivation) {
        notify.warning('Ви досягли максимальної кількості в 2 пива.');
        return;
      }

      onChange(e, v);
    };

  return (
    <Grid item container direction="column">
      <Grid item xs container spacing={2} p={1} pt={1}>
        {fieldSet.includes(fields.isActive) && (
          <Grid item width={fieldSizes[fields.isActive]}>
            <Controller
              control={control}
              name={`${id}.isActive`}
              defaultValue={isActive}
              render={({ field }) => (
                <CheckBoxField
                  {...field}
                  size="large"
                  onChange={onChangeActive(field)}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.name) && (
          <Grid item width={fieldSizes[fields.name]}>
            <Controller
              control={control}
              name={`${id}.name`}
              defaultValue={name}
              render={({ field }) => (
                <TextBlock
                  text={field.value}
                  variant="title1"
                  interactive={field.value?.length > 30}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.price) && (
          <Grid item width={fieldSizes[fields.price]}>
            <Controller
              control={control}
              name={`${id}.price`}
              defaultValue={price}
              render={({ field }) => (
                <InputField
                  fullWidth
                  size="large"
                  {...field}
                  disabled={admin}
                  onFocus={(e) => onFocus(field.name, e, 'number')}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.type) && (
          <Grid item width={fieldSizes[fields.type]}>
            <Controller
              control={control}
              name={`${id}.type`}
              defaultValue={type}
              disabled={admin}
              render={({ field }) => (
                <SelectField
                  fullWidth
                  type="number"
                  size="small"
                  variant="filled"
                  {...field}
                  options={beerTypeOptions}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.pulseCount) && (
          <Grid item width={fieldSizes[fields.pulseCount]}>
            <Controller
              control={control}
              name={`${id}.pulseCount`}
              defaultValue={pulseCount}
              render={({ field }) => (
                <InputField
                  {...field}
                  fullWidth
                  size="large"
                  onFocus={(e) => onFocus(field.name, e, 'number')}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.barcode) && (
          <Grid item width={fieldSizes[fields.barcode]}>
            <Controller
              control={control}
              name={`${id}.barcode`}
              defaultValue={barcode}
              render={({ field }) => (
                <InputField
                  {...field}
                  fullWidth
                  size="large"
                  onFocus={(e) => onFocus(field.name, e)}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.keg) && (
          <Grid item width={fieldSizes[fields.keg]}>
            <Controller
              control={control}
              name={`${id}.keg`}
              defaultValue={keg}
              render={({ field }) => (
                <SelectField
                  fullWidth
                  size="small"
                  variant="filled"
                  {...field}
                  disabled={admin}
                  options={kagOptions}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.quantity) && (
          <Grid item width={fieldSizes[fields.quantity]}>
            <Controller
              control={control}
              name={`${id}.quantity`}
              defaultValue={quantity}
              render={({ field }) => (
                <InputField
                  fullWidth
                  {...field}
                  size="large"
                  onFocus={(e) => onFocus(field.name, e, 'number')}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.expirationDate) && (
          <Grid item width={fieldSizes[fields.expirationDate]}>
            <Controller
              control={control}
              name={`${id}.expirationDate`}
              defaultValue={expirationDate}
              render={({ field }) => (
                <TextBlock text={field.value} variant="title1" />
              )}
            />
          </Grid>
        )}

        <Grid item xs={1}>
          <Button
            text="31"
            sx={{ px: 0.5, minWidth: '50px', height: '100%' }}
            onClick={() => setValue(`${id}.quantity`, 31)}
          />
        </Grid>

        <Grid item xs={1}>
          <Button
            text="Друк"
            sx={{ px: 0.5, minWidth: '50px', height: '100%' }}
            onClick={handleTestPrint}
          />
        </Grid>

        <Grid item xs={1}>
          <Button
            text="Налив"
            sx={{ px: 0.5, minWidth: '50px', height: '100%' }}
            onClick={handleTestPour}
          />
        </Grid>

        {!admin && (
          <Grid item xs={1}>
            <Button
              sx={{ px: 0.5, minWidth: '50px', height: '100%' }}
              onClick={setEditableBeer}
            >
              <EditTwoToneIcon />
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default FormFieldset;
