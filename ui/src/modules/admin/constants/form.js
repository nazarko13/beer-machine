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
  expirationDate: null,
});
// isActive, name, keg, quantity, expirationDate, 31, test print, test pour, testPrint, // edit
// test pour Math.round(pulseCount / 10)
export const fieldLabels = createEnum({
  [fields.isActive]: 'Активність',
  [fields.name]: "Ім'я",
  [fields.price]: 'Ціна',
  [fields.type]: 'Тип',
  [fields.pulseCount]: 'Кількість імпульсів',
  [fields.barcode]: 'Баркод',
  [fields.keg]: 'Кега',
  [fields.quantity]: 'Кількість',
  [fields.expirationDate]: 'Вжити До',
});

export const fieldSizes = createEnum({
  [fields.isActive]: '10%',
  [fields.name]: '25%',
  [fields.pulseCount]: '10%',
  [fields.keg]: '15%',
  [fields.quantity]: '9%',
  [fields.expirationDate]: '12%',
});

export const maxActiveBeersCount = 4;

export const adminFieldSet = [
  fields.isActive,
  fields.name,
  fields.keg,
  fields.quantity,
  fields.expirationDate,
];

export const superAdminFieldSet = [
  fields.isActive,
  fields.name,
  fields.keg,
  fields.quantity,
  fields.expirationDate,
];

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
