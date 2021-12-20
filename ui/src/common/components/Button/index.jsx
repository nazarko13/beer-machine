import React from 'react';
import MUIButton from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  root: {
    height: ({ height }) => height,
    color: '#000',
    backgroundColor: '#EFA047',

    '&:hover': {
      color: '#fff',
      backgroundColor: '#3C4A52',
    },
  },
});

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
