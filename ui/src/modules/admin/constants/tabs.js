import { createEnum } from 'common/utils';

export const tabKeys = createEnum({
  settingsForm: null,
  systemInfo: null,
  cleaning: null,
});

export const tabNames = createEnum({
  [tabKeys.settingsForm]: 'НАЛАШТУВАННЯ',
  [tabKeys.systemInfo]: 'СИСТЕМНА ІНФОРМАЦІЯ',
  [tabKeys.cleaning]: 'САНІТИЗАЦІЯ',
});

export const adminTabs = [
  {
    value: tabKeys.settingsForm,
    name: tabNames[tabKeys.settingsForm],
  },
  {
    value: tabKeys.systemInfo,
    name: tabNames[tabKeys.systemInfo],
  },
  {
    value: tabKeys.cleaning,
    name: tabNames[tabKeys.cleaning],
  },
];

export const superAdminTabs = [
  {
    value: tabKeys.settingsForm,
    name: tabNames[tabKeys.settingsForm],
  },
  {
    value: tabKeys.systemInfo,
    name: tabNames[tabKeys.systemInfo],
  },
  {
    value: tabKeys.cleaning,
    name: tabNames[tabKeys.cleaning],
  },
];
