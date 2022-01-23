import { useDispatch, useSelector } from 'react-redux';
import { getPourLoading } from '../ducks/selectors';
import { useCallback, useEffect, useState } from 'react';
import { getPourStatus } from '../ducks';

const useGetPourStatus = () => {
  const dispatch = useDispatch();
  const pourLoading = useSelector(getPourLoading);
  const [, setCurrentInterval] = useState(null);

  const getStatus = useCallback(() => {
    if (!pourLoading) {
      setCurrentInterval(i => {
        clearInterval(i);
        return null;
      });

      return;
    }

    const int = setInterval(() => {
      dispatch(getPourStatus()).then((data) => {
        console.log(data);
        if (data.finished) {
          setCurrentInterval(i => {
            console.log(i);
            clearInterval(i);
            return null;
          })
        }
      });
    }, 2000);

    setCurrentInterval(int);
  }, [pourLoading, dispatch]);

  useEffect(() => {
    getStatus();
  }, [getStatus])
};

export default useGetPourStatus;
