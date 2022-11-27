import * as Yup from 'yup';

export const systemSettingsSchema = Yup.object().shape({
  // eslint-disable-next-line react/forbid-prop-types
  workingHours: Yup.object({
    toHour: Yup.number().test(
      'data-test',
      'Час завершення роботи не може бути меншим за час почтаку',
      (value, { parent }) => {
        const { fromHour } = parent;
        return value >= fromHour;
      }
    ),
  }),
});
