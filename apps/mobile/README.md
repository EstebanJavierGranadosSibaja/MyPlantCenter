# MyPlantCenter Mobile (Expo + React Native)

Aplicacion mobile de MyPlantCenter construida con Expo y React Native.

## Estructura Actual

```text
apps/mobile/
|-- app/
|   `-- index.tsx                 # Entrada de la app (providers + navigator)
|-- src/
|   |-- core/
|   |   |-- config/               # Firebase
|   |   |-- contexts/             # Auth y Theme providers
|   |   |-- http/                 # Cliente Axios
|   |   |-- navigation/           # Stack + Tabs
|   |   `-- theme/                # Tokens y tema
|   |-- features/
|   |   |-- auth/
|   |   |-- camera/
|   |   |-- dashboard/
|   |   |-- explore/
|   |   |-- friends/
|   |   |-- plants/
|   |   `-- profile/
|   |-- components/               # Componentes compartidos
|   |-- hooks/                    # Hooks compartidos
|   `-- shared/
|       |-- components/
|       `-- hooks/
|-- assets/
|-- android/
|-- app.json
|-- index.js
`-- package.json
```

## Navegacion Actual

Flujo no autenticado:

- Login
- Register

Flujo autenticado:

- Tabs: Inicio, Plantas, CameraAction, Amigos, Perfil
- Stack adicional: CameraScan, UserProfile, EditProfile, AddPlant, EditPlant

## Variables De Entorno (`.env.local`)

Variables usadas hoy por la app:

```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_DEBUG_AUTH=false
```

Variables opcionales:

- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ID` (fallback de client IDs)

Nota para API local:

- Android emulador: `EXPO_PUBLIC_API_URL=http://10.0.2.2:8000`
- iOS simulador o dispositivo fisico: usar la IP local de tu maquina, por ejemplo `http://192.168.x.x:8000`

## Instalacion y Ejecucion

Desde la raiz del repo:

```bash
npm run frontend:install
npm run frontend:start
```

Comandos utiles desde la raiz:

```bash
npm run frontend:android
npm run frontend:ios
npm run frontend:lint
```

Si prefieres trabajar dentro de `apps/mobile`:

```bash
npm install
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

## Integracion Con Backend

- El cliente HTTP usa `EXPO_PUBLIC_API_URL`.
- Requests autenticadas agregan:
	- `Authorization: Bearer <firebase-id-token>`
	- `x-trace-id` para trazabilidad
