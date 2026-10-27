"use client";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Role, Mode, Step, ResetMethod, Account, VerificationCode, RESET_CODE_LIFETIME_MS, MAX_CODE_ATTEMPTS, getAccountKey, readAccounts, updateAccounts, hexToBytes, hashPassword, passwordsMatch, makeVerificationCode, findAccount, validateIdentityDocument } from "../lib/auth";
export function useAuthFlow() {
    const operation = useRef(0);
    const pending = useRef(false);
    useEffect(() => () => {
        operation.current += 1;
        pending.current = false;
    }, []);
    const [showLanding, setShowLanding] = useState(true);
    const [mode, setMode] = useState<Mode>("signup");
    const [step, setStep] = useState<Step>("form");
    const [role, setRole] = useState<Role>("Client");
    const [fullName, setFullName] = useState("");
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
    const [verificationInput, setVerificationInput] = useState("");
    const [verificationCode, setVerificationCode] = useState<VerificationCode | null>(null);
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
        setPassword("");
        setConfirmPassword("");
        setResetPassword("");
        setConfirmResetPassword("");
        setVerificationInput("");
        setVerificationCode(null);
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
    function createVerification(account: Account, message: string) {
        setPassword("");
        setConfirmPassword("");
        setVerificationCode(makeVerificationCode());
        setVerificationInput("");
        setEmail(account.email);
        setRole(account.role);
        setStep("verify");
        setNotice(message);
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
                if (role === "Client" && !fullName.trim())
                    throw new Error("Enter your full name.");
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
                    if (!acceptedVendorTerms) {
                        throw new Error("Accept the Vendor Terms and payout commission to create your account.");
                    }
                    if (identityDocument) {
                        const documentError = validateIdentityDocument(identityDocument);
                        if (documentError)
                            throw new Error(documentError);
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
                    return [...current, account];
                });
                if (operation.current !== operationId)
                    return;
                setIdentityDocument(null);
                setNicNumber("");
                createVerification(account, "Your verification code is ready below.");
                return;
            }
            const account = findAccount(accounts, email, role);
            if (!account) {
                throw new Error("No account found for this email and role. Check your details or create an account.");
            }
            const passwordHash = await hashPassword(password, hexToBytes(account.passwordSalt));
            if (operation.current !== operationId)
                return;
            if (passwordHash.hash !== account.passwordHash) {
                throw new Error("The email, role, or password is incorrect.");
            }
            if (!account.isVerified) {
                createVerification(account, "Verify your email before signing in. A new code is ready below.");
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
                    return item.email.toLowerCase() === normalizedIdentifier;
                const accountPhone = item.vendorProfile?.phoneNumber.replace(/\D/g, "");
                return accountPhone !== undefined && accountPhone === normalizedIdentifier.replace(/\D/g, "");
            });
            const account = matches.find((item) => item.role === role);
            if (!account) {
                throw new Error("No matching account was found for this role and contact. Check the details or sign in instead.");
            }
            const generatedCode = makeVerificationCode();
            generatedCode.expiresAt = Date.now() + RESET_CODE_LIFETIME_MS;
            setResetTarget(account.email);
            setRole(account.role);
            setResetCode(generatedCode.value);
            setResetExpiresAt(generatedCode.expiresAt);
            setResetCodeInput("");
            setResetPassword("");
            setConfirmResetPassword("");
            setStep("reset");
            setNotice(resetMethod === "email"
                ? "Demo mode: no email was sent. Use the reset code shown below to continue."
                : "Demo mode: no SMS was sent. Use the reset code shown below to continue.");
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
    function handleResendCode() {
        resetMessages();
        setVerificationCode(makeVerificationCode());
        setVerificationInput("");
        setNotice("A new verification code is ready below. Previous codes are no longer valid.");
    }
    async function handleVerify(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        resetMessages();
        if (!verificationCode) {
            setError("Request a new verification code to continue.");
            return;
        }
        if (Date.now() > verificationCode.expiresAt) {
            setVerificationCode(null);
            setError("This code has expired. Request a new one to continue.");
            return;
        }
        if (verificationCode.attempts >= MAX_CODE_ATTEMPTS) {
            setVerificationCode(null);
            setError("Too many incorrect attempts. Request a new code to continue.");
            return;
        }
        if (verificationInput.trim() !== verificationCode.value) {
            const attempts = verificationCode.attempts + 1;
            setVerificationCode(attempts >= MAX_CODE_ATTEMPTS ? null : { ...verificationCode, attempts });
            setError(attempts >= MAX_CODE_ATTEMPTS
                ? "Too many incorrect attempts. Request a new code to continue."
                : `That code doesn't match. ${MAX_CODE_ATTEMPTS - attempts} attempts remaining.`);
            return;
        }
        const operationId = startOperation();
        if (operationId === null)
            return;
        try {
            let verifiedAccount: Account | undefined;
            await updateAccounts(accounts => {
                if (operation.current !== operationId)
                    return accounts;
                const account = findAccount(accounts, email, role);
                if (!account)
                    throw new Error("The account could not be found. Sign in again.");
                verifiedAccount = { ...account, isVerified: true };
                return accounts.map(item => getAccountKey(item.email, item.role) === getAccountKey(email, role) ? verifiedAccount! : item);
            });
            if (operation.current === operationId && verifiedAccount)
                completeSignIn(verifiedAccount);
        }
        catch (cause) {
            if (operation.current === operationId)
                setError(cause instanceof Error ? cause.message : "Verification failed. Please try again.");
        }
        finally {
            finishOperation(operationId);
        }
    }
    function switchMode(nextMode: Mode) {
        leaveFlow();
        setMode(nextMode);
        setStep("form");
        setVerificationCode(null);
        setVerificationInput("");
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
        setVerificationCode(null);
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
                mode, role, fullName, email, acceptedVendorTerms, password, confirmPassword, rememberEmail, error, notice, busy
            }, actions: {
                openForgotPassword, setFullName, setEmail, setAcceptedVendorTerms, setPassword, setConfirmPassword, setRememberEmail, changeRole, openGoogle, handleSubmit, switchMode
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
                role, email, verificationInput, verificationCode, error, notice, busy
            }, actions: {
                setVerificationInput, returnToLogin, handleVerify, handleResendCode
            } },
        vendorFields: { values: {
                firstName, lastName, email, phoneNumber, serviceCategory, businessRegistrationNumber, nicNumber, identityDocument
            }, actions: {
                setFirstName, setLastName, setEmail, setPhoneNumber, setServiceCategory, setBusinessRegistrationNumber, setNicNumber, setIdentityDocument, setError, resetMessages
            } },
    };
}
