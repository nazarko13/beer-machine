import React, { useCallback, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

import { keyboardLayouts, routes } from 'common/constants';
import Button from 'common/components/Button';
import KeyboardProvider from 'common/components/Keyboard';
import { InputField, SelectField } from 'common/components';
import {
  systemActionsLabels,
  cleaningTestActions,
  kagOptions,
} from '../constants';
import * as adminActions from '../ducks';

const defaultValues = { cleanser: '4000', water: '6000' };

const Cleaning = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [keg, setKeg] = useState(kagOptions[1].value);
  const [inputValues, setValues] = useState(defaultValues);
  const [activeInput, setActiveInput] = useState(null);

  const updateValues = (value) => {
    setValues((v) => ({ ...v, ...value }));
  };

  const runSystemAction = useCallback(
    (action, params = {}) => {
      dispatch(adminActions.setSystemInfo({ action, ...params }));
    },
    [dispatch]
  );

  const formData = useMemo(() => ({ keg, ...inputValues }), [inputValues, keg]);

  const onChangeKeg = (e, v) => {
    setKeg(v.props.value);
  };

  const sedSanitizeAction = (liquidName) =>
    dispatch(
      adminActions.sendSanitizeAction({
        keg,
        liquid: liquidName,
        pulseCount: Number(
          liquidName === 'water' ? formData.water : formData.cleanser
        ),
      })
    );

  const sedBeerAction = () =>
    dispatch(adminActions.sendSanitizeAction({ keg }));

  const onChangeLiquid = ({ target }) => {
    setValues((v) => ({ ...v, cleanser: target.value }));
  };

  const onChangeWater = ({ target }) => {
    setValues((v) => ({ ...v, water: target.value }));
  };

  return (
    <Grid
      container
      maxHeight="100%"
      position="relative"
      direction="column"
      p={1}
      spacing={2}
      alignItems="center"
      minHeight="calc(100vh + 215px)"
    >
      <Grid
        item
        container
        pr={2}
        pb={2}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item container justifyContent="flex-end">
          <Button
            text="Вийти"
            color="error"
            onClick={() => navigate(routes.public.home)}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        padding={5}
        wrap="nowrap"
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item container xs={6} spacing={3}>
          {cleaningTestActions.map((action) => (
            <Grid item key={action} xs={6}>
              <Button
                fullWidth
                style={{ minHeight: 50 }}
                text={systemActionsLabels[action]}
                onClick={() => runSystemAction(action)}
              />
            </Grid>
          ))}
        </Grid>

        <Grid item container xs={6}>
          <SelectField
            name="keg"
            fullWidth
            size="small"
            variant="filled"
            label="Кега"
            ref={(r) => r}
            value={keg}
            options={kagOptions}
            onChange={onChangeKeg}
          />
        </Grid>

        <Grid item container diection="row" xs={7} spacing={1}>
          <Grid item xs={5} />

          <Grid item xs={5} ml={2} py={2}>
            <Typography>Кількість імпульсів</Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          xs={9}
          spacing={1}
          diection="column"
          alignItems="center"
        >
          <Grid item container spacing={1}>
            <Grid item xs={5}>
              <Button
                fullWidth
                text="Миюча рідина"
                style={{ minHeight: 50 }}
                onClick={() => sedSanitizeAction('cleanser')}
              />
            </Grid>

            <Grid item xs={5}>
              <InputField
                ref={() => null}
                name="cleanser"
                fullWidth
                size="large"
                value={formData.cleanser}
                onChange={onChangeLiquid}
                onFocus={() => setActiveInput('cleanser')}
              />
            </Grid>
          </Grid>

          <Grid item container spacing={1}>
            <Grid item xs={5}>
              <Button
                fullWidth
                text="ВОДА"
                style={{ minHeight: 50 }}
                onClick={() => sedSanitizeAction('water')}
              />
            </Grid>

            <Grid item xs={5}>
              <InputField
                fullWidth
                ref={() => null}
                name="water"
                size="large"
                value={formData.water}
                onChange={onChangeWater}
                onFocus={() => setActiveInput('water')}
              />
            </Grid>
          </Grid>

          <Grid item container spacing={1} justifyContent="flex-start">
            <Grid item xs={5}>
              <Button
                fullWidth
                text="ПИВО"
                style={{ minHeight: 50 }}
                onClick={sedBeerAction}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {!!activeInput && (
        <Grid
          item
          container
          bottom={0}
          zIndex={100}
          position="fixed"
          justifyContent="center"
        >
          <KeyboardProvider
            width={350}
            values={formData}
            layout={keyboardLayouts.numeric}
            inputName={activeInput}
            onChangeAll={updateValues}
            handleHideKeyboard={() => setActiveInput(null)}
          />
        </Grid>
      )}
    </Grid>
  );
};
export default Cleaning;
