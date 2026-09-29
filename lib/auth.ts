import { cookies } from "next/headers";
import { query } from "@/lib/db";

const COOKIE = "folio_session";
const encoder = new TextEncoder();
const b64url = (bytes: Uint8Array) => Buffer.from(bytes).toString("base64url");

async function hmacKey(usages: KeyUsage[]) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 24) throw new Error("AUTH_SECRET must be at least 24 characters");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, usages);
}
async function hmac(data: string) {
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", await hmacKey(["sign"]), encoder.encode(data))));
}
async function validHmac(data: string, signature: string) {
  try { return crypto.subtle.verify("HMAC", await hmacKey(["verify"]), Buffer.from(signature, "base64url"), encoder.encode(data)); } catch { return false; }
}
export async function hashPassword(password: string, salt = b64url(crypto.getRandomValues(new Uint8Array(16)))) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: Buffer.from(salt, "base64url"), iterations: 210_000 }, key, 256);
  return `pbkdf2:210000:${salt}:${b64url(new Uint8Array(bits))}`;
}
export async function verifyPassword(password: string, stored: string) {
  const [, , salt] = stored.split(":");
  const candidate = await hashPassword(password, salt);
  const a = encoder.encode(candidate), b = encoder.encode(stored);
  if (a.length !== b.length) return false;
  let mismatch = 0; for (let i = 0; i < a.length; i++) mismatch |= a[i] ^ b[i];
  return mismatch === 0;
}
export async function createSession(userId: string) {
  const payload = b64url(encoder.encode(JSON.stringify({ sub: userId, exp: Date.now() + 30 * 864e5 })));
  const token = `${payload}.${await hmac(payload)}`;
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 30 * 86400 });
}
export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function sessionUserId() {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return null;
    const [payload, signature] = token.split(".");
    if (!payload || !signature || !(await validHmac(payload, signature))) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { sub: string; exp: number };
    return data.exp > Date.now() ? data.sub : null;
  } catch { return null; }
}
export type User = { id: string; email: string; username: string; name: string; bio: string; avatar_url: string | null };
export async function getUser(): Promise<User | null> {
  const id = await sessionUserId(); if (!id) return null;
  const [user] = await query<User>("SELECT id,email,username,name,bio,avatar_url FROM users WHERE id=$1", [id]);
  return user ?? null;
}
