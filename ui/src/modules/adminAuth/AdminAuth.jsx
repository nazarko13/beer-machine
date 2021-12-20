import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

import { useActivityHandler, useNotify } from 'common/hooks';
import { closeModal } from 'modules/modalHandler/ducks';
import { adminLogin } from 'modules/home/ducks';
import { routes } from 'common/constants';
import AuthForm from './components/AuthForm';

const AdminAuth = ({ onClose = null }) => {
  const notify = useNotify();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authContainer, setAuthContainer] = useState();

  const onError = (error) =>
    notify.error(error.response?.data?.description || error.message);
  const onSuccess = () => {
    dispatch(closeModal());
    navigate(routes.private.admin);
  };

  const handleAuth = (data) => {
    dispatch(adminLogin(data)).then(({ error }) => {
      if (error) {
        onError(error);
        return;
      }

      onSuccess();
    });
  };

  useActivityHandler(authContainer, onClose);

  return (
    <Paper component={Grid} p={1} px={2} ref={setAuthContainer}>
      <Typography p={2} px={3} variant="h3">
        Вхід Адміністратора
      </Typography>

      <AuthForm onSubmit={handleAuth} onClose={onClose} />
    </Paper>
  );
};

export default AdminAuth;
