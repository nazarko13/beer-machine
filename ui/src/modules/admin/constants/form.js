import { createEnum } from 'common/utils';
import { beerLabels, beerTypes } from 'common/constants';

export const fields = createEnum({
  isActive: null,
  name: null,
  price: null,
  type: null,
  pulseCount: null,
});

export const fieldLabels = createEnum({
  [fields.isActive]: 'Активність',
  [fields.name]: "Ім'я",
  [fields.price]: 'Ціна',
  [fields.type]: 'Тип',
  [fields.pulseCount]: 'Кількість імпудьсів',
});

export const fieldSizes = createEnum({
  [fields.isActive]: 2,
  [fields.name]: 4,
  [fields.price]: 2,
  [fields.type]: 2,
  [fields.pulseCount]: 2,
});

export const adminFieldSet = [fields.isActive, fields.name, fields.price, fields.type];
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
  }
];
