import * as SecureStore from 'expo-secure-store';
import { ChatKeyPair } from './crypto';

// El par de llaves se guarda en el almacenamiento CIFRADO del dispositivo
// (expo-secure-store), nunca en AsyncStorage (que no está cifrado).

const SECRET_KEY = 'chat_secretKey';
const PUBLIC_KEY = 'chat_publicKey';

export async function saveKeyPair(kp: ChatKeyPair): Promise<void> {
  await SecureStore.setItemAsync(SECRET_KEY, kp.secretKey);
  await SecureStore.setItemAsync(PUBLIC_KEY, kp.publicKey);
}

export async function loadKeyPair(): Promise<ChatKeyPair | null> {
  const secretKey = await SecureStore.getItemAsync(SECRET_KEY);
  const publicKey = await SecureStore.getItemAsync(PUBLIC_KEY);
  if (secretKey && publicKey) {
    return { secretKey, publicKey };
  }
  return null;
}
