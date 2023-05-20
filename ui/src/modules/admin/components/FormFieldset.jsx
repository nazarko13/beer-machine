import React, { useMemo } from 'react';
import Grid from '@mui/material/Grid';
import { Controller } from 'react-hook-form';

import { useNotify } from 'common/hooks';
import {
  Button,
  CheckBoxField,
  InputField,
  SelectField,
} from 'common/components';
import {
  fields,
  fieldSizes,
  kagOptions,
  fieldSizesAdmin,
  beerTypeOptions,
} from '../constants';

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
  disableActivation,
}) => {
  const notify = useNotify();

  const sizes = useMemo(() => (admin ? fieldSizesAdmin : fieldSizes), [admin]);

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
          <Grid item width={sizes[fields.isActive]}>
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
          <Grid item width={sizes[fields.name]}>
            <Controller
              control={control}
              name={`${id}.name`}
              defaultValue={name}
              render={({ field }) => (
                <InputField
                  {...field}
                  fullWidth
                  disabled={admin}
                  size="large"
                  onFocus={(e) => onFocus(field.name, e)}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.price) && (
          <Grid item width={sizes[fields.price]}>
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
          <Grid item width={sizes[fields.type]}>
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
          <Grid item width={sizes[fields.pulseCount]}>
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
          <Grid item width={sizes[fields.barcode]}>
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
          <Grid item width={sizes[fields.keg]}>
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
          <Grid item width={sizes[fields.quantity]}>
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

        <Grid item xs={1}>
          <Button
            text="31"
            sx={{ px: 0.5, minWidth: '50px', height: '100%' }}
            onClick={() => setValue(`${id}.quantity`, 31)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FormFieldset;
