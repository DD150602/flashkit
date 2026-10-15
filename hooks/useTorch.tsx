import { CameraView, useCameraPermissions } from 'expo-camera';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { useSegments } from 'expo-router';
import { useAppSettings } from './useAppSettings';
import { useShakeDetection } from './useShakeDetection';

type TorchContextValue = {
  isOn: boolean;
  busy: boolean;
  error: string | null;
  cameraGranted: boolean;
  toggleTorch: () => Promise<boolean>;
  setTorch: (next: boolean) => Promise<boolean>;
  shake: ReturnType<typeof useShakeDetection>;
};
const TorchContext = createContext<TorchContextValue | null>(null);

export function TorchProvider({ children }: PropsWithChildren) {
  const [permission, requestPermission] = useCameraPermissions();
  const [desired, setDesired] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraFailed, setCameraFailed] = useState(false);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const requestRef = useRef(false);
  const previousRoute = useRef<string | null>(null);
  const { settings } = useAppSettings();
  const segments = useSegments();
  const onTorchRoute = segments[segments.length - 1] === 'index';
  const onSensorRoute = segments[segments.length - 1] === 'sensor';
  const sensorCanControl = onSensorRoute && settings.shakeEnabled;
  const cameraRoute = onTorchRoute || sensorCanControl;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => setAppActive(state === 'active'));
    return () => subscription.remove();
  }, []);

  const setTorch = useCallback(async (next: boolean) => {
    setError(null);
    if (!next) {
      setDesired(false);
      setIsOn(false);
      setBusy(false);
      requestRef.current = false;
      return true;
    }
    if (cameraFailed) {
      setError('La cámara trasera no está disponible. Comprueba el permiso y el hardware del dispositivo.');
      return false;
    }
    if (!permission?.granted) {
      setBusy(true);
      try {
        const result = await requestPermission();
        if (!result.granted) {
          setError('Se necesita permiso de cámara para usar la linterna. Puedes habilitarlo en Ajustes del dispositivo.');
          return false;
        }
      } catch {
        setError('No se pudo solicitar acceso a la cámara.');
        return false;
      } finally {
        setBusy(false);
      }
    }
    if (!onTorchRoute && !sensorCanControl) {
      setError('Vuelve a la pestaña Linterna para encenderla.');
      return false;
    }
    setBusy(true);
    requestRef.current = true;
    setDesired(true);
    if (ready) {
      setIsOn(true);
      setBusy(false);
    }
    return true;
  }, [permission?.granted, requestPermission, onTorchRoute, sensorCanControl, ready, cameraFailed]);

  const toggleTorch = useCallback(async () => setTorch(!desired), [desired, setTorch]);

  const handleShake = useCallback(() => {
    if ((!onTorchRoute && !sensorCanControl) || !appActive || !permission?.granted) return;
    void setTorch(!desired);
  }, [onTorchRoute, sensorCanControl, appActive, permission?.granted, setTorch, desired]);
  const shake = useShakeDetection(settings.shakeEnabled && (onTorchRoute || onSensorRoute) && appActive, handleShake);

  useEffect(() => {
    const currentRoute = onTorchRoute ? 'index' : onSensorRoute ? 'sensor' : 'other';
    const routeChanged = previousRoute.current !== null && previousRoute.current !== currentRoute;
    previousRoute.current = currentRoute;
    if ((!onTorchRoute && !sensorCanControl) || !appActive || routeChanged) {
      setDesired(false);
      setIsOn(false);
      setBusy(false);
      setReady(false);
      return;
    }
    if (!permission?.granted) {
      setDesired(false);
      setIsOn(false);
    }
  }, [onTorchRoute, onSensorRoute, sensorCanControl, appActive, permission?.granted]);

  const onReady = () => {
    setCameraFailed(false);
    setError(null);
    setReady(true);
    if (requestRef.current && desired) {
      setIsOn(true);
      setBusy(false);
      requestRef.current = false;
    }
  };
  const onMountError = () => {
    setCameraFailed(true);
    setDesired(false);
    setIsOn(false);
    setBusy(false);
    setError('La cámara o el flash no están disponibles en este dispositivo.');
  };

  const value = useMemo(() => ({ isOn, busy, error, cameraGranted: permission?.granted ?? false, toggleTorch, setTorch, shake }), [isOn, busy, error, permission?.granted, toggleTorch, setTorch, shake]);
  return (
    <TorchContext.Provider value={value}>
      {children}
      {permission?.granted && cameraRoute && appActive ? (
        <View pointerEvents="none" style={styles.cameraHost}>
          <CameraView
            key={onTorchRoute ? 'flashlight-camera' : 'sensor-camera'}
            style={styles.camera}
            facing="back"
            enableTorch={desired}
            active={cameraRoute && appActive}
            onCameraReady={onReady}
            onMountError={onMountError}
          />
        </View>
      ) : null}
    </TorchContext.Provider>
  );
}

const styles = StyleSheet.create({
  cameraHost: { position: 'absolute', width: 1, height: 1, opacity: 0, right: 0, bottom: 0, overflow: 'hidden' },
  camera: { width: 1, height: 1 },
});

export function useTorch() {
  const context = useContext(TorchContext);
  if (!context) throw new Error('useTorch must be used inside TorchProvider');
  return context;
}
