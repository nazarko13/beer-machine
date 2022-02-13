import { createEnum } from 'common/utils';
import { beerLabels, beerTypes } from 'common/constants';

export const fields = createEnum({
  isActive: null,
  name: null,
  price: null,
  type: null,
  pulseCount: null,
  barcode: null,
  keg: null,
  quantity: null,
});

export const fieldLabels = createEnum({
  [fields.isActive]: 'Активність',
  [fields.name]: "Ім'я",
  [fields.price]: 'Ціна',
  [fields.type]: 'Тип',
  [fields.pulseCount]: 'Кількість імпульсів',
  [fields.barcode]: 'Баркод',
  [fields.keg]: 'Кега',
  [fields.quantity]: 'Кількість',
});

export const fieldSizes = createEnum({
  [fields.isActive]: 1,
  [fields.name]: 2,
  [fields.price]: 1,
  [fields.type]: 2,
  [fields.pulseCount]: 1,
  [fields.barcode]: 2,
  [fields.keg]: 2,
  [fields.quantity]: 1,
});

export const adminFieldSet = [
  fields.isActive,
  fields.name,
  fields.price,
  fields.type,
  fields.keg,
  fields.quantity,
];
export const superAdminFieldSet = Object.values(fields);

export const beerTypeOptions = [
  {
    name: 'Не вибрано',
    value: '',
  },
  {
    name: beerLabels.light,
    value: beerTypes.light,
  },
  {
    name: beerLabels.dark,
    value: beerTypes.dark,
  },
];

export const kagOptions = [
  {
    name: 'Не вибрано',
    value: '',
  },
  {
    name: 'Кега 1',
    value: 'BEER_KEG_1',
  },
  {
    name: 'Кега 2',
    value: 'BEER_KEG_2',
  },
];
