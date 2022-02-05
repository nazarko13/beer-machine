import React from 'react';
import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import Typography from '@mui/material/Typography';
import Button from '../Button';

const Message = ({ message, onClose, title }) => {
  return (
    <Grid bgcolor="background.primary">
      <DialogTitle>
        <Typography variant="h4" component="span">
          {title || 'ВИБАЧТЕ, СТАЛАСЯ ПОМИЛКА!'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>

      {onClose && (
        <DialogActions>
          <Button text="ЗАКРИТИ" color="primary" onClick={onClose} />
        </DialogActions>
      )}
    </Grid>
  );
};

export default Message;
