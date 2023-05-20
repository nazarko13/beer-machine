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
  [fields.isActive]: '8%',
  [fields.name]: '20%',
  [fields.price]: '8%',
  [fields.type]: '11%',
  [fields.pulseCount]: '10%',
  [fields.barcode]: '15%',
  [fields.keg]: '11%',
  [fields.quantity]: '8%',
});

export const fieldSizesAdmin = createEnum({
  [fields.isActive]: '10%',
  [fields.name]: '45%',
  [fields.price]: '10%',
  [fields.keg]: '15%',
  [fields.quantity]: '10%',
});

export const maxActiveBeersCount = 4;

export const adminFieldSet = [
  fields.isActive,
  fields.name,
  fields.price,
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

export const kagOptions = new Array(maxActiveBeersCount + 1)
  .fill(null)
  .map((_, index) => {
    if (!index) {
      return {
        name: 'Не вибрано',
        value: '',
      };
    }

    return {
      name: `Кега ${index}`,
      value: `BEER_KEG_${index}`,
    };
  });
