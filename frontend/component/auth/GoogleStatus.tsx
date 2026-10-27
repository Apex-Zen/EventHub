

export type GoogleStatusProps = {
  actions: {
    goHome: () => void;
    returnToLogin: () => void;
  };
};

export default function GoogleStatus({ actions }: GoogleStatusProps) {
  const { goHome, returnToLogin } = actions;
  return (

    <section className="provider-status" aria-labelledby="provider-title">
      <span className="google-mark" aria-hidden="true">G</span>
      <h2 id="provider-title">Google sign-in isn&apos;t connected yet</h2>
      <p>EventHub is using demo accounts on this device. A Google OAuth client needs to be configured before Google can sign you in.</p>
      <button className="primary-button" type="button" onClick={returnToLogin}>Back to log in</button>
      <button className="provider-back-link" type="button" onClick={goHome}>Return to EventHub home</button>
    </section>
  );
}
