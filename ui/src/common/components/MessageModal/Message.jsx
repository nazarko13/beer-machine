import React, { useCallback, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import Button from '../Button';
import { modalNames } from '../../constants';

const Message = ({ message, onClose, title }) => {
  const container = useRef();

  const eventHandler = useCallback(() => {
    setTimeout(() => {
      onClose(modalNames.message);
    }, 60000);
  }, [onClose]);

  useEffect(() => eventHandler(), [eventHandler]);

  return (
    <Grid
      container
      p={2}
      ref={container}
      direction="column"
      justifyContent="space-between"
      bgcolor="background.primary"
    >
      <DialogTitle>
        <Typography variant="h1" component="span">
          {title || 'ВИБАЧТЕ, СТАЛАСЯ ПОМИЛКА!'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="h1" style={{ fontWeight: 100 }}>
          {message}
        </Typography>
      </DialogContent>

      {onClose && (
        <DialogActions>
          <Button
            text="ЗАКРИТИ"
            color="primary"
            onClick={() => onClose(modalNames.message)}
          />
        </DialogActions>
      )}
    </Grid>
  );
};

export default Message;
