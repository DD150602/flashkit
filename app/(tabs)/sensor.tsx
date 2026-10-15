import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Screen } from '../../components/Screen';
import { SensorReadings } from '../../components/SensorReadings';
import { StatusCard } from '../../components/StatusCard';
import { resolveTheme } from '../../constants/theme';
import { useAppSettings } from '../../hooks/useAppSettings';
import { useTorch } from '../../hooks/useTorch';

export default function SensorScreen() {
  const { settings, updateSettings } = useAppSettings();
  const { isOn, error, cameraGranted, shake } = useTorch();
  const theme = resolveTheme(settings.theme, useColorScheme());
  const status = !settings.shakeEnabled ? 'Detección inactiva' : shake.available === null ? 'Comprobando sensor…' : shake.available ? 'Acelerómetro disponible' : 'Sensor no disponible';
  const tone = shake.shakeDetected ? 'success' : shake.available === false ? 'warning' : 'normal';

  return (
    <Screen theme={theme} title="Sensor de movimiento" subtitle="Acelerómetro para detectar una sacudida intencional.">
      <StatusCard
        theme={theme}
        icon={<Ionicons name="speedometer-outline" size={20} color={theme.primary} />}
        title={status}
        detail={shake.available === false ? 'Este dispositivo no ofrece datos del acelerómetro.' : settings.shakeEnabled ? 'Sacude el teléfono para alternar la linterna en su pestaña.' : 'Activa la detección para empezar a leer el movimiento.'}
        tone={tone}
      />

      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.sectionHead}>
          <View style={styles.headingCopy}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Lecturas en vivo</Text>
            <Text style={[styles.sectionSub, { color: theme.muted }]}>Aceleración por eje</Text>
          </View>
          <View style={[styles.live, { backgroundColor: settings.shakeEnabled && shake.available ? `${theme.success}18` : theme.background }]}>
            <View style={[styles.liveDot, { backgroundColor: settings.shakeEnabled && shake.available ? theme.success : theme.muted }]} />
            <Text style={[styles.liveText, { color: theme.muted }]}>{settings.shakeEnabled && shake.available ? 'EN VIVO' : 'PAUSADO'}</Text>
          </View>
        </View>
        <SensorReadings theme={theme} reading={shake.reading} magnitude={shake.magnitude} />
      </View>

      <StatusCard
        theme={theme}
        icon={<Ionicons name={shake.shakeDetected ? 'pulse' : 'flashlight-outline'} size={20} color={shake.shakeDetected ? theme.success : theme.primary} />}
        title={shake.shakeDetected ? '¡Sacudida detectada!' : isOn ? 'Linterna encendida' : 'Linterna apagada'}
        detail={shake.shakeDetected && !cameraGranted ? 'Sacudida detectada. Concede permiso de cámara desde Linterna para cambiar la luz.' : shake.shakeDetected ? 'La señal superó el umbral de movimiento.' : 'La sacudida alterna la luz mientras usas Sensor o Linterna.'}
        tone={shake.shakeDetected ? 'success' : isOn ? 'success' : 'normal'}
      />
      {error ? (
        <View style={[styles.info, { backgroundColor: `${theme.danger}12` }]}>
          <Ionicons name="warning-outline" size={19} color={theme.danger} />
          <Text style={[styles.infoText, { color: theme.danger }]}>{error}</Text>
        </View>
      ) : null}

      <View style={[styles.info, { backgroundColor: theme.surfaceAlt }]}>
        <Ionicons name="information-circle-outline" size={19} color={theme.primary} />
        <Text style={[styles.infoText, { color: theme.muted }]}>Se calcula la magnitud con X, Y y Z. El umbral ignora movimientos suaves y aplica una pausa breve entre sacudidas.</Text>
      </View>

      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: settings.shakeEnabled }}
        onPress={() => updateSettings({ shakeEnabled: !settings.shakeEnabled })}
        style={({ pressed }) => [styles.control, { backgroundColor: settings.shakeEnabled ? theme.primary : theme.surface, borderColor: settings.shakeEnabled ? theme.primary : theme.border, opacity: pressed ? 0.88 : 1 }]}
      >
        <Ionicons name={settings.shakeEnabled ? 'pause-outline' : 'play-outline'} size={19} color={settings.shakeEnabled ? '#FFFFFF' : theme.primary} />
        <Text style={[styles.controlText, { color: settings.shakeEnabled ? '#FFFFFF' : theme.text }]}>{settings.shakeEnabled ? 'Desactivar detección' : 'Activar detección'}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { borderWidth: 1, borderRadius: 18, padding: 14, gap: 14 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  headingCopy: { gap: 3 },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  sectionSub: { fontSize: 12 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 9, letterSpacing: 0.6, fontWeight: '800' },
  info: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 13, borderRadius: 14 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
  control: { minHeight: 52, borderWidth: 1, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9 },
  controlText: { fontSize: 14, fontWeight: '700' },
});
