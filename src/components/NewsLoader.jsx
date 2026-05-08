function NewsLoader() {
  return (
    <div className="news-grid">
      {[1, 2, 3].map((item) => (
        <div className="news-skeleton" key={item}>
          <div className="skeleton-image" />
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      ))}
    </div>
  );
}

export default NewsLoader;
