import React, { useState, useEffect, useCallback } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';

import { getNotification } from './ducks/selectors';
import { hideNotification } from './ducks';

const Notification = ({ type, autoHideDuration, ...props }) => {
  const [open, setOpen] = useState(false);
  const notification = useSelector(getNotification);
  const dispatch = useDispatch();

  useEffect(() => {
    setOpen(!!notification?.message);
  }, [notification]);

  const handleExited = useCallback(() => {
    dispatch(hideNotification());
  }, [dispatch]);

  const handleRequestClose = useCallback(() => {
    setOpen(false);
    handleExited();
  }, [setOpen, handleExited]);

  const handleUndo = useCallback(() => {
    // dispatch(handleUndoAction());
  }, []);

  const autoHideAfter =
    typeof notification?.autoHideDuration === 'undefined'
      ? autoHideDuration
      : notification?.autoHideDuration;

  return (
    <Snackbar
      open={open}
      onClose={handleRequestClose}
      message={notification?.message}
      autoHideDuration={autoHideAfter}
      action={notification?.undoable && handleUndo}
      disableWindowBlurListener={notification?.undoable}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      {...props}
    >
      <Alert onClose={handleRequestClose} severity={notification?.type || type}>
        <Typography variant="h3">{notification?.message}</Typography>
      </Alert>
    </Snackbar>
  );
};

Notification.defaultProps = {
  type: 'info',
  autoHideDuration: 5000,
};

export default Notification;
