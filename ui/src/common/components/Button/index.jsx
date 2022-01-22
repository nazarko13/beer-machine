import React from 'react';
import MUIButton from '@mui/material/Button';

const Button = ({
  classes = null,
  text = '',
  color = 'primary',
  onClick = () => null,
  variant = 'contained',
  ...props
}) => (
  <MUIButton
    color={color}
    variant={variant}
    onClick={onClick}
    classes={classes}
    {...props}
  >
    {text}
  </MUIButton>
);

export default Button;
