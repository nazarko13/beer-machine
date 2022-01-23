import { useDispatch, useSelector } from 'react-redux';
import { getPourLoading } from '../ducks/selectors';
import { useCallback, useEffect, useState } from 'react';
import { getPourStatus } from '../ducks';

const useGetPourStatus = () => {
  const dispatch = useDispatch();
  const pourLoading = useSelector(getPourLoading);
  const [, setCurrentInterval] = useState(null);

  const clearCurrentInterval = useCallback(() => setCurrentInterval(i => {
    clearInterval(i);
    return null;
  }), [])

  const getStatus = useCallback(() => {
    if (!pourLoading) {
      clearCurrentInterval();

      return;
    }

    const int = setInterval(() => {
      dispatch(getPourStatus()).then((data) => {
        if (data.finished) {
          clearCurrentInterval();
        }
      });
    }, 2000);

    setCurrentInterval(int);
  }, [pourLoading, dispatch, clearCurrentInterval]);

  useEffect(() => {
    getStatus();
  }, [getStatus])
};

export default useGetPourStatus;
