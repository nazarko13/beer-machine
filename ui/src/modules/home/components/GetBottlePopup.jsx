import React, { useCallback, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';

import MessageModal from 'common/components/MessageModal';

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
      <MessageModal
        title="Ваше пиво налите."
        message="Будь ласка, заберіть пляшку з наливу."
      />
    </Dialog>
  );
};

export default GetBottlePopup;
