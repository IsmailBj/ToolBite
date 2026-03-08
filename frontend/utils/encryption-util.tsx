// utils/encryption-util.ts

const ITERATIONS = 100000;
const ALGO = "AES-GCM"; // Web Crypto API expects "AES-GCM", not "AES-256-GCM"

/**
 * Encrypts a file using AES-256-GCM
 */
export async function encryptFile(file: File, password: string): Promise<Blob> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const passwordKey = await getPasswordKey(password);
  const aesKey = await deriveKey(passwordKey, salt, ["encrypt"]);

  const fileBuffer = await file.arrayBuffer();
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: ALGO,
      iv: iv,
    },
    aesKey,
    fileBuffer,
  );

  // Structure: [SALT(16 bytes)][IV(12 bytes)][ENCRYPTED_DATA]
  // We prepend the salt and IV so they are available for decryption later
  return new Blob([salt, iv, new Uint8Array(encryptedContent)], {
    type: "application/octet-stream",
  });
}

/**
 * Decrypts a ".locked" file using AES-256-GCM
 */
export async function decryptFile(file: File, password: string): Promise<Blob> {
  const buffer = await file.arrayBuffer();

  // Extract the metadata we prepended during encryption
  const salt = buffer.slice(0, 16);
  const iv = buffer.slice(16, 28);
  const data = buffer.slice(28);

  const passwordKey = await getPasswordKey(password);
  const aesKey = await deriveKey(passwordKey, new Uint8Array(salt), [
    "decrypt",
  ]);

  try {
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: ALGO,
        iv: new Uint8Array(iv),
      },
      aesKey,
      data,
    );
    return new Blob([decryptedContent]);
  } catch (e) {
    // Usually triggered by a wrong password or file tampering
    throw new Error("Invalid password or corrupted file.");
  }
}

/**
 * Converts a plain string password into a CryptoKey for PBKDF2
 */
async function getPasswordKey(password: string) {
  const enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
}

/**
 * Derives an AES-256 key from the PBKDF2 password key
 */
async function deriveKey(
  passwordKey: CryptoKey,
  salt: Uint8Array,
  usage: KeyUsage[],
) {
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    {
      name: ALGO,
      length: 256, // This defines it as AES-256
    },
    false,
    usage,
  );
}
