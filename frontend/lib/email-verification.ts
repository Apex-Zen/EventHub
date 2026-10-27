import type { Role } from "./auth";

async function request(body: object) {
  let response: Response;
  try {
    response = await fetch("/api/auth/email-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Email verification could not connect. Please try again.");
  }
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data && typeof data === "object" && "error" in data && typeof data.error === "string" ? data.error : "Email verification failed. Please try again.");
  }
  if (!data || typeof data !== "object") throw new Error("Invalid verification response. Please try again.");
  return data as Record<string, unknown>;
}
export async function requestEmailVerification(email: string, role: Role): Promise<string> {
  const data = await request({ action: "send", email, role });
  if (typeof data.challengeId !== "string" || !/^[a-f0-9]{64}$/.test(data.challengeId)) throw new Error("Invalid verification response. Please try again.");
  return data.challengeId;
}
export async function submitEmailVerification(challengeId: string, code: string, email: string, role: Role) {
  const data = await request({ action: "verify", challengeId, code, email, role });
  if (data.email !== email || data.role !== role) throw new Error("The verification response does not match this account.");
}
