import React, { forwardRef } from 'react';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { MenuItem } from '@mui/material';

const InputField = forwardRef(
  ({ label, value, error, placeholder, options = [], name, ...props }, ref) => {
    return (
      <FormControl container component={Grid}>
        {label && (
          <Grid item pb={1}>
            <Typography>{label}</Typography>
          </Grid>
        )}

        <Grid item container position="relative">
          <Select
            name={name}
            ref={ref}
            size="small"
            value={value || ''}
            error={!!error?.message}
            placeholder={placeholder || label}
            {...props}
          >
            {options.map((option) => {
              return (
                <MenuItem key={`${name}_${option.value}`} value={option.value}>
                  {option.name}
                </MenuItem>
              );
            })}
          </Select>

          {!!error?.message && (
            <Typography
              color="error"
              variant="caption"
              sx={{ position: 'absolute', top: '95%' }}
            >
              {error.message}
            </Typography>
          )}
        </Grid>
      </FormControl>
    );
  }
);

export default InputField;
