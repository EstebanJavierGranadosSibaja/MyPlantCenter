import 'react-native-get-random-values';
import { decode as decodeBase64, encode as encodeBase64 } from '@stablelib/base64';
import { decode as decodeUTF8, encode as encodeUTF8 } from '@stablelib/utf8';
import nacl from 'tweetnacl';

// ─────────────────────────────────────────────────────────────────────────────
// Cifrado E2E del chat (compatible con el chat_backend / Grupo 4).
//   - DM:    nacl.box      (Curve25519 — par de llaves por usuario)
//   - Grupo: nacl.secretbox (clave simétrica compartida que entrega el servidor)
// El formato en el cable es base64(nonce ++ ciphertext).

export interface ChatKeyPair {
  publicKey: string;
  secretKey: string;
}

export function generateKeyPair(): ChatKeyPair {
  const kp = nacl.box.keyPair();
  return {
    publicKey: encodeBase64(kp.publicKey),
    secretKey: encodeBase64(kp.secretKey),
  };
}

export function encryptDM(
  message: string,
  recipientPublicKeyB64: string,
  mySecretKeyB64: string,
): string {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const encrypted = nacl.box(
    encodeUTF8(message),
    nonce,
    decodeBase64(recipientPublicKeyB64),
    decodeBase64(mySecretKeyB64),
  );
  return encodeBase64(new Uint8Array([...nonce, ...encrypted]));
}

export function decryptDM(
  ciphertextB64: string,
  senderPublicKeyB64: string,
  mySecretKeyB64: string,
): string | null {
  try {
    const data = decodeBase64(ciphertextB64);
    const nonce = data.slice(0, nacl.box.nonceLength);
    const box = data.slice(nacl.box.nonceLength);
    const result = nacl.box.open(
      box,
      nonce,
      decodeBase64(senderPublicKeyB64),
      decodeBase64(mySecretKeyB64),
    );
    return result ? decodeUTF8(result) : null;
  } catch {
    return null;
  }
}

export function encryptGroup(message: string, groupKeyB64: string): string {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const encrypted = nacl.secretbox(encodeUTF8(message), nonce, decodeBase64(groupKeyB64));
  return encodeBase64(new Uint8Array([...nonce, ...encrypted]));
}

export function decryptGroup(ciphertextB64: string, groupKeyB64: string): string | null {
  try {
    const data = decodeBase64(ciphertextB64);
    const nonce = data.slice(0, nacl.secretbox.nonceLength);
    const box = data.slice(nacl.secretbox.nonceLength);
    const result = nacl.secretbox.open(box, nonce, decodeBase64(groupKeyB64));
    return result ? decodeUTF8(result) : null;
  } catch {
    return null;
  }
}
