import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import isEqual from 'lodash/isEqual';

import { openModal } from 'modules/modalHandler/ducks';
import { modalNames } from 'common/constants';
import {
  controlPositions,
  controlsOrderToAccess,
} from '../constants/adminAccessControls';

const clearControlsAfterMilliseconds = 5000;

const AdminAccessControl = ({ controlIndex, addControlIndex }) => {
  const position = controlPositions[controlIndex];

  return (
    <Grid
      {...position}
      width={150}
      height={150}
      zIndex={1301}
      position="absolute"
      onClick={() => addControlIndex(controlIndex)}
    />
  );
};

const AdminAccessControls = () => {
  const dispatch = useDispatch();
  const [controls, setControls] = useState([]);

  const addControlIndex = (ctrl) =>
    setControls((prevControls) => [...prevControls, ctrl]);

  const clearControlsAfterStartAccessProcess = useCallback(() => {
    if (controls.length === 1) {
      setTimeout(() => {
        setControls([]);
      }, clearControlsAfterMilliseconds);
    }
  }, [controls]);

  const handleOpenAdminAccessModal = useCallback(() => {
    const showAccessModal = isEqual(controls, controlsOrderToAccess);

    if (showAccessModal) {
      dispatch(openModal({ name: modalNames.adminAuth, xs: 4 }));
      setControls([]);
    }
  }, [dispatch, controls]);

  useEffect(() => {
    clearControlsAfterStartAccessProcess();
  }, [clearControlsAfterStartAccessProcess]);

  useEffect(() => {
    handleOpenAdminAccessModal();
  }, [handleOpenAdminAccessModal]);

  return (
    <>
      {controlsOrderToAccess.map((controlIndex) => (
        <AdminAccessControl
          key={controlIndex}
          controlIndex={controlIndex}
          addControlIndex={addControlIndex}
        />
      ))}
    </>
  );
};

export default AdminAccessControls;
