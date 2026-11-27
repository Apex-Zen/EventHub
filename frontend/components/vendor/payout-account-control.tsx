"use client";

import { useState, type FormEvent } from "react";

export function PayoutAccountControl() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);

  function saveAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccountOpen(false);
    setAccountSaved(true);
    window.setTimeout(() => setAccountSaved(false), 3500);
  }

  return (
    <>
      <button
        className="outline-button"
        type="button"
        onClick={() => setAccountOpen(true)}
      >
        Payout account
      </button>

      {accountOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAccountOpen(false);
          }}
        >
          <section
            className="account-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-title"
          >
            <button
              className="dialog-close"
              type="button"
              onClick={() => setAccountOpen(false)}
              aria-label="Close dialog"
            >
              ×
            </button>
            <h2 id="account-title">Payout account</h2>
            <p>Manage the bank account used for your vendor payouts.</p>
            <form onSubmit={saveAccount}>
              <label>
                Account holder
                <input name="accountHolder" defaultValue="Kasun Fernando" required />
              </label>
              <label>
                Bank account
                <input name="accountNumber" defaultValue="•••• •••• 2481" required />
              </label>
              <label>
                Bank
                <select name="bank" defaultValue="Commercial Bank">
                  <option>Commercial Bank</option>
                  <option>Bank of Ceylon</option>
                  <option>People&apos;s Bank</option>
                  <option>Other</option>
                </select>
              </label>
              <button className="primary-button" type="submit">
                Save payout account
              </button>
            </form>
          </section>
        </div>
      )}

      {accountSaved && (
        <div className="toast" role="status">
          Payout account updated.
        </div>
      )}
    </>
  );
}
