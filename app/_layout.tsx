import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppSettingsProvider } from '../hooks/useAppSettings';

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </AppSettingsProvider>
  );
}
