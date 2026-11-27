"use client";

import { useState, type FormEvent } from "react";
import {
  detectCardBrand,
  validatePayment,
  type PaymentField,
  type PaymentFieldErrors,
} from "@/lib/payment-validation";
import { checkoutDepositAmount, formatLkr } from "@/lib/payment-data";
import { TextField } from "@/components/ui/text-field";

export type PaymentSubmission = {
  cardBrand: string;
  cardEnding: string;
  simulateDecline: boolean;
};

type PaymentFormProps = {
  amount?: number;
  isProcessing: boolean;
  onCancel: () => void;
  onSubmit: (payment: PaymentSubmission) => void;
};

export function PaymentForm({
  amount = checkoutDepositAmount,
  isProcessing,
  onCancel,
  onSubmit,
}: PaymentFormProps) {
  const [fieldErrors, setFieldErrors] = useState<PaymentFieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isProcessing) return;

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const cardNumber = String(formData.get("cardNumber") ?? "");
    const digits = cardNumber.replace(/\D/g, "");
    const errors = validatePayment({
      cardNumber,
      expiry: String(formData.get("expiry") ?? ""),
      cvv: String(formData.get("cvv") ?? ""),
      cardholder: String(formData.get("cardholder") ?? ""),
    });

    setFieldErrors(errors);
    const invalidField = (
      ["cardNumber", "expiry", "cvv", "cardholder"] as const
    ).find((field) => errors[field]);
    if (invalidField) {
      const element = formElement.elements.namedItem(invalidField);
      if (element instanceof HTMLInputElement) element.focus();
      return;
    }

    onSubmit({
      cardBrand: detectCardBrand(digits),
      cardEnding: digits.slice(-4),
      simulateDecline: digits === "4000000000000002",
    });
  }

  function clearFieldError(field: PaymentField) {
    setFieldErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  return (
    <section className="payment-card" aria-labelledby="payment-title">
      <div className="payment-heading">
        <h1 id="payment-title">Card payment</h1>
        <svg
          className="lock-icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect x="4.5" y="10" width="15" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </div>

      <p className="payment-intro">
        Secured by the payment gateway&nbsp; · &nbsp;EventHub never stores card
        numbers or CVV
      </p>

      <div className="merchant-summary">
        <div>
          <span>Merchant</span>
          <strong>EventHub (Pvt) Ltd</strong>
        </div>
        <div>
          <span>Amount</span>
          <strong className="amount">{formatLkr(amount)}</strong>
        </div>
      </div>

      <form className="payment-form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Card number"
          name="cardNumber"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 5678 9012 3456"
          maxLength={23}
          readOnly={isProcessing}
          error={fieldErrors.cardNumber}
          hint="Use a 13–19 digit card number."
          onChange={() => clearFieldError("cardNumber")}
        />

        <div className="field-row">
          <TextField
            label="Expiry"
            name="expiry"
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM / YY"
            maxLength={7}
            readOnly={isProcessing}
            error={fieldErrors.expiry}
            onChange={() => clearFieldError("expiry")}
          />
          <TextField
            label="CVV"
            name="cvv"
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="3 digits"
            maxLength={4}
            readOnly={isProcessing}
            error={fieldErrors.cvv}
            onChange={() => clearFieldError("cvv")}
          />
        </div>

        <TextField
          label="Name on card"
          name="cardholder"
          type="text"
          autoComplete="cc-name"
          placeholder="As printed on the card"
          maxLength={100}
          readOnly={isProcessing}
          error={fieldErrors.cardholder}
          onChange={() => clearFieldError("cardholder")}
        />

        <button className="pay-button" type="submit" disabled={isProcessing}>
          {isProcessing
            ? "Authorizing..."
            : `Pay ${formatLkr(amount)}`}
        </button>
      </form>

      <button className="cancel-link" type="button" onClick={onCancel}>
        Cancel and go back to EventHub
      </button>
    </section>
  );
}
