"use client";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { requestEmailVerification, submitEmailVerification } from "../lib/email-verification";
import { Role, Mode, Step, ResetMethod, Account, RESET_CODE_LIFETIME_MS, getAccountKey, readAccounts, updateAccounts, hexToBytes, hashPassword, passwordsMatch, makeResetCode, findAccount, validateIdentityDocument, isValidUsername } from "../lib/auth";
export function useAuthFlow() {
    const operation = useRef(0);
    const pending = useRef(false);
    const verification = useRef<{ id: string; email: string; role: Role; passwordHash: string; passwordSalt: string } | null>(null);
    useEffect(() => () => {
        operation.current += 1;
        pending.current = false;
    }, []);
    const [showLanding, setShowLanding] = useState(true);
    const [mode, setMode] = useState<Mode>("signup");
    const [step, setStep] = useState<Step>("form");
    const [role, setRole] = useState<Role>("Client");
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [serviceCategory, setServiceCategory] = useState("");
    const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
    const [nicNumber, setNicNumber] = useState("");
    const [identityDocument, setIdentityDocument] = useState<File | null>(null);
    const [acceptedVendorTerms, setAcceptedVendorTerms] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetMethod, setResetMethod] = useState<ResetMethod>("email");
    const [resetIdentifier, setResetIdentifier] = useState("");
    const [resetTarget, setResetTarget] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [resetCodeInput, setResetCodeInput] = useState("");
    const [resetExpiresAt, setResetExpiresAt] = useState(0);
    const [resetPassword, setResetPassword] = useState("");
    const [confirmResetPassword, setConfirmResetPassword] = useState("");
    const [rememberEmail, setRememberEmail] = useState(false);
    const [activeAccount, setActiveAccount] = useState<Account | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [busy, setBusy] = useState(false);
    function resetMessages() {
        setError("");
        setNotice("");
    }
    function clearSensitiveFields() {
        verification.current = null;
        setPassword("");
        setConfirmPassword("");
        setResetPassword("");
        setConfirmResetPassword("");
        setResetCode("");
        setResetCodeInput("");
        setResetExpiresAt(0);
        setResetTarget("");
        setIdentityDocument(null);
        setNicNumber("");
        setAcceptedVendorTerms(false);
    }
    function leaveFlow() {
        operation.current += 1;
        pending.current = false;
        setBusy(false);
        clearSensitiveFields();
        resetMessages();
    }
    function startOperation() {
        if (pending.current)
            return null;
        pending.current = true;
        setBusy(true);
        resetMessages();
        return ++operation.current;
    }
    function finishOperation(id: number) {
        if (operation.current === id) {
            pending.current = false;
            setBusy(false);
        }
    }
    function completeSignIn(account: Account) {
        if (rememberEmail)
            window.localStorage.setItem("eventhub.demo.remembered-email", account.email);
        else
            window.localStorage.removeItem("eventhub.demo.remembered-email");
        clearSensitiveFields();
        setRole(account.role);
        setActiveAccount(account);
        setStep("dashboard");
    }
    function changeRole(nextRole: Role) {
        leaveFlow();
        setRole(nextRole);
    }
    function openGoogle() {
        leaveFlow();
        setStep("google");
    }
    function changeResetMethod(method: ResetMethod) {
        resetMessages();
        setResetMethod(method);
        setResetIdentifier("");
    }
    function requestAnotherCode() {
        leaveFlow();
        setResetIdentifier(email);
        setStep("forgot");
    }
    async function showVerificationStatus(account: Account, operationId: number) {
        const challengeId = await requestEmailVerification(account.email, account.role);
        if (operation.current !== operationId) return;
        verification.current = { id: challengeId, email: account.email, role: account.role, passwordHash: account.passwordHash, passwordSalt: account.passwordSalt };
        setPassword("");
        setConfirmPassword("");
        setEmail(account.email);
        setRole(account.role);
        setStep("verify");
    }
    async function verifyEmail(code: string) {
        const challenge = verification.current;
        const operationId = startOperation();
        if (operationId === null) return;
        try {
            if (!challenge) throw new Error("Sign in again to request a new verification code.");
            if (!/^\d{6}$/.test(code)) throw new Error("Enter the six-digit verification code.");
            await submitEmailVerification(challenge.id, code, challenge.email, challenge.role);
            if (operation.current !== operationId) return;
            let verifiedAccount: Account | undefined;
            await updateAccounts(accounts => {
                if (operation.current !== operationId) return accounts;
                const account = findAccount(accounts, challenge.email, challenge.role);
                if (!account || account.passwordHash !== challenge.passwordHash || account.passwordSalt !== challenge.passwordSalt) throw new Error("Your account changed. Please sign in again.");
                verifiedAccount = { ...account, isVerified: true };
                return accounts.map(item => getAccountKey(item.email, item.role) === getAccountKey(challenge.email, challenge.role) ? verifiedAccount! : item);
            });
            if (operation.current === operationId && verifiedAccount) completeSignIn(verifiedAccount);
        } catch (cause) {
            if (operation.current === operationId) setError(cause instanceof Error ? cause.message : "Verification failed. Please try again.");
        } finally { finishOperation(operationId); }
    }
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const operationId = startOperation();
        if (operationId === null)
            return;
        try {
            const accounts = readAccounts();
            const accountKey = getAccountKey(email, role);
            if (mode === "signup") {
                const normalizedUsername = username.trim();
                if (!isValidUsername(normalizedUsername)) {
                    throw new Error("Choose a username with 3–24 letters, numbers, periods, underscores, or hyphens.");
                }
                if (accounts.some((account) => account.username?.toLowerCase() === normalizedUsername.toLowerCase())) {
                    throw new Error("That username is already in use. Choose another.");
                }
                if (role === "Client" && !fullName.trim())
                    throw new Error("Enter your full name.");
                if (role === "Client" && !phoneNumber.trim())
                    throw new Error("Enter your phone number.");
                if (role === "Vendor") {
                    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
                        throw new Error("Complete your name and phone number to continue.");
                    }
                    if (!serviceCategory) {
                        throw new Error("Choose a service category to continue.");
                    }
                    if (!businessRegistrationNumber.trim()) {
                        throw new Error("Enter your Business Registration Number (BRN).");
                    }
                    if (!nicNumber.trim() && !identityDocument) {
                        throw new Error("Enter your NIC number or upload your NIC or passport.");
                    }
                    if (identityDocument) {
                        const documentError = validateIdentityDocument(identityDocument);
                        if (documentError)
                            throw new Error(documentError);
                    }
                    if (!acceptedVendorTerms) {
                        throw new Error("Accept the Vendor Terms and 5–10% payout commission to continue.");
                    }
                }
                if (!passwordsMatch(password, confirmPassword)) {
                    throw new Error("Use at least 8 characters with an uppercase letter, a lowercase letter, and a number. Both password fields must match.");
                }
                if (accounts.some((account) => getAccountKey(account.email, account.role) === accountKey)) {
                    throw new Error("An account with this email already exists for this role. Sign in instead.");
                }
                const { salt, hash } = await hashPassword(password);
                if (operation.current !== operationId)
                    return;
                const account: Account = {
                    role,
                    fullName: role === "Vendor" ? `${firstName.trim()} ${lastName.trim()}` : fullName.trim(),
                    email: email.trim().toLowerCase(),
                    username: normalizedUsername,
                    ...(role === "Client" && { phoneNumber: phoneNumber.trim() }),
                    passwordSalt: salt,
                    passwordHash: hash,
                    isVerified: false,
                    ...(role === "Vendor" && {
                        vendorProfile: {
                            phoneNumber: phoneNumber.trim(),
                            serviceCategory,
                            businessRegistrationNumber: businessRegistrationNumber.trim(),
                        },
                    }),
                };
                await updateAccounts(current => {
                    if (operation.current !== operationId)
                        return current;
                    if (findAccount(current, email, role))
                        throw new Error("An account with this email already exists for this role. Sign in instead.");
                    if (current.some((item) => item.username?.toLowerCase() === normalizedUsername.toLowerCase()))
                        throw new Error("That username is already in use. Choose another.");
                    return [...current, account];
                });
                if (operation.current !== operationId)
                    return;
                setIdentityDocument(null);
                setNicNumber("");
                setMode("login");
                await showVerificationStatus(account, operationId);
                return;
            }
            const identifier = email.trim().toLowerCase();
            const matchingAccounts = accounts.filter((item) =>
                item.email.toLowerCase() === identifier || item.username?.toLowerCase() === identifier
            );
            if (matchingAccounts.length === 0) {
                throw new Error("No account found for this email. Check your details or create an account.");
            }
            const matchingPasswords: Account[] = [];
            for (const candidate of matchingAccounts) {
                const passwordHash = await hashPassword(password, hexToBytes(candidate.passwordSalt));
                if (operation.current !== operationId)
                    return;
                if (passwordHash.hash === candidate.passwordHash)
                    matchingPasswords.push(candidate);
            }
            if (matchingPasswords.length === 0)
                throw new Error("The email or password is incorrect.");
            if (matchingPasswords.length > 1)
                throw new Error("More than one account matches these details. Sign in with your unique username.");
            const [candidate] = matchingPasswords;
            const account = findAccount(readAccounts(), candidate.email, candidate.role);
            if (!account || account.passwordSalt !== candidate.passwordSalt || account.passwordHash !== candidate.passwordHash)
                throw new Error("Your account credentials changed. Please sign in again.");
            setRole(account.role);
            if (!account.isVerified) {
                await showVerificationStatus(account, operationId);
                return;
            }
            completeSignIn(account);
        }
        catch (cause) {
            if (operation.current === operationId)
                setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
        }
        finally {
            finishOperation(operationId);
        }
    }
    function openForgotPassword() {
        leaveFlow();
        setResetIdentifier(email);
        setResetMethod("email");
        setResetCode("");
        setResetCodeInput("");
        setStep("forgot");
        resetMessages();
    }
    function returnToLogin() {
        leaveFlow();
        setStep("form");
        setMode("login");
        setResetCode("");
        setResetCodeInput("");
        resetMessages();
    }
    function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        resetMessages();
        try {
            const accounts = readAccounts();
            const normalizedIdentifier = resetIdentifier.trim().toLowerCase();
            const matches = accounts.filter((item) => {
                if (resetMethod === "email")
                    return item.email.toLowerCase() === normalizedIdentifier || item.username?.toLowerCase() === normalizedIdentifier;
                const accountPhone = (item.phoneNumber ?? item.vendorProfile?.phoneNumber)?.replace(/\D/g, "");
                return accountPhone !== undefined && accountPhone === normalizedIdentifier.replace(/\D/g, "");
            });
            if (matches.length === 0)
                throw new Error("No matching account was found for this contact. Check the details or sign in instead.");
            if (matches.length > 1)
                throw new Error("More than one account uses this contact. Enter your unique username in the Email field, or use a phone number unique to the account.");
            const [account] = matches;
            const generatedCode = makeResetCode();
            generatedCode.expiresAt = Date.now() + RESET_CODE_LIFETIME_MS;
            setResetTarget(account.email);
            setRole(account.role);
            setResetCode(generatedCode.value);
            setResetExpiresAt(generatedCode.expiresAt);
            setResetCodeInput("");
            setResetPassword("");
            setConfirmResetPassword("");
            setStep("reset");
            setNotice("Delivery is unavailable. Use the reset code shown below to continue.");
        }
        catch (cause) {
            setError(cause instanceof Error ? cause.message : "Could not start password reset. Please try again.");
        }
    }
    async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        resetMessages();
        if (!resetCode || resetCodeInput.trim() !== resetCode) {
            setError("Enter the reset code shown above.");
            return;
        }
        if (Date.now() > resetExpiresAt) {
            setResetCode("");
            setError("This reset code has expired. Request a new one to continue.");
            return;
        }
        if (!passwordsMatch(resetPassword, confirmResetPassword)) {
            setError("Use at least 8 characters with an uppercase letter, a lowercase letter, and a number. Both password fields must match.");
            return;
        }
        const operationId = startOperation();
        if (operationId === null)
            return;
        try {
            const accounts = readAccounts();
            const accountIndex = accounts.findIndex((item) => item.email === resetTarget && item.role === role);
            if (accountIndex < 0) {
                throw new Error("The account for this reset request could not be found. Start again from Forgot password.");
            }
            const { salt, hash } = await hashPassword(resetPassword);
            if (operation.current !== operationId)
                return;
            await updateAccounts(current => {
                if (operation.current !== operationId)
                    return current;
                const latest = findAccount(current, resetTarget, role);
                if (!latest || latest.passwordHash !== accounts[accountIndex].passwordHash)
                    throw new Error("The account changed. Request another reset code.");
                return current.map(item => getAccountKey(item.email, item.role) === getAccountKey(resetTarget, role) ? { ...item, passwordSalt: salt, passwordHash: hash } : item);
            });
            if (operation.current !== operationId)
                return;
            clearSensitiveFields();
            setEmail(resetTarget);
            setPassword("");
            setConfirmPassword("");
            setResetCode("");
            setResetCodeInput("");
            setStep("form");
            setMode("login");
            setNotice("Password updated on this device. Sign in with your new password.");
        }
        catch (cause) {
            if (operation.current === operationId)
                setError(cause instanceof Error ? cause.message : "Could not reset the password. Please try again.");
        }
        finally {
            finishOperation(operationId);
        }
    }
    function switchMode(nextMode: Mode) {
        leaveFlow();
        setMode(nextMode);
        setStep("form");
        resetMessages();
    }
    function signOut() {
        leaveFlow();
        setActiveAccount(null);
        setStep("form");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        resetMessages();
    }
    function goHome() {
        leaveFlow();
        setActiveAccount(null);
        setStep("form");
        setShowLanding(true);
        resetMessages();
    }
    function openAuth(nextMode: Mode, nextRole?: Role) {
        leaveFlow();
        setMode(nextMode);
        setStep("form");
        setShowLanding(false);
        if (nextRole) {
            setRole(nextRole);
        }
        if (nextMode === "login") {
            const savedEmail = window.localStorage.getItem("eventhub.demo.remembered-email") ?? "";
            setEmail(savedEmail);
            setRememberEmail(Boolean(savedEmail));
        }
        resetMessages();
    }
    return {
        showLanding, mode, step, role, activeAccount, switchMode, signOut, goHome, openAuth, returnToLogin,
        accountForm: { values: {
                mode, role, fullName, username, email, phoneNumber, acceptedVendorTerms, password, confirmPassword, rememberEmail, error, notice, busy
            }, actions: {
                openForgotPassword, setFullName, setUsername, setEmail, setPhoneNumber, setAcceptedVendorTerms, setPassword, setConfirmPassword, setRememberEmail, changeRole, openGoogle, handleSubmit, switchMode
            } },
        forgotPasswordForm: { values: { resetMethod, resetIdentifier, error }, actions: {
                setResetIdentifier, changeResetMethod, returnToLogin, handleForgotPassword
            } },
        resetPasswordForm: { values: {
                resetTarget, resetCode, resetCodeInput, resetPassword, confirmResetPassword, error, notice, busy
            }, actions: {
                setResetCodeInput, setResetPassword, setConfirmResetPassword, requestAnotherCode, handleResetPassword
            } },
        verifyEmailForm: { values: {
                role, email, error, busy
            }, actions: {
                returnToLogin, verifyEmail
            } },
        vendorFields: { values: {
                firstName, lastName, email, phoneNumber, serviceCategory, businessRegistrationNumber, nicNumber, identityDocument
            }, actions: {
                setFirstName, setLastName, setEmail, setPhoneNumber, setServiceCategory, setBusinessRegistrationNumber, setNicNumber, setIdentityDocument, setError, resetMessages
            } },
    };
}
