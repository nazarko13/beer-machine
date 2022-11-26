import React, { forwardRef } from 'react';
import { MobileTimePicker } from '@mui/x-date-pickers';

const TimePickerField = forwardRef(
  ({ label, error, placeholder, ...props }, ref) => {
    return (
      <MobileTimePicker
        ampmInClock
        showToolbar={false}
        label={label}
        placeholder={placeholder}
        error={error}
        ref={ref}
        {...props}
      />
    );
  }
);

export default TimePickerField;
