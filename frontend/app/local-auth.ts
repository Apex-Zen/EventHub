export type AccountType = "Client" | "Vendor";

export type LocalProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountType: AccountType;
  serviceCategory: string;
};

export type LocalAccount = {
  id: string;
  profile: LocalProfile;
  salt: string;
  passwordHash: string;
  verified: boolean;
  createdAt: string;
};

const accountsKey = "eventhub.demo.accounts";
const sessionKey = "eventhub.demo.session";
const passwordIterations = 150_000;

export class LocalAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalAuthError";
  }
}

function isLocalAccount(value: unknown): value is LocalAccount {
  if (!value || typeof value !== "object") return false;
  const account = value as Partial<LocalAccount>;
  const profile = account.profile;

  return (
    typeof account.id === "string" &&
    typeof account.salt === "string" &&
    typeof account.passwordHash === "string" &&
    typeof account.verified === "boolean" &&
    typeof account.createdAt === "string" &&
    Boolean(profile) &&
    typeof profile?.firstName === "string" &&
    typeof profile.lastName === "string" &&
    typeof profile.email === "string" &&
    typeof profile.phone === "string" &&
    (profile.accountType === "Client" || profile.accountType === "Vendor") &&
    typeof profile.serviceCategory === "string"
  );
}

function readAccounts(): LocalAccount[] {
  const storedAccounts = window.localStorage.getItem(accountsKey);
  if (!storedAccounts) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedAccounts);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new LocalAuthError("Saved demo accounts are unreadable. Clear this browser’s EventHub demo data to continue.");
    }
    throw error;
  }

  if (!Array.isArray(parsed) || !parsed.every(isLocalAccount)) {
    throw new LocalAuthError("Saved demo accounts have an invalid format. Clear this browser’s EventHub demo data to continue.");
  }

  return parsed;
}

function writeAccounts(accounts: LocalAccount[]) {
  window.localStorage.setItem(accountsKey, JSON.stringify(accounts));
}

function toBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return window.btoa(binary);
}

function fromBase64(value: string) {
  const binary = window.atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function hashPassword(password: string, salt?: string) {
  const saltBytes = salt ? fromBase64(salt) : window.crypto.getRandomValues(new Uint8Array(16));
  const key = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derivedBits = await window.crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: saltBytes, iterations: passwordIterations },
    key,
    256,
  );

  return {
    salt: toBase64(saltBytes),
    passwordHash: toBase64(new Uint8Array(derivedBits)),
  };
}

export function createDemoCode() {
  const randomNumber = window.crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return randomNumber.toString().padStart(6, "0");
}

export async function prepareLocalAccount(profile: LocalProfile, password: string) {
  const accounts = readAccounts();
  if (accounts.some((account) => account.profile.email.toLowerCase() === profile.email.toLowerCase())) {
    throw new LocalAuthError("An account with this email already exists in this browser. Log in instead.");
  }

  const credentials = await hashPassword(password);
  return {
    account: {
      id: window.crypto.randomUUID(),
      profile: { ...profile, email: profile.email.trim().toLowerCase() },
      ...credentials,
      verified: false,
      createdAt: new Date().toISOString(),
    } satisfies LocalAccount,
    code: createDemoCode(),
  };
}

export function activateLocalAccount(account: LocalAccount) {
  const accounts = readAccounts();
  if (accounts.some((savedAccount) => savedAccount.profile.email === account.profile.email)) {
    throw new LocalAuthError("An account with this email already exists in this browser. Log in instead.");
  }

  const verifiedAccount = { ...account, verified: true };
  writeAccounts([...accounts, verifiedAccount]);
  return verifiedAccount;
}

export async function authenticateLocalAccount(email: string, password: string) {
  const account = readAccounts().find(
    (savedAccount) => savedAccount.profile.email === email.trim().toLowerCase(),
  );

  if (!account) {
    throw new LocalAuthError("Email or password is incorrect.");
  }
  if (!account.verified) {
    throw new LocalAuthError("Verify this account before logging in.");
  }

  const candidate = await hashPassword(password, account.salt);
  if (candidate.passwordHash !== account.passwordHash) {
    throw new LocalAuthError("Email or password is incorrect.");
  }

  return account;
}

export function findLocalAccount(email: string) {
  return readAccounts().find(
    (account) => account.profile.email === email.trim().toLowerCase(),
  ) ?? null;
}

export async function changeLocalPassword(accountId: string, password: string) {
  const accounts = readAccounts();
  const accountIndex = accounts.findIndex((savedAccount) => savedAccount.id === accountId);
  if (accountIndex === -1) {
    throw new LocalAuthError("This local account is no longer available. Start password recovery again.");
  }

  const credentials = await hashPassword(password);
  const updatedAccount = { ...accounts[accountIndex], ...credentials };
  accounts[accountIndex] = updatedAccount;
  writeAccounts(accounts);
  return updatedAccount;
}

export function readLocalSession() {
  const accountId = window.sessionStorage.getItem(sessionKey);
  if (!accountId) return null;
  return readAccounts().find((account) => account.id === accountId && account.verified) ?? null;
}

export function startLocalSession(account: LocalAccount) {
  window.sessionStorage.setItem(sessionKey, account.id);
}

export function endLocalSession() {
  window.sessionStorage.removeItem(sessionKey);
}
