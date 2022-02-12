import React, { useCallback, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Button from 'common/components/Button';
import { routes } from 'common/constants';
import Typography from '@mui/material/Typography';
import * as adminActions from '../ducks';
import { mainButtons, systemActions, systemActionsLabels } from '../constants';
import { getSystemInfoData, getLoading } from '../ducks/selectors';

const SystemInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(getLoading);
  const systemInfoData = useSelector(getSystemInfoData);

  const runSystemAction = useCallback(
    (action) => {
      dispatch(adminActions.setSystemInfo({ action }));
    },
    [dispatch]
  );

  const getSystemInfo = useCallback(() => {
    dispatch(adminActions.getSystemInfo());
  }, [dispatch]);

  const resetSystemInfo = useCallback(() => {
    runSystemAction(systemActions.resetCounters);
  }, [runSystemAction]);

  useEffect(() => getSystemInfo(), [getSystemInfo]);

  useEffect(() => () => resetSystemInfo(), [resetSystemInfo]);

  return (
    <Grid container direction="column">
      <Grid item container pt={2} pr={2} spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button
            text="Вийти"
            color="error"
            onClick={() => navigate(routes.public.home)}
          />
        </Grid>
      </Grid>

      <Grid container direction="row" wrap="nowrap" spacing={1}>
        <Grid item xs={9} direction="row" container spacing={1}>
          {mainButtons.map((action) => (
            <Grid item key={action} xs={4}>
              <Button
                disabled={loading}
                text={systemActionsLabels[action]}
                onClick={() => runSystemAction(action)}
              />
            </Grid>
          ))}
        </Grid>

        <Grid item xs={3} container direction="column">
          <Grid item xs container direction="column" spacing={1}>
            {systemInfoData.map((data) => (
              <Grid key={data.id} item container spacing={1} wrap="nowrap">
                <Typography item component={Grid} xs={8}>
                  {data.label}: -
                </Typography>
                <Typography item component={Grid} xs={4}>
                  {data.value}
                </Typography>
              </Grid>
            ))}
          </Grid>

          <Grid item xs container>
            <Grid item xs={4}>
              <Button
                text="Оновити"
                disabled={loading}
                onClick={getSystemInfo}
              />

              <Button
                disabled={loading}
                onClick={resetSystemInfo}
                text={systemActionsLabels[systemActions.resetCounters]}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SystemInfo;
