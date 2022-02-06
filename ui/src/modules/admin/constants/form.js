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
});

export const fieldLabels = createEnum({
  [fields.isActive]: 'Активність',
  [fields.name]: "Ім'я",
  [fields.price]: 'Ціна',
  [fields.type]: 'Тип',
  [fields.pulseCount]: 'Кількість імпульсів',
  [fields.barcode]: 'Баркод',
  [fields.keg]: 'Кега',
});

export const fieldSizes = createEnum({
  [fields.isActive]: 2,
  [fields.name]: 2,
  [fields.price]: 1,
  [fields.type]: 2,
  [fields.pulseCount]: 1,
  [fields.barcode]: 1,
  [fields.keg]: 2,
});

export const adminFieldSet = [
  fields.isActive,
  fields.name,
  fields.price,
  fields.type,
  fields.keg,
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
