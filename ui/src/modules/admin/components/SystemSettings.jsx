import React, { useCallback, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { routes } from 'common/constants';
import Button from 'common/components/Button';
import { Loader, SelectField } from 'common/components';
import { systemSettingsSchema } from '../constants/validations';
import { getSystemSettings, updateSystemSettings } from '../ducks';
import { getLoading, getStateSystemSettings } from '../ducks/selectors';

const workingHoursOptions = new Array(25)
  .fill(null)
  .map((_, index) => ({ value: index, name: index }));

const WorkingTimeForm = () => {
  const dispatch = useDispatch();
  const config = useSelector(getStateSystemSettings);

  const { control, handleSubmit, trigger } = useForm({
    defaultValues: config,
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(systemSettingsSchema),
  });

  const workingFrom = useWatch({ control, name: 'workingHours.fromHour' });

  useEffect(() => {
    if (typeof workingFrom === 'number') {
      trigger('workingHours.toHour');
    }
  }, [workingFrom, trigger]);

  const handleSave = (data) => dispatch(updateSystemSettings(data));

  return (
    <Grid item container component="form" spacing={2}>
      <Grid item xs={6}>
        <Controller
          name="workingHours.fromHour"
          defaultValue={10}
          control={control}
          render={({ field, fieldState }) => (
            <SelectField
              {...field}
              error={fieldState.error}
              fullWidth
              label="Від"
              size="medium"
              options={workingHoursOptions}
            />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="workingHours.toHour"
          defaultValue={22}
          control={control}
          render={({ field, fieldState }) => (
            <SelectField
              {...field}
              error={fieldState.error}
              fullWidth
              label="До"
              size="medium"
              options={workingHoursOptions}
            />
          )}
        />
      </Grid>

      <Grid item container justifyContent="flex-end" mt={2}>
        <Button
          fullWidth
          size="large"
          text="ЗБЕРЕГТИ"
          onClick={handleSubmit(handleSave)}
        />
      </Grid>
    </Grid>
  );
};

const SystemSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(getLoading);

  const getSettings = useCallback(() => {
    dispatch(getSystemSettings());
  }, [dispatch]);

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container direction="column" p={1}>
      <Grid
        item
        container
        pt={2}
        pr={2}
        pb={4}
        spacing={2}
        justifyContent="flex-end"
      >
        <Grid item>
          <Button
            text="Вийти"
            color="error"
            onClick={() => navigate(routes.public.home)}
          />
        </Grid>
      </Grid>

      <Grid item container px={2}>
        <Grid item container xs={6} direction="column">
          <Grid item xs>
            <Typography variant="h2">Час роботи апарату</Typography>
          </Grid>

          <Grid item xs={6} pt={2}>
            <WorkingTimeForm />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SystemSettings;
