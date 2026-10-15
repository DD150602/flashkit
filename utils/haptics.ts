import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export async function confirmHaptic() {
  try {
    if (Platform.OS === 'android') {
      await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch {
    // Haptics are optional hardware feedback; keep the UI responsive if unavailable.
  }
}
