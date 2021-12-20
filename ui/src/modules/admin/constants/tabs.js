import { createEnum } from 'common/utils';

export const tabKeys = createEnum({
  settingsForm: null,
  systemInfo: null,
});

export const tabNames = createEnum({
  [tabKeys.settingsForm]: 'НАЛАШТУВАННЯ',
  [tabKeys.systemInfo]: 'СИСТЕМНА ІНФОРМАЦІЯ',
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
];
