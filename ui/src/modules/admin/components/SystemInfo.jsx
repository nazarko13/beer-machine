import React, { useCallback, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@mui/material/Card';

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
    <Grid container direction="column" p={1}>
      <Grid
        item
        container
        pt={2}
        pr={2}
        pb={4}
        spacing={2}
        justifyContent="flex-end"
      >
        <Grid item>
          <Button
            text="Вийти"
            color="error"
            onClick={() => navigate(routes.public.home)}
          />
        </Grid>
      </Grid>

      <Grid container direction="row" wrap="nowrap" spacing={3}>
        <Grid item xs={7} direction="row" container spacing={1}>
          {mainButtons.map((action) => (
            <Grid item key={action} xs={4}>
              <Button
                fullWidth
                disabled={loading}
                style={{ minHeight: 50 }}
                text={systemActionsLabels[action]}
                onClick={() => runSystemAction(action)}
              />
            </Grid>
          ))}
        </Grid>

        <Grid item xs={5} container direction="column" spacing={2}>
          <Grid item xs container direction="column" spacing={1}>
            <Card
              component={Grid}
              container
              spacing={1}
              p={3}
              direction="column"
            >
              {systemInfoData.map((data) => (
                <Grid key={data.id} item container spacing={1} wrap="nowrap">
                  <Typography
                    variant="h4"
                    item
                    component={Grid}
                    style={{ fontWeight: 100 }}
                    xs={8}
                  >
                    {data.label}:
                  </Typography>
                  <Typography
                    variant="h4"
                    item
                    style={{ fontWeight: 100 }}
                    component={Grid}
                    xs={4}
                  >
                    {data.value}
                  </Typography>
                </Grid>
              ))}
            </Card>
          </Grid>

          <Grid item xs container direction="row" wrap="nowrap" spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                style={{ minHeight: 50 }}
                text="Оновити"
                disabled={loading}
                onClick={getSystemInfo}
              />
            </Grid>

            <Grid item xs={6}>
              <Button
                fullWidth
                style={{ minHeight: 50 }}
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
