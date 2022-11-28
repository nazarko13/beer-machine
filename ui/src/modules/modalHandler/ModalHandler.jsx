import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';

import { modalNames } from 'common/constants';
import { MessageModal } from 'common/components';

import AdminAuth from '../adminAuth/AdminAuth';
import { getModalState } from './ducks/selectors';
import { closeModal } from './ducks';

const ModalHandler = () => {
  const dispatch = useDispatch();
  const modals = useSelector(getModalState);

  const open = useMemo(() => !!modals?.length, [modals]);

  const onClose = useCallback(
    (modalName) => {
      dispatch(closeModal(modalName));
    },
    [dispatch]
  );

  return modals.map((modal) => (
    <Modal
      hideBackdrop
      open={open}
      component={Grid}
      bgcolor="#00000060"
      key={modal.name}
    >
      <Grid container justifyContent="center" alignItems="center" height="100%">
        <Grid item xs={modal?.xs || 8}>
          {
            {
              [modalNames.adminAuth]: (
                <AdminAuth {...modal} onClose={onClose} />
              ),
              [modalNames.healthStateMessage]: <MessageModal {...modal} />,
              [modalNames.message]: (
                <MessageModal {...modal} onClose={onClose} />
              ),
              [modalNames.workingHours]: <MessageModal {...modal} />,
            }[modal.name]
          }
        </Grid>
      </Grid>
    </Modal>
  ));
};

export default ModalHandler;
