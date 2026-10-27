import { createHash, randomInt, randomBytes, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import type { Role } from "../auth";

const LIFETIME_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ENTRIES = 10_000;
type Challenge = {
  email: string;
  role: Role;
  hash: Buffer;
  expiresAt: number;
  attempts: number;
};
type Rate = { count: number; expiresAt: number };
// This store is for the current single-server application. Replicas must share a store.
const shared = globalThis as typeof globalThis & {
  eventHubVerification?: { challenges: Map<string, Challenge>; rates: Map<string, Rate> };
};
const store = shared.eventHubVerification ??= { challenges: new Map(), rates: new Map() };

export class VerificationError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

function cleanup() {
  const now = Date.now();
  for (const [key, value] of store.challenges) if (value.expiresAt <= now) store.challenges.delete(key);
  for (const [key, value] of store.rates) if (value.expiresAt <= now) store.rates.delete(key);
}
function limit(key: string, maximum: number) {
  const rate = store.rates.get(key);
  if (rate && rate.count >= maximum) throw new VerificationError("Too many requests. Try again later.", 429);
  if (rate) rate.count += 1;
  else {
    if (store.rates.size >= MAX_ENTRIES) throw new VerificationError("Verification is busy. Try again later.", 503);
    store.rates.set(key, { count: 1, expiresAt: Date.now() + WINDOW_MS });
  }
}
function digest(id: string, code: string) {
  return createHash("sha256").update(id + ":" + code).digest();
}
function smtpSettings() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
  const port = Number(SMTP_PORT || 587);
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new VerificationError("Email delivery is not configured. Add the SMTP settings to the server environment.", 503);
  }
  return { host: SMTP_HOST, port, user: SMTP_USER, password: SMTP_PASSWORD, from: SMTP_FROM };
}

export async function sendVerification(email: string, role: Role, client: string) {
  const settings = smtpSettings();
  cleanup();
  limit("send:client:" + client, 10);
  limit("send:email:" + email, 5);
  if (store.challenges.size >= MAX_ENTRIES) throw new VerificationError("Verification is busy. Try again later.", 503);
  const challengeId = randomBytes(32).toString("hex");
  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const transport = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.port === 465,
    requireTLS: settings.port !== 465,
    auth: { user: settings.user, pass: settings.password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    const result = await transport.sendMail({
      from: settings.from,
      to: { address: email, name: "" },
      subject: "Your EventHub verification code",
      text: "Your EventHub verification code is " + code + ". It expires in 10 minutes. If you did not request this code, ignore this email.",
    });
    if (!result.accepted?.length || result.rejected?.length) throw new Error("Recipient rejected");
  } catch {
    throw new VerificationError("The verification email could not be sent. Please try signing in again.", 502);
  } finally {
    transport.close();
  }
  store.challenges.set(challengeId, {
    email, role, hash: digest(challengeId, code), expiresAt: Date.now() + LIFETIME_MS, attempts: 0,
  });
  return { challengeId };
}

export function verifyEmailCode(challengeId: string, code: string, email: string, role: Role, client: string) {
  cleanup();
  limit("verify:client:" + client, 60);
  const challenge = store.challenges.get(challengeId);
  if (!challenge || challenge.email !== email || challenge.role !== role) {
    throw new VerificationError("This verification request has expired. Sign in again to request a new code.");
  }
  challenge.attempts += 1;
  if (!timingSafeEqual(challenge.hash, digest(challengeId, code))) {
    if (challenge.attempts >= MAX_ATTEMPTS) {
      store.challenges.delete(challengeId);
      throw new VerificationError("Too many incorrect attempts. Sign in again to request a new code.", 429);
    }
    throw new VerificationError("The verification code is incorrect. Please try again.");
  }
  store.challenges.delete(challengeId);
  return { email: challenge.email, role: challenge.role };
}
