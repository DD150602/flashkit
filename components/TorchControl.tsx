import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from '../constants/theme';

export function TorchControl({ theme, isOn, busy, onPress }: { theme: AppTheme; isOn: boolean; busy: boolean; onPress: () => void }) {
  const fill = isOn ? theme.warning : theme.surface;
  const foreground = isOn ? '#422006' : theme.primary;
  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={isOn ? 'Apagar linterna' : 'Encender linterna'}
        accessibilityState={{ checked: isOn, disabled: busy }}
        disabled={busy}
        onPress={onPress}
        style={({ pressed }) => [styles.button, { backgroundColor: fill, borderColor: isOn ? theme.warning : theme.border, transform: [{ scale: pressed ? 0.97 : 1 }] }, isOn && styles.onShadow]}
      >
        {busy ? <ActivityIndicator color={foreground} size="large" /> : <Ionicons name="flashlight" size={58} color={foreground} />}
      </Pressable>
      <Text style={[styles.label, { color: theme.text }]}>{isOn ? 'Toca para apagar' : busy ? 'Conectando cámara…' : 'Toca para encender'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 15, paddingVertical: 8 },
  button: { width: 192, height: 192, borderRadius: 100, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  onShadow: { shadowColor: '#FACC15', shadowOpacity: 0.26, shadowRadius: 22, shadowOffset: { width: 0, height: 8 }, elevation: 7 },
  label: { fontWeight: '700', fontSize: 15 },
});
