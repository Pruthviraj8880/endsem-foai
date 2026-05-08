const NEWS_CACHE_KEY = 'mission-control-news-cache';
const CACHE_TIME = 15 * 60 * 1000;
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80';

const FALLBACK_NEWS = [
  {
    id: 'fallback-space-missions',
    title: 'Space teams continue monitoring orbital research missions',
    source: 'Mission News',
    author: 'Space Desk',
    publishedAt: new Date().toISOString(),
    description:
      'Mission teams are tracking spacecraft operations, orbital science tasks, and Earth observation work.',
    image: FALLBACK_IMAGE,
    url: 'https://www.nasa.gov/international-space-station/'
  },
  {
    id: 'fallback-technology-tools',
    title: 'Technology researchers study new tools for space operations',
    source: 'Tech Orbit',
    author: 'Research Staff',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    description:
      'New software tools are helping teams understand telemetry, crew operations, and mission timing.',
    image: FALLBACK_IMAGE,
    url: 'https://www.nasa.gov/'
  }
];

function formatArticle(article, index) {
  return {
    id: article.url || `${article.title}-${index}`,
    title: article.title || 'Untitled article',
    source: article.source?.name || 'Unknown source',
    author: article.author || 'Unknown author',
    publishedAt: article.publishedAt || new Date().toISOString(),
    description: article.description || 'No description is available for this article.',
    image: article.urlToImage || FALLBACK_IMAGE,
    url: article.url || '#'
  };
}

function readCache() {
  try {
    const cachedData = JSON.parse(localStorage.getItem(NEWS_CACHE_KEY));
    if (!cachedData) return null;

    // Cache is valid for 15 minutes. After that, fresh news is fetched.
    const cacheAge = Date.now() - cachedData.timestamp;
    if (cacheAge > CACHE_TIME) {
      localStorage.removeItem(NEWS_CACHE_KEY);
      return null;
    }

    return cachedData.articles.map((article, index) => ({
      ...article,
      id: article.id || article.url || `cached-news-${index}`
    }));
  } catch {
    localStorage.removeItem(NEWS_CACHE_KEY);
    return null;
  }
}

function saveCache(articles) {
  localStorage.setItem(
    NEWS_CACHE_KEY,
    JSON.stringify({
      articles,
      timestamp: Date.now()
    })
  );
}

export async function getNewsArticles(query = 'space OR technology', forceRefresh = false) {
  if (!forceRefresh) {
    const cachedArticles = readCache();
    if (cachedArticles) return cachedArticles;
  }

  const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;

  if (!newsApiKey || newsApiKey === 'your_news_api_key_here') {
    saveCache(FALLBACK_NEWS);
    return FALLBACK_NEWS;
  }

  const url = new URL(NEWS_API_URL);
  url.searchParams.set('q', query || 'space OR technology');
  url.searchParams.set('sortBy', 'publishedAt');
  url.searchParams.set('language', 'en');
  url.searchParams.set('pageSize', '10');
  url.searchParams.set('apiKey', newsApiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Unable to fetch latest news.');
  }

  const data = await response.json();
  const articles = (data.articles || []).slice(0, 10).map(formatArticle);

  saveCache(articles);
  return articles;
}
