import type { ThemePreference } from '../constants/theme';

export type AppSettings = {
  shakeEnabled: boolean;
  hapticsEnabled: boolean;
  theme: ThemePreference;
};

export const DEFAULT_SETTINGS: AppSettings = {
  shakeEnabled: false,
  hapticsEnabled: true,
  theme: 'system',
};
