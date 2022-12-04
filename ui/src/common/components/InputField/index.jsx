import React, { forwardRef } from 'react';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

const InputField = forwardRef(
  (
    { label, value, error, placeholder, size = 'small', fieldLabel, ...props },
    ref
  ) => {
    return (
      <FormControl container component={Grid} size={size}>
        {label && (
          <Grid item pb={1}>
            <Typography>{label}</Typography>
          </Grid>
        )}

        <Grid item container>
          <Input
            ref={ref}
            size={size}
            value={value}
            error={!!error?.message}
            label={fieldLabel}
            helperText={error?.message}
            placeholder={placeholder || label || fieldLabel}
            {...props}
            inputProps={{
              autoComplete: 'new-password',
              form: {
                autocomplete: 'off',
              },
            }}
          />
        </Grid>
      </FormControl>
    );
  }
);

export default InputField;
