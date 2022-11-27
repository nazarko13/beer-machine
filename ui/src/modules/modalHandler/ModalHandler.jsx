import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';

import { modalNames } from 'common/constants';
import { MessageModal } from 'common/components';

import { getModalName, getModalProps } from './ducks/selectors';
import AdminAuth from '../adminAuth/AdminAuth';
import { closeModal } from './ducks';

const ModalHandler = () => {
  const dispatch = useDispatch();
  const modalName = useSelector(getModalName);
  const modalProps = useSelector(getModalProps);

  const open = useMemo(() => !!modalName, [modalName]);

  const onClose = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return (
    <Modal hideBackdrop open={open} component={Grid} bgcolor="#00000060">
      <Grid container justifyContent="center" alignItems="center" height="100%">
        <Grid item xs={modalProps?.xs || 8}>
          {
            {
              [modalNames.adminAuth]: (
                <AdminAuth {...modalProps} onClose={onClose} />
              ),
              [modalNames.healthStateMessage]: <MessageModal {...modalProps} />,
              [modalNames.message]: (
                <MessageModal {...modalProps} onClose={onClose} />
              ),
              [modalNames.workingHours]: <MessageModal {...modalProps} />,
            }[modalName]
          }
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ModalHandler;
