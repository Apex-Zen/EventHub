export type PaymentField = "cardNumber" | "expiry" | "cvv" | "cardholder";
export type PaymentFieldErrors = Partial<Record<PaymentField, string>>;

export type PaymentFormValues = {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholder: string;
};

export function validatePayment(values: PaymentFormValues): PaymentFieldErrors {
  const errors: PaymentFieldErrors = {};
  const digits = values.cardNumber.replace(/\D/g, "");

  if (!isValidCardNumber(digits)) {
    errors.cardNumber = "Enter a valid card number.";
  }
  if (!isValidExpiry(values.expiry)) {
    errors.expiry = "Enter a valid, unexpired date (MM / YY).";
  }
  if (!/^\d{3,4}$/.test(values.cvv.trim())) {
    errors.cvv = "Enter the 3 or 4 digit security code.";
  }
  const trimmedName = values.cardholder.trim();
  if (trimmedName.length < 2 || !/\p{L}/u.test(trimmedName)) {
    errors.cardholder = "Enter the name shown on your card.";
  }

  return errors;
}

export function detectCardBrand(digits: string) {
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "American Express";
  if (/^6(?:011|5)/.test(digits)) return "Discover";
  return "Card";
}

function isValidCardNumber(value: string) {
  if (value.length < 13 || value.length > 19 || /^0+$/.test(value)) {
    return false;
  }

  let sum = 0;
  let doubleDigit = false;
  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
}

function isValidExpiry(value: string) {
  const match = value.trim().match(/^(0?[1-9]|1[0-2])\s*\/\s*(\d{2}|\d{4})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const yearValue = Number(match[2]);
  const year = match[2].length === 2 ? 2000 + yearValue : yearValue;
  const now = new Date();
  return (
    year > now.getFullYear() ||
    (year === now.getFullYear() && month >= now.getMonth() + 1)
  );
}
