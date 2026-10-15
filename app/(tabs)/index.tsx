import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Screen } from '../../components/Screen';
import { StatusCard } from '../../components/StatusCard';
import { TorchControl } from '../../components/TorchControl';
import { resolveTheme } from '../../constants/theme';
import { useAppSettings } from '../../hooks/useAppSettings';
import { useTorch } from '../../hooks/useTorch';
import { confirmHaptic } from '../../utils/haptics';

export default function FlashlightScreen() {
  const { settings } = useAppSettings();
  const { isOn, busy, error, toggleTorch, shake } = useTorch();
  const theme = resolveTheme(settings.theme, useColorScheme());
  const [feedback, setFeedback] = useState('');

  const testHaptics = async () => {
    if (!settings.hapticsEnabled) {
      setFeedback('Activa las respuestas hápticas en Ajustes para probarlas.');
      return;
    }
    await confirmHaptic();
    setFeedback('Respuesta háptica enviada.');
    setTimeout(() => setFeedback(''), 1800);
  };

  return (
    <Screen theme={theme} title="FlashKit" subtitle="Herramientas rápidas para tu dispositivo">
      <View style={styles.stateLine}>
        <View style={[styles.liveDot, { backgroundColor: isOn ? theme.warning : theme.muted }]} />
        <Text style={[styles.state, { color: theme.text }]}>{isOn ? 'Linterna encendida' : 'Linterna apagada'}</Text>
        <Text style={[styles.kicker, { color: theme.muted }]}>{isOn ? 'FLASH ACTIVO' : 'LISTA PARA USAR'}</Text>
      </View>

      <TorchControl theme={theme} isOn={isOn} busy={busy} onPress={() => { void toggleTorch(); }} />

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: `${theme.danger}12`, borderColor: `${theme.danger}40` }]}>
          <Ionicons name="warning-outline" size={19} color={theme.danger} />
          <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
        </View>
      ) : null}

      <Pressable accessibilityRole="button" onPress={() => { void testHaptics(); }} style={[styles.hapticCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.hapticIcon, { backgroundColor: theme.primarySoft }]}><Ionicons name="radio-outline" size={20} color={theme.primary} /></View>
        <View style={styles.hapticCopy}>
          <Text style={[styles.hapticTitle, { color: theme.text }]}>Probar vibración</Text>
          <Text style={[styles.hapticDetail, { color: theme.muted }]}>{feedback || (settings.hapticsEnabled ? 'Pulsa para una confirmación breve' : 'Desactivada en Ajustes')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.muted} />
      </Pressable>

      <StatusCard
        theme={theme}
        icon={<Ionicons name="phone-portrait-outline" size={19} color={theme.primary} />}
        title={settings.shakeEnabled ? 'Sacudida activada en Ajustes' : 'Sacudida desactivada'}
        detail={shake.available === false ? 'Acelerómetro no disponible' : 'También puedes controlar la luz desde la pestaña Sensor.'}
        tone={shake.available === false ? 'warning' : settings.shakeEnabled ? 'success' : 'normal'}
      />
      <Text style={[styles.note, { color: theme.muted }]}>La detección se configura en Ajustes y funciona mientras usas Linterna o Sensor.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stateLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveDot: { width: 9, height: 9, borderRadius: 5 },
  state: { fontWeight: '700', fontSize: 15, flex: 1 },
  kicker: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 13, borderWidth: 1, borderRadius: 14 },
  errorText: { flex: 1, lineHeight: 19, fontSize: 13 },
  hapticCard: { borderWidth: 1, borderRadius: 17, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11 },
  hapticIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  hapticCopy: { flex: 1, gap: 3 },
  hapticTitle: { fontWeight: '700', fontSize: 14 },
  hapticDetail: { fontSize: 12 },
  note: { fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: -8 },
});
