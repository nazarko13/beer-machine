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
import { IOSSwitch } from './styled';

const workingHoursOptions = new Array(25)
  .fill(null)
  .reduce((acc, val, index) => {
    const item = {
      value: `${index}:00`,
      name: `${index}:00`,
    };

    if (index === 24) {
      return [...acc, item];
    }

    const nextItem = {
      value: `${index}:30`,
      name: `${index}:30`,
    };

    return [...acc, item, nextItem];
  }, []);

const remainingBeerQty = new Array(10)
  .fill(null)
  .map((_, index) => ({ value: index + 1, name: index + 1 }));

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
    <Grid
      container
      wrap="nowrap"
      spacing={2}
      component="form"
      direction="column"
      justifyContent="space-between"
    >
      <Grid item container>
        <Grid
          item
          container
          wrap="nowrap"
          spacing={1}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Typography variant="h3" component={Grid} item>
            Сповіщати в телеграм коли залишок пива:
          </Typography>

          <Grid item>
            <Controller
              name="beerRemainsQty"
              defaultValue={0}
              control={control}
              render={({ field, fieldState }) => (
                <SelectField
                  {...field}
                  error={fieldState.error}
                  size="small"
                  options={remainingBeerQty}
                />
              )}
            />
          </Grid>

          <Typography variant="h3" component={Grid} item>
            л.
          </Typography>
        </Grid>

        <Grid
          item
          mt={2}
          container
          wrap="nowrap"
          spacing={1}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Typography variant="h3" component={Grid} item>
            Перевірка віку (18+)
          </Typography>

          <Grid item>
            <Controller
              name="withOver18Check"
              defaultValue={config?.withOver18Check}
              control={control}
              render={({ field, fieldState }) => (
                <IOSSwitch {...field} size="medium" error={fieldState.error} />
              )}
            />
          </Grid>
        </Grid>

        <Grid item container xs={7} mt={4}>
          <Grid item xs>
            <Typography variant="h3">Час роботи апарату</Typography>
          </Grid>

          <Grid item container spacing={1} mt={2}>
            <Grid item xs={6}>
              <Controller
                name="workingHours.fromHour"
                defaultValue="10:00"
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
                defaultValue="22:00"
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
          </Grid>
        </Grid>

        <Grid item container xs={7} mt={5}>
          <Button
            item
            fullWidth
            size="large"
            text="ЗБЕРЕГТИ"
            component={Grid}
            onClick={handleSubmit(handleSave)}
          />
        </Grid>
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
        <WorkingTimeForm />
      </Grid>
    </Grid>
  );
};

export default SystemSettings;
