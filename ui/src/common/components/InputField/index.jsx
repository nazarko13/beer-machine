import React, { forwardRef } from 'react';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

const InputField = forwardRef(
  ({ label, value, error, placeholder, ...props }, ref) => (
    <FormControl container component={Grid}>
      {label && (
        <Grid item pb={1}>
          <Typography>{label}</Typography>
        </Grid>
      )}

      <Grid item container>
        <Input
          fullWidth
          ref={ref}
          size="small"
          value={value || ''}
          error={!!error?.message}
          placeholder={placeholder || label}
          {...props}
        />
      </Grid>
    </FormControl>
  )
);

export default InputField;
