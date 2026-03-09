// utils/encoding-util.ts

export function encodeUrl(url: string): string {
  try {
    // btoa() creates a Base64-encoded ASCII string
    return btoa(url);
  } catch (e) {
    throw new Error("Failed to encode. Ensure you are using valid characters.");
  }
}

export function decodeUrl(encoded: string): string {
  try {
    // atob() decodes a string of data which has been encoded using Base64
    return atob(encoded);
  } catch (e) {
    throw new Error("Invalid encoded string.");
  }
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
