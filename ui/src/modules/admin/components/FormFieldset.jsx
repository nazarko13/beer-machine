import React from 'react';
import Grid from '@mui/material/Grid';
import { Controller } from 'react-hook-form';

import { useNotify } from 'common/hooks';
import { CheckBoxField, InputField } from 'common/components';

const FormFieldset = ({
  id,
  name,
  price,
  isActive,
  control,
  pulseCount,
  disableActivation,
  onFocus,
}) => {
  const notify = useNotify();

  const onChangeActive =
    ({ onChange }) =>
    (e, v) => {
      if (v && disableActivation) {
        notify.warning('Видосягли максимальної кількості в 4 пива.');
        return;
      }

      onChange(e, v);
    };

  return (
    <Grid item container direction="column">
      <Grid item xs container spacing={2} p={1} pt={1}>
        <Grid item xs={2}>
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

        <Grid item xs={4}>
          <Controller
            control={control}
            name={`${id}.name`}
            defaultValue={name}
            render={({ field }) => (
              <InputField
                {...field}
                fullWidth
                size="large"
                label="Ім'я"
                onFocus={(e) => onFocus(field.name, e)}
              />
            )}
          />
        </Grid>

        <Grid item xs={2}>
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
                label="Ціна"
                onFocus={(e) => onFocus(field.name, e, 'number')}
              />
            )}
          />
        </Grid>

        <Grid item xs={2}>
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
                label="Кількість імпульсів"
                onFocus={(e) => onFocus(field.name, e, 'number')}
              />
            )}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FormFieldset;
