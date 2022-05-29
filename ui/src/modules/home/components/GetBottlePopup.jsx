import React, { useCallback, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';

import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

const closeDelay = 10000;

const GetBottlePopup = ({ open, onClose = () => null }) => {
  const startCloseProcess = useCallback(() => {
    if (!open) {
      return;
    }

    setTimeout(() => {
      onClose();
    }, closeDelay);
  }, [onClose, open]);

  useEffect(() => {
    startCloseProcess();
  }, [startCloseProcess]);

  return (
    <Dialog open={open}>
      <Grid
        container
        p={2}
        minHeight={250}
        alignItems="center"
        justifyContent="center"
      >
        <DialogTitle>
          <Typography variant="h1" component="span">
            Ваше пиво налите.
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="h2"
            style={{ fontWeight: 100, textAlign: 'center' }}
          >
            Будь ласка, заберіть пляшку з наливу.
          </Typography>
        </DialogContent>
      </Grid>
    </Dialog>
  );
};

export default GetBottlePopup;
