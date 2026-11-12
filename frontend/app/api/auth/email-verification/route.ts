import { sendVerification, verifyEmailCode, VerificationError } from "../../../../lib/server/email-verification";



function response(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin) return response({ error: "Request origin is not allowed." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return response({ error: "Expected JSON." }, 415);
  try {
    const raw = await request.text();
    if (raw.length > 2048) return response({ error: "Request is too large." }, 413);
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== "object") return response({ error: "Invalid verification request." }, 400);
    const { action, email, role, challengeId, code } = body as Record<string, unknown>;
    if (typeof email !== "string" || email.length > 254 || !/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(email) || (role !== "Client" && role !== "Vendor")) {
      return response({ error: "A valid email and account role are required." }, 400);
    }
    const normalizedEmail = email.trim().toLowerCase();
    // Configure the deployment proxy to overwrite this header; localhost uses one shared bucket.
    const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 128) || "local";
    if (action === "send") return response(await sendVerification(normalizedEmail, role, client));
    if (action === "verify" && typeof challengeId === "string" && /^[a-f0-9]{64}$/.test(challengeId) && typeof code === "string" && /^\d{6}$/.test(code)) {
      return response(verifyEmailCode(challengeId, code, normalizedEmail, role, client));
    }
    return response({ error: "Invalid verification request." }, 400);
  } catch (error) {
    if (error instanceof VerificationError) return response({ error: error.message }, error.status);
    if (error instanceof SyntaxError) return response({ error: "Invalid JSON." }, 400);
    return response({ error: "Email verification is temporarily unavailable. Please try again." }, 500);
  }
}

