function NewsError({ message, onRetry }) {
  return (
    <div className="news-error">
      <p>{message}</p>
      <button className="primary-button" onClick={onRetry}>
        Retry News
      </button>
    </div>
  );
}

export default NewsError;
