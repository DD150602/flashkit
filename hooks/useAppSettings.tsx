import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import type { AppSettings } from '../types/settings';
import { DEFAULT_SETTINGS } from '../types/settings';

const STORAGE_KEY = '@flashkit/settings-v1';
type SettingsContextValue = {
  settings: AppSettings;
  ready: boolean;
  updateSettings: (patch: Partial<AppSettings>) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const settingsRef = useRef(settings);
  const pendingRef = useRef<Partial<AppSettings>>({});

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!alive || !stored) return;
        try {
          const parsed: unknown = JSON.parse(stored);
          if (typeof parsed === 'object' && parsed !== null) {
            const value = parsed as Partial<AppSettings>;
            const loaded: AppSettings = {
              shakeEnabled: typeof value.shakeEnabled === 'boolean' ? value.shakeEnabled : DEFAULT_SETTINGS.shakeEnabled,
              hapticsEnabled: typeof value.hapticsEnabled === 'boolean' ? value.hapticsEnabled : DEFAULT_SETTINGS.hapticsEnabled,
              theme: value.theme === 'light' || value.theme === 'dark' || value.theme === 'system' ? value.theme : DEFAULT_SETTINGS.theme,
              ...pendingRef.current,
            };
            settingsRef.current = loaded;
            setSettings(loaded);
            if (Object.keys(pendingRef.current).length > 0) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loaded)).catch(() => undefined);
          }
        } catch {
          // Ignore malformed local data and keep safe defaults.
        }
      })
      .catch(() => undefined)
      .finally(() => { if (alive) setReady(true); });
    return () => { alive = false; };
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    pendingRef.current = { ...pendingRef.current, ...patch };
    const next = { ...settingsRef.current, ...patch };
    settingsRef.current = next;
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
  }, []);

  const value = useMemo(() => ({ settings, ready, updateSettings }), [settings, ready, updateSettings]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useAppSettings must be used inside AppSettingsProvider');
  return context;
}
