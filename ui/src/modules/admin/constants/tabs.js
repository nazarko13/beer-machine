import { createEnum } from 'common/utils';

export const tabKeys = createEnum({
  settingsForm: null,
  systemInfo: null,
  cleaning: null,
  generalSettings: null,
});

export const tabNames = createEnum({
  [tabKeys.settingsForm]: 'НАЛАШТУВАННЯ',
  [tabKeys.systemInfo]: 'СИСТЕМНА ІНФОРМАЦІЯ',
  [tabKeys.cleaning]: 'САНІТИЗАЦІЯ',
  [tabKeys.generalSettings]: 'СИСТЕМНІ НАЛАШТУВАННЯ',
});

export const adminTabs = [
  {
    value: tabKeys.settingsForm,
    name: tabNames[tabKeys.settingsForm],
    admin: true,
  },
  {
    value: tabKeys.systemInfo,
    name: tabNames[tabKeys.systemInfo],
  },
  {
    value: tabKeys.cleaning,
    name: tabNames[tabKeys.cleaning],
    admin: true,
  },
  {
    value: tabKeys.generalSettings,
    name: tabNames[tabKeys.generalSettings],
  },
];
