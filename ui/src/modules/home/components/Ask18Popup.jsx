import React, { useCallback, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import Button from 'common/components/Button';

const closeDelay = 15000;

const Ask18Popup = ({ open, onClose = () => null, onSuccess = () => null }) => {
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
        <DialogContent>
          <Typography variant="h1" component="span" lineHeight="1.15">
            Вам вже виповнилося 18 років?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            fullWidth
            size="large"
            text="ТАК"
            color="info"
            onClick={onSuccess}
            sx={{ fontSize: 24 }}
          />

          <Button
            fullWidth
            size="large"
            text="НІ"
            color="error"
            onClick={onClose}
            sx={{ fontSize: 24 }}
          />
        </DialogActions>
      </Grid>
    </Dialog>
  );
};

export default Ask18Popup;
