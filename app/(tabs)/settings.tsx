import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Screen } from '../../components/Screen';
import { SettingRow } from '../../components/SettingRow';
import { resolveTheme, type ThemePreference } from '../../constants/theme';
import { useAppSettings } from '../../hooks/useAppSettings';

const themeOptions: Array<{ value: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { value: 'light', label: 'Claro', icon: 'sunny-outline' },
  { value: 'dark', label: 'Oscuro', icon: 'moon-outline' },
  { value: 'system', label: 'Sistema', icon: 'phone-portrait-outline' },
];

export default function SettingsScreen() {
  const { settings, updateSettings } = useAppSettings();
  const theme = resolveTheme(settings.theme, useColorScheme());

  return (
    <Screen theme={theme} title="Ajustes" subtitle="Personaliza cómo responde FlashKit.">
      <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.groupLabel, { color: theme.muted }]}>CONTROLES</Text>
        <SettingRow
          theme={theme}
          icon={<Ionicons name="phone-portrait-outline" size={19} color={theme.primary} />}
          title="Detección de sacudidas"
          description="Sacude el teléfono en Linterna o Sensor para alternar la luz."
          value={settings.shakeEnabled}
          onValueChange={(shakeEnabled) => updateSettings({ shakeEnabled })}
        />
        <SettingRow
          theme={theme}
          icon={<Ionicons name="radio-outline" size={19} color={theme.primary} />}
          title="Respuestas hápticas"
          description="Vibración breve para confirmar acciones de la aplicación."
          value={settings.hapticsEnabled}
          onValueChange={(hapticsEnabled) => updateSettings({ hapticsEnabled })}
          last
        />
      </View>

      <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.groupLabel, { color: theme.muted }]}>APARIENCIA</Text>
        <View style={styles.themeOptions}>
          {themeOptions.map((option) => {
            const selected = settings.theme === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => updateSettings({ theme: option.value })}
                style={[styles.themeOption, { backgroundColor: selected ? theme.primarySoft : theme.background, borderColor: selected ? theme.primary : theme.border }]}
              >
                <Ionicons name={option.icon} size={16} color={selected ? theme.primary : theme.muted} />
                <Text style={{ color: selected ? theme.primary : theme.muted, fontSize: 12, fontWeight: '700' }}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.about, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.appIcon, { backgroundColor: theme.primarySoft }]}><Ionicons name="flash" size={22} color={theme.primary} /></View>
        <View style={styles.aboutText}>
          <Text style={[styles.appName, { color: theme.text }]}>FlashKit</Text>
          <Text style={[styles.aboutDescription, { color: theme.muted }]}>Herramientas rápidas para tu dispositivo.</Text>
        </View>
        <Text style={[styles.version, { color: theme.muted }]}>v1.0.0</Text>
      </View>
      <Text style={[styles.footer, { color: theme.muted }]}>Tus preferencias se guardan únicamente en este dispositivo.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingTop: 14, paddingBottom: 2 },
  groupLabel: { fontSize: 10, letterSpacing: 1.1, fontWeight: '800', marginBottom: 2, marginLeft: 2 },
  themeOptions: { flexDirection: 'row', gap: 8, paddingVertical: 10 },
  themeOption: { flex: 1, minHeight: 44, borderWidth: 1, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  about: { borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  appIcon: { height: 45, width: 45, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  aboutText: { flex: 1, gap: 3 },
  appName: { fontSize: 15, fontWeight: '800' },
  aboutDescription: { fontSize: 12 },
  version: { fontSize: 11, fontWeight: '700' },
  footer: { textAlign: 'center', fontSize: 12, lineHeight: 18 },
});
