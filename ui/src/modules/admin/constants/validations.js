import * as Yup from 'yup';

export const systemSettingsSchema = Yup.object().shape({
  // eslint-disable-next-line react/forbid-prop-types
  workingHours: Yup.object({
    toHour: Yup.string().test(
      'data-test',
      'Час завершення роботи не може бути меншим за час почтаку',
      (value = '', { parent }) => {
        const { fromHour = '' } = parent || {};
        const [fromH, fromM] = (fromHour || '').split(':').map(Number);
        const [toH, toM] = (value || '').split(':').map(Number);

        const from = fromH + fromM / 60;
        const to = toH + toM / 60;

        return to >= from;
      }
    ),
  }),
});

const requiredMessage = 'Це поле обовʼязкове';

export const addBeerSchema = Yup.object().shape({
  name: Yup.string().required(requiredMessage),
  price: Yup.string().required(requiredMessage),
  type: Yup.string().required(requiredMessage),
  pulseCount: Yup.string().required(requiredMessage),
  barcode: Yup.string().required(requiredMessage),
  keg: Yup.string().required(requiredMessage),
  quantity: Yup.string().required(requiredMessage),
  description: Yup.string().required(requiredMessage),
});
