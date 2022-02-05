import React from 'react';
import Grid from '@mui/material/Grid';
import { Controller } from 'react-hook-form';

import { useNotify } from 'common/hooks';
import { CheckBoxField, InputField, SelectField } from 'common/components';
import { beerTypeOptions, fields, fieldSizes, kagOptions } from '../constants';

const FormFieldset = ({
  id,
  name,
  type,
  price,
  isActive,
  control,
  fieldSet,
  pulseCount,
  disableActivation,
  onFocus,
}) => {
  const notify = useNotify();

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
          <Grid item xs={fieldSizes[fields.isActive]}>
            <Controller
              control={control}
              name={`${id}.isActive`}
              defaultValue={isActive}
              render={({ field }) => (
                <CheckBoxField
                  {...field}
                  size="large"
                  label={name}
                  onChange={onChangeActive(field)}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.name) && (
          <Grid item xs={fieldSizes[fields.name]}>
            <Controller
              control={control}
              name={`${id}.name`}
              defaultValue={name}
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

        {fieldSet.includes(fields.price) && (
          <Grid item xs={fieldSizes[fields.price]}>
            <Controller
              control={control}
              name={`${id}.price`}
              defaultValue={price}
              render={({ field }) => (
                <InputField
                  fullWidth
                  type="number"
                  size="large"
                  {...field}
                  onFocus={(e) => onFocus(field.name, e, 'number')}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.type) && (
          <Grid item xs={fieldSizes[fields.type]}>
            <Controller
              control={control}
              name={`${id}.type`}
              defaultValue={type}
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
          <Grid item xs={fieldSizes[fields.pulseCount]}>
            <Controller
              control={control}
              name={`${id}.pulseCount`}
              defaultValue={pulseCount}
              render={({ field }) => (
                <InputField
                  {...field}
                  fullWidth
                  type="number"
                  size="large"
                  onFocus={(e) => onFocus(field.name, e, 'number')}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.barcode) && (
          <Grid item xs={fieldSizes[fields.barcode]}>
            <Controller
              control={control}
              name={`${id}.barcode`}
              defaultValue={pulseCount}
              render={({ field }) => (
                <InputField
                  {...field}
                  fullWidth
                  type="number"
                  size="large"
                  onFocus={(e) => onFocus(field.name, e, 'number')}
                />
              )}
            />
          </Grid>
        )}

        {fieldSet.includes(fields.keg) && (
          <Grid item xs={fieldSizes[fields.keg]}>
            <Controller
              control={control}
              name={`${id}.keg`}
              defaultValue={pulseCount}
              render={({ field }) => (
                <SelectField
                  fullWidth
                  type="number"
                  size="small"
                  variant="filled"
                  {...field}
                  options={kagOptions}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default FormFieldset;
