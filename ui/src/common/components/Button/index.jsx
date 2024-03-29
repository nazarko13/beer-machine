import React from 'react';
import MUIButton from '@mui/material/Button';

const Button = ({
  classes = null,
  text = '',
  color = 'primary',
  onClick = () => null,
  variant = 'contained',
  size = 'large',
  children = undefined,
  ...props
}) => (
  <MUIButton
    size={size}
    color={color}
    variant={variant}
    onClick={onClick}
    classes={classes}
    {...props}
  >
    {text || children}
  </MUIButton>
);

export default Button;
