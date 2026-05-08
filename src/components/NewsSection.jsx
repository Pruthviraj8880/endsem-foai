import { useCallback, useEffect, useMemo, useState } from 'react';
import { showErrorToast, showSuccessToast } from './ToastMessage.jsx';
import NewsSearch from './NewsSearch.jsx';
import NewsSort from './NewsSort.jsx';
import NewsCard from './NewsCard.jsx';
import NewsLoader from './NewsLoader.jsx';
import NewsError from './NewsError.jsx';
import LoadMoreButton from './LoadMoreButton.jsx';
import { getNewsArticles } from '../services/newsService.js';

function NewsSection({ onArticlesChange }) {
  const [articles, setArticles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNews = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError('');

      const latestArticles = await getNewsArticles('space OR technology', forceRefresh);

      setArticles(latestArticles);
      onArticlesChange(latestArticles);
      setVisibleCount(5);

      if (forceRefresh) showSuccessToast('News refreshed successfully');
    } catch {
      setError('Unable to fetch latest news.');
      showErrorToast('News API fetch failed');
    } finally {
      setLoading(false);
    }
  }, [onArticlesChange]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    // Debounce prevents a new search on every single key press.
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 350);

    return () => clearTimeout(timerId);
  }, [searchText]);

  useEffect(() => {
    if (debouncedSearch) {
      showSuccessToast('Search updated');
    }
  }, [debouncedSearch]);

  const filteredArticles = useMemo(() => {
    const keyword = debouncedSearch.toLowerCase().trim();

    const matchingArticles = articles.filter((article) => {
      if (!keyword) return true;

      return [article.title, article.source, article.author, article.description]
        .join(' ')
        .toLowerCase()
        .includes(keyword);
    });

    return [...matchingArticles].sort((a, b) => {
      if (sortBy === 'source') {
        return a.source.localeCompare(b.source);
      }

      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });
  }, [articles, debouncedSearch, sortBy]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  return (
    <section className="panel news-section" id="news-dashboard">
      <div className="panel-header news-header">
        <div>
          <p className="eyebrow">Part 2: News dashboard</p>
          <h2>Mission News Feed</h2>
          <p className="section-description">
            Latest space and technology articles, cached for 15 minutes to reduce extra API calls.
          </p>
        </div>

        <button className="primary-button" onClick={() => loadNews(true)} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh News'}
        </button>
      </div>

      <div className="news-controls">
        <NewsSearch value={searchText} onChange={setSearchText} />
        <NewsSort value={sortBy} onChange={setSortBy} />
      </div>

      {loading && <NewsLoader />}

      {!loading && error && <NewsError message={error} onRetry={() => loadNews(true)} />}

      {!loading && !error && visibleArticles.length === 0 && (
        <div className="news-error">
          <p>No matching articles found.</p>
        </div>
      )}

      {!loading && !error && visibleArticles.length > 0 && (
        <>
          <p className="news-count">
            Showing {visibleArticles.length} of {filteredArticles.length} articles
          </p>

          <div className="news-grid">
            {visibleArticles.map((article) => (
              <NewsCard article={article} key={article.id} />
            ))}
          </div>

          <LoadMoreButton
            hidden={visibleCount >= filteredArticles.length}
            onClick={() => setVisibleCount((currentCount) => currentCount + 5)}
          />
        </>
      )}
    </section>
  );
}

export default NewsSection;
