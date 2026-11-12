

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
      <h2 id="provider-title">Google sign-in isn&apos;t set up yet</h2>
      <p>Google accounts aren&apos;t connected to EventHub yet. Continue with your email and password instead.</p>
      <button className="primary-button" type="button" onClick={returnToLogin}>Back to log in</button>
      <button className="provider-back-link" type="button" onClick={goHome}>Return to EventHub home</button>
    </section>
  );
}
