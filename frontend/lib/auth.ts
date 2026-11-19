export const roles = [
    {
        id: "Client",
        title: "Client",
        description: "Plan your next event",
        icon: "✦",
    },
    {
        id: "Vendor",
        title: "Vendor",
        description: "Grow your event business",
        icon: "◇",
    },
] as const;
export type Role = (typeof roles)[number]["id"];
export type Mode = "signup" | "login";
export type Step = "form" | "verify" | "forgot" | "reset" | "google" | "dashboard";
export type ResetMethod = "email" | "sms";
export type Account = {
    role: Role;
    fullName: string;
    email: string;
    username?: string;
    phoneNumber?: string;
    passwordSalt: string;
    passwordHash: string;
    isVerified: boolean;
    vendorProfile?: {
        phoneNumber: string;
        serviceCategory: string;
        businessRegistrationNumber: string;
    };
};
export const ACCOUNTS_KEY = "eventhub.demo.accounts";
export const RESET_CODE_LIFETIME_MS = 30 * 60 * 1000;
export const vendorCategories = [
    "Photography",
    "Catering",
    "Decoration",
    "Sound and lighting",
    "Venue",
    "Cake",
    "Transport",
    "Other",
];
export function getAccountKey(email: string, role: Role) {
    return `${email.trim().toLowerCase()}::${role}`;
}
export function isValidUsername(username: string) {
    return /^[a-zA-Z0-9._-]{3,24}$/.test(username);
}
const STORAGE_ERROR = "Saved accounts could not be read. Clear this site's saved account data and try again.";
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}
function isAccount(value: unknown): value is Account {
    if (!isRecord(value))
        return false;
    if ((value.role !== "Client" && value.role !== "Vendor") || typeof value.fullName !== "string" || !value.fullName.trim() || typeof value.email !== "string" || !value.email.trim() || typeof value.isVerified !== "boolean")
        return false;
    if (value.username !== undefined && (typeof value.username !== "string" || !isValidUsername(value.username)))
        return false;
    if (value.phoneNumber !== undefined && (typeof value.phoneNumber !== "string" || !value.phoneNumber.trim()))
        return false;
    if (typeof value.passwordSalt !== "string" || !/^[a-f0-9]{32}$/i.test(value.passwordSalt) || typeof value.passwordHash !== "string" || !/^[a-f0-9]{64}$/i.test(value.passwordHash))
        return false;
    if (value.vendorProfile !== undefined || value.role === "Vendor") {
        const profile = value.vendorProfile;
        if (!isRecord(profile) || !["phoneNumber", "serviceCategory", "businessRegistrationNumber"].every(key => typeof profile[key] === "string" && profile[key].trim().length > 0))
            return false;
    }
    return true;
}
export function readAccounts(): Account[] {
    const saved = window.localStorage.getItem(ACCOUNTS_KEY);
    if (saved === null)
        return [];
    let parsed: unknown;
    try {
        parsed = JSON.parse(saved);
    }
    catch {
        throw new Error(STORAGE_ERROR);
    }
    if (!Array.isArray(parsed) || !parsed.every(isAccount))
        throw new Error(STORAGE_ERROR);
    const keys = parsed.map(account => getAccountKey(account.email, account.role));
    if (new Set(keys).size !== keys.length)
        throw new Error(STORAGE_ERROR);
    return parsed;
}
// Serialize read-modify-write operations across tabs. No asynchronous work belongs inside the update callback.
export async function updateAccounts(update: (accounts: Account[]) => Account[]): Promise<void> {
    if (!navigator.locks)
        throw new Error("Safe account storage requires a browser with Web Locks support on localhost or HTTPS.");
    await navigator.locks.request(ACCOUNTS_KEY, () => {
        const accounts = update(readAccounts());
        if (!accounts.every(isAccount))
            throw new Error("Account data is invalid.");
        window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    });
}
export function bytesToHex(bytes: Uint8Array) {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
export function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
    return new Uint8Array(hex.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []);
}
export async function hashPassword(password: string, salt?: Uint8Array<ArrayBuffer>) {
    if (!window.crypto?.subtle) {
        throw new Error("Secure browser cryptography is unavailable. Open this app on localhost or HTTPS.");
    }
    const passwordSalt = salt ?? window.crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const hash = await window.crypto.subtle.deriveBits({
        name: "PBKDF2", salt: passwordSalt, iterations: 100000, hash: "SHA-256"
    }, keyMaterial, 256);
    return {
        salt: bytesToHex(passwordSalt),
        hash: bytesToHex(new Uint8Array(hash)),
    };
}
export function passwordsMatch(first: string, second: string) {
    return first.length >= 8 && /[A-Z]/.test(first) && /[a-z]/.test(first) && /\d/.test(first) && first === second;
}
export function makeResetCode() {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return {
        value: (values[0] % 1_000_000).toString().padStart(6, "0"),
        expiresAt: 0,
        attempts: 0,
    };
}
export function getRoleMessage(role: Role) {
    switch (role) {
        case "Client":
            return "Create an account to get started with event planning.";
        case "Vendor":
            return "Set up an account for your event service business.";
    }
}
export function findAccount(accounts: Account[], email: string, role: Role) {
    return accounts.find(a => getAccountKey(a.email, a.role) === getAccountKey(email, role));
}
export function validateIdentityDocument(file: File): string | null {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "pdf"].includes(extension ?? ""))
        return "Upload your ID as a JPG, PNG, or PDF file.";
    if (file.size > 5 * 1024 * 1024)
        return "Your ID document must be 5 MB or smaller.";
    return null;
}
