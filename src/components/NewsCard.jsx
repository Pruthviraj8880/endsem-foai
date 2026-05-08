function NewsCard({ article }) {
  return (
    <article className="news-card">
      <img src={article.image} alt="" className="news-image" loading="lazy" />

      <div className="news-card-body">
        <div className="news-meta">
          <span>{article.source}</span>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>

        <h3>{article.title}</h3>
        <p className="news-author">By {article.author}</p>
        <p className="news-description">{article.description}</p>

        <a href={article.url} target="_blank" rel="noreferrer" className="read-more-button">
          Read More
        </a>
      </div>
    </article>
  );
}

export default NewsCard;
