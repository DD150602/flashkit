import { Switch, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import type { AppTheme } from '../constants/theme';

export function SettingRow({ theme, icon, title, description, value, onValueChange, last = false }: { theme: AppTheme; icon: ReactNode; title: string; description: string; value: boolean; onValueChange: (value: boolean) => void; last?: boolean }) {
  return (
    <View style={[styles.row, !last && { borderBottomColor: theme.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}>{icon}</View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.description, { color: theme.muted }]}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: theme.border, true: theme.primary }} thumbColor="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 82, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 4 },
  title: { fontWeight: '700', fontSize: 14 },
  description: { fontSize: 12, lineHeight: 17 },
});
