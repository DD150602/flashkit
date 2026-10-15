import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar, useColorScheme } from 'react-native';
import { TorchProvider } from '../../hooks/useTorch';
import { useAppSettings } from '../../hooks/useAppSettings';
import { resolveTheme } from '../../constants/theme';

export default function TabLayout() {
  const { settings } = useAppSettings();
  const system = useColorScheme();
  const theme = resolveTheme(settings.theme, system);

  return (
    <TorchProvider>
      <StatusBar barStyle={settings.theme === 'dark' || (settings.theme === 'system' && system === 'dark') ? 'light-content' : 'dark-content'} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.muted,
          tabBarStyle: { backgroundColor: theme.tabBar, borderTopColor: theme.border, height: 64, paddingTop: 7, paddingBottom: 7 },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          sceneStyle: { backgroundColor: theme.background },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Linterna', tabBarIcon: ({ color, size }) => <Ionicons name="flashlight" color={color} size={size} /> }} />
        <Tabs.Screen name="sensor" options={{ title: 'Sensor', tabBarIcon: ({ color, size }) => <Ionicons name="phone-portrait-outline" color={color} size={size} /> }} />
        <Tabs.Screen name="settings" options={{ title: 'Ajustes', tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} /> }} />
      </Tabs>
    </TorchProvider>
  );
}
