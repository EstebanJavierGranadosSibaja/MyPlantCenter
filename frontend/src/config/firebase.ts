import { initializeApp, getApp, getApps } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as firebaseAuth from 'firebase/auth';
import { Platform } from 'react-native';

const {
  getAuth,
  initializeAuth,
} = firebaseAuth;

type Persistence = firebaseAuth.Persistence;

const getReactNativePersistence = (
  firebaseAuth as unknown as { getReactNativePersistence?: (storage: unknown) => Persistence }
).getReactNativePersistence;

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence
        ? getReactNativePersistence(AsyncStorage)
        : undefined,
    });

export { auth };

export default app;
