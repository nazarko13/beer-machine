import { fields } from './constants';

const floatFields = [fields.price, fields.quantity, fields.pulseCount];

export const parseBeerModel = (beer) =>
  Object.keys(beer).reduce(
    (acc, key) => ({
      ...acc,
      [key]: floatFields.includes(key) ? Number(beer[key]) : beer[key],
    }),
    {}
  );
