# FlashKit

Aplicación móvil Expo y TypeScript con tres pestañas: Linterna, Sensor y Ajustes.

## Preparar e iniciar

Requiere Node.js 22.13 o posterior.

```powershell
cd C:\Users\DD150\dev\flashkit
npm install
npx expo install --fix
npx expo start
```

Abre el proyecto en un dispositivo Android o iOS con Expo Go para revisar pantallas y sensor. Para probar la linterna, usa un teléfono físico y acepta el permiso de cámara cuando pulses Encender. La linterna usa `CameraView` con `enableTorch`; el permiso no se solicita al abrir la app. Concede ese permiso una vez antes de probar el control por sacudida.

Activa Detección de sacudidas en Ajustes. El acelerómetro se conecta solo al usar Linterna o Sensor. La sacudida alterna la luz desde Linterna; Sensor muestra lecturas y detecciones en vivo.

## Comprobaciones

```powershell
npx tsc --noEmit
npx expo-doctor
```

## APK con EAS

```powershell
npm install --global eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

El perfil `preview` produce un APK de distribución interna. EAS necesita una sesión iniciada y un proyecto vinculado; `eas build:configure` configura el proyecto y añade el identificador remoto cuando corresponda.
