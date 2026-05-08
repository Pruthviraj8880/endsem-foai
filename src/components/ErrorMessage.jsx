function ErrorMessage({ message, onRetry }) {
  return (
    <section className="error-card">
      <div>
        <h2>Telemetry Error</h2>
        <p>{message}</p>
      </div>
      <button className="primary-button" onClick={onRetry}>
        Retry
      </button>
    </section>
  );
}

export default ErrorMessage;
