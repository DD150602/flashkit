import type { ColorSchemeName } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';

export type AppTheme = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  primary: string;
  primarySoft: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  tabBar: string;
};

export const palette: Record<'light' | 'dark', AppTheme> = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#EFF6FF',
    text: '#0F172A',
    muted: '#64748B',
    primary: '#3B82F6',
    primarySoft: '#DBEAFE',
    border: '#E2E8F0',
    success: '#16A34A',
    warning: '#FACC15',
    danger: '#EF4444',
    tabBar: '#FFFFFF',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceAlt: '#24364F',
    text: '#F8FAFC',
    muted: '#94A3B8',
    primary: '#3B82F6',
    primarySoft: '#1E3A5F',
    border: '#334155',
    success: '#4ADE80',
    warning: '#FACC15',
    danger: '#EF4444',
    tabBar: '#111D32',
  },
};

export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 } as const;

export function resolveTheme(preference: ThemePreference, system: ColorSchemeName): AppTheme {
  const mode = preference === 'system' ? system : preference;
  return palette[mode === 'dark' ? 'dark' : 'light'];
}
