import React, { forwardRef } from 'react';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { MenuItem } from '@mui/material';

const InputField = forwardRef(
  ({ label, value, error, placeholder, options = [], ...props }, ref) => (
    <FormControl container component={Grid}>
      {label && (
        <Grid item pb={1}>
          <Typography>{label}</Typography>
        </Grid>
      )}

      <Grid item container>
        <Select
          ref={ref}
          size="small"
          value={value || ''}
          error={!!error?.message}
          placeholder={placeholder || label}
          {...props}
        >
          {options.map(({ name, value }) => <MenuItem key={value} value={value}>{name}</MenuItem>)}
        </Select>
      </Grid>
    </FormControl>
  )
);

export default InputField;
