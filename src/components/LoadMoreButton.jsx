function LoadMoreButton({ onClick, hidden }) {
  if (hidden) return null;

  return (
    <div className="load-more-row">
      <button className="primary-button" onClick={onClick}>
        Load More Articles
      </button>
    </div>
  );
}

export default LoadMoreButton;
