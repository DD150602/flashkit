import { StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from '../constants/theme';
import type { Acceleration } from '../hooks/useShakeDetection';

export function SensorReadings({ theme, reading, magnitude }: { theme: AppTheme; reading: Acceleration; magnitude: number }) {
  const axes: Array<[string, number]> = [['X', reading.x], ['Y', reading.y], ['Z', reading.z]];
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.axes}>
        {axes.map(([axis, value]) => (
          <View key={axis} style={[styles.axis, { backgroundColor: theme.background }]}>
            <Text style={[styles.axisName, { color: theme.muted }]}>{axis}</Text>
            <Text style={[styles.axisValue, { color: theme.text }]}>{value.toFixed(2)}</Text>
            <Text style={[styles.unit, { color: theme.muted }]}>g</Text>
          </View>
        ))}
      </View>
      <View style={[styles.total, { borderTopColor: theme.border }]}>
        <Text style={[styles.totalLabel, { color: theme.muted }]}>Magnitud</Text>
        <Text style={[styles.totalValue, { color: theme.primary }]}>{magnitude.toFixed(2)} <Text style={[styles.unit, { color: theme.muted }]}>g</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 18, padding: 14, gap: 14 },
  axes: { flexDirection: 'row', gap: 9 },
  axis: { flex: 1, borderRadius: 13, paddingVertical: 11, alignItems: 'center', gap: 3 },
  axisName: { fontSize: 11, fontWeight: '700' },
  axisValue: { fontSize: 17, fontWeight: '800', fontVariant: ['tabular-nums'] },
  unit: { fontSize: 11, fontWeight: '500' },
  total: { paddingTop: 12, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 13, fontWeight: '600' },
  totalValue: { fontSize: 18, fontWeight: '800', fontVariant: ['tabular-nums'] },
});
