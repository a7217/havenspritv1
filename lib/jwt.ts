const ALGORITHM = { name: "HMAC", hash: "SHA-256" };
const TOKEN_EXPIRY_MS = 8 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || "change-this-secret-in-production";
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret).buffer as ArrayBuffer,
    ALGORITHM,
    false,
    ["sign", "verify"]
  );
}

function b64url(buf: ArrayBuffer | ArrayBufferLike): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf as ArrayBuffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function decodeB64url(s: string): ArrayBuffer {
  const padded = s
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(s.length + (4 - (s.length % 4)) % 4, "=");
  const arr = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return arr.buffer.slice(0) as ArrayBuffer;
}

export async function signAdminToken(): Promise<string> {
  const payload = JSON.stringify({
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + TOKEN_EXPIRY_MS,
  });
  const encodedPayload = b64url(new TextEncoder().encode(payload).buffer as ArrayBuffer);
  const key = await importKey(getSecret());
  const sig = await crypto.subtle.sign(
    ALGORITHM.name,
    key,
    new TextEncoder().encode(encodedPayload).buffer as ArrayBuffer
  );
  return `${encodedPayload}.${b64url(sig)}`;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [encodedPayload, encodedSig] = parts;
    const key = await importKey(getSecret());
    const valid = await crypto.subtle.verify(
      ALGORITHM.name,
      key,
      decodeB64url(encodedSig),
      new TextEncoder().encode(encodedPayload).buffer as ArrayBuffer
    );
    if (!valid) return false;
    const payload = JSON.parse(
      new TextDecoder().decode(decodeB64url(encodedPayload))
    );
    return (
      payload.role === "admin" &&
      typeof payload.exp === "number" &&
      Date.now() < payload.exp
    );
  } catch {
    return false;
  }
}
