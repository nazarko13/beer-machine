import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { notificationTypes } from 'common/constants/enums';
import { showNotification } from 'modules/notification/ducks';

const useNotify = () => {
  const dispatch = useDispatch();

  const notify = useCallback(
    (params, type) => {
      const notification =
        typeof params === 'string' ? { message: params } : params;
      return dispatch(showNotification({ ...notification, type }));
    },
    [dispatch]
  );

  const info = (params) => notify(params, notificationTypes.info);
  const error = (params) => notify(params, notificationTypes.error);
  const warning = (params) => notify(params, notificationTypes.warning);
  const success = (params) => notify(params, notificationTypes.success);

  return {
    info,
    error,
    success,
    warning,
  };
};

export default useNotify;
