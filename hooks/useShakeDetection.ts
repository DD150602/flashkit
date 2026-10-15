import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

export type Acceleration = { x: number; y: number; z: number };
const SHAKE_THRESHOLD = 2.35;
const RESET_THRESHOLD = 1.45;
const COOLDOWN_MS = 1300;
const UPDATE_INTERVAL_MS = 120;

export function useShakeDetection(enabled: boolean, onShake: () => void) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [reading, setReading] = useState<Acceleration>({ x: 0, y: 0, z: 0 });
  const [shakeDetected, setShakeDetected] = useState(false);
  const lastShakeAt = useRef(0);
  const armed = useRef(true);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onShakeRef = useRef(onShake);
  onShakeRef.current = onShake;
  useEffect(() => {
    let subscription: ReturnType<typeof Accelerometer.addListener> | null = null;
    let alive = true;
    setShakeDetected(false);
    armed.current = true;
    if (!enabled) {
      setAvailable(null);
      setReading({ x: 0, y: 0, z: 0 });
      return;
    }

    Accelerometer.isAvailableAsync().then((isAvailable) => {
      if (!alive) return;
      setAvailable(isAvailable);
      if (!isAvailable) return;
      Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        setReading((previous) => {
          if (Math.abs(previous.x - x) + Math.abs(previous.y - y) + Math.abs(previous.z - z) < 0.08) return previous;
          return { x, y, z };
        });
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();
        if (magnitude < RESET_THRESHOLD && now - lastShakeAt.current > COOLDOWN_MS) armed.current = true;
        if (armed.current && magnitude > SHAKE_THRESHOLD && now - lastShakeAt.current > COOLDOWN_MS) {
          armed.current = false;
          lastShakeAt.current = now;
          setShakeDetected(true);
          onShakeRef.current();
          if (resetTimer.current) clearTimeout(resetTimer.current);
          resetTimer.current = setTimeout(() => setShakeDetected(false), 650);
        }
      });
    }).catch(() => { if (alive) setAvailable(false); });

    return () => {
      alive = false;
      subscription?.remove();
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [enabled]);

  const magnitude = Math.sqrt(reading.x ** 2 + reading.y ** 2 + reading.z ** 2);
  return { available, reading, magnitude, shakeDetected };
}
