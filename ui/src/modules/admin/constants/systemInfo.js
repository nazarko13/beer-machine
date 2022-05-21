import { createEnum } from 'common/utils';

export const systemActions = createEnum({
  openDoor: 'OPEN_DOOR',
  closeDoor: 'CLOSE_DOOR',
  pressureValveOpen: 'PRESSURE_VALVE_OPEN',
  pressureValveClose: 'PRESSURE_VALVE_CLOSE',
  waterOpen: 'WATER_OPEN',
  waterClose: 'WATER_CLOSE',
  intakeAirOpen: 'INTAKE_AIR_OPEN',
  intakeAirClose: 'INTAKE_AIR_CLOSE',
  beer1Open: 'BEER_1_OPEN',
  beer1Close: 'BEER_1_CLOSE',
  beer2Open: 'BEER_2_OPEN',
  beer2Close: 'BEER_2_CLOSE',
  resetCounters: 'RESET_COUNTERS',
  airOpen: 'AIR_OPEN',
  airClose: 'AIR_CLOSE',
});

export const systemActionsLabels = createEnum({
  [systemActions.openDoor]: 'Відкрити шторку',
  [systemActions.closeDoor]: 'Закрити шторку',
  [systemActions.pressureValveOpen]: 'Притиснути пляшку',
  [systemActions.pressureValveClose]: 'Відтиснути пляшку',
  [systemActions.waterOpen]: 'Відкрити клапан води',
  [systemActions.waterClose]: 'Закрити клапан води',
  [systemActions.intakeAirOpen]: 'Відкрити клапан стравки',
  [systemActions.intakeAirClose]: 'Закрити клапан стравки',
  [systemActions.beer1Open]: 'Відкрити 1й клапан пива',
  [systemActions.beer1Close]: 'Закрити 1й клапан пива',
  [systemActions.beer2Open]: 'Відкрити 2й клапан пива',
  [systemActions.beer2Close]: 'Закрити 2й клапан пива',
  [systemActions.resetCounters]: 'Скинути витратоміри',
  [systemActions.resetCounters]: 'Скинути витратоміри',
  [systemActions.resetCounters]: 'Скинути витратоміри',
  [systemActions.airOpen]: 'Відкрити клапан повітря',
  [systemActions.airClose]: 'Закрити клапан повітря',
});

export const mainButtons = [
  systemActions.openDoor,
  systemActions.closeDoor,
  systemActions.pressureValveOpen,
  systemActions.pressureValveClose,
  systemActions.waterOpen,
  systemActions.waterClose,
  systemActions.intakeAirOpen,
  systemActions.intakeAirClose,
  systemActions.beer1Open,
  systemActions.beer1Close,
  systemActions.beer2Open,
  systemActions.beer2Close,
  systemActions.airOpen,
  systemActions.airClose,
];

export const systemInfoModel = createEnum({
  actuatorsState: null,
  amperes: null,
  beerCounter1: null,
  beerCounter2: null,
  beerCounter3: null,
  beerCounter4: null,
  doorSensor: null,
  pressureInSystem: null,
  tempInSystem: null,
  voltage: null,
});

export const systemInfoModelLabels = createEnum({
  [systemInfoModel.actuatorsState]: 'Стан приводів',
  [systemInfoModel.amperes]: 'Сила струму (A)',
  [systemInfoModel.beerCounter1]: 'Кількість пива 1',
  [systemInfoModel.beerCounter2]: 'Кількість пива 2',
  [systemInfoModel.beerCounter3]: 'Кількість пива 3',
  [systemInfoModel.beerCounter4]: 'Кількість пива 4',
  [systemInfoModel.doorSensor]: 'Датчик шторки',
  [systemInfoModel.pressureInSystem]: 'Тиск системи',
  [systemInfoModel.tempInSystem]: 'Температура системи',
  [systemInfoModel.voltage]: 'Напруга (V)',
});
