import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from '../constants/theme';

export function StatusCard({ theme, icon, title, detail, tone = 'normal' }: { theme: AppTheme; icon: ReactNode; title: string; detail?: string; tone?: 'normal' | 'success' | 'warning' | 'danger' }) {
  const color = tone === 'success' ? theme.success : tone === 'warning' ? theme.warning : tone === 'danger' ? theme.danger : theme.primary;
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.icon, { backgroundColor: tone === 'normal' ? theme.primarySoft : `${color}18` }]}>{icon}</View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {detail ? <Text style={[styles.detail, { color: theme.muted }]}>{detail}</Text> : null}
      </View>
      <View style={[styles.dot, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, borderWidth: 1, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  copy: { flex: 1, gap: 3 },
  title: { fontSize: 15, fontWeight: '700' },
  detail: { fontSize: 12, lineHeight: 17 },
  dot: { width: 9, height: 9, borderRadius: 5 },
});
