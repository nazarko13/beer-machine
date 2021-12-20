import React, { forwardRef } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const CheckBoxField = forwardRef(
  ({ label, error, placeholder, ...props }, ref) => {
    return (
      <FormControlLabel
        label={label}
        control={
          <Checkbox
            ref={ref}
            {...props}
            name="antoine"
            checked={props.value}
            onChange={props.onChange}
          />
        }
      />
    );
  }
);

export default CheckBoxField;
