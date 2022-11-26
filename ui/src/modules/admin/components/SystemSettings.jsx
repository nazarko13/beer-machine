import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { routes } from 'common/constants';
import Button from 'common/components/Button';
import { TimePickerField } from 'common/components';

const WorkingTimeForm = () => {
  const { control, handleSubmit } = useForm();

  const handleSave = () => null;

  return (
    <Grid item container component="form" spacing={2}>
      <Grid item xs={6}>
        <Controller
          name="from"
          defaultValue="00:00"
          control={control}
          render={({ field }) => (
            <TimePickerField
              {...field}
              label="Від"
              views={['hours']}
              orientation="landscape"
              renderInput={(params) => (
                <TextField fullWidth size="medium" {...params} />
              )}
            />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="to"
          defaultValue="00:00"
          control={control}
          render={({ field }) => (
            <TimePickerField
              {...field}
              label="До"
              size="medium"
              views={['hours']}
              orientation="landscape"
              renderInput={(params) => (
                <TextField fullWidth size="medium" {...params} />
              )}
            />
          )}
        />
      </Grid>

      <Grid item container justifyContent="flex-end">
        <Button fullWidth text="ЗБЕРЕГТИ" onClick={handleSubmit(handleSave)} />
      </Grid>
    </Grid>
  );
};

const SystemSettings = () => {
  const navigate = useNavigate();

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
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
          <Grid item container xs={4} direction="column">
            <Grid item xs>
              <Typography variant="h2">Час роботи апарату</Typography>
            </Grid>

            <Grid item xs={5} pt={2}>
              <WorkingTimeForm />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default SystemSettings;
