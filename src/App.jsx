import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar.jsx';
import ISSMap from './components/ISSMap.jsx';
import ISSInfoCards from './components/ISSInfoCards.jsx';
import SpeedChart from './components/SpeedChart.jsx';
import Astronauts from './components/Astronauts.jsx';
import Loader from './components/Loader.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import RefreshControls from './components/RefreshControls.jsx';
import NewsSection from './components/NewsSection.jsx';
import ChatbotButton from './components/ChatbotButton.jsx';
import ChatbotWindow from './components/ChatbotWindow.jsx';
import { showErrorToast, showSuccessToast } from './components/ToastMessage.jsx';
import { getISSLocation } from './services/issService.js';
import { getAstronauts } from './services/astronautService.js';
import { getLocationName } from './services/reverseGeoService.js';
import calculateSpeed from './utils/calculateSpeed.js';
import formatTime from './utils/formatTime.js';
import './styles/dashboard.css';
import './styles/themes.css';
import './styles/responsive.css';
import './styles/news.css';
import './styles/chatbot.css';

const REFRESH_TIME = 15000;

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('iss-theme') || 'dark');
  const [issPosition, setIssPosition] = useState(null);
  const [locationName, setLocationName] = useState('Finding location...');
  const [positions, setPositions] = useState([]);
  const [speedReadings, setSpeedReadings] = useState([]);
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [astronautLoading, setAstronautLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    document.body.className = `${theme}-theme`;
    localStorage.setItem('iss-theme', theme);
  }, [theme]);

  async function fetchISSData(showToast = false) {
    try {
      setError('');

      // 1. Fetch the newest ISS latitude, longitude, and timestamp.
      const newPosition = await getISSLocation();

      // 2. Use the previous position to calculate speed.
      // If there is no previous position yet, we use a realistic ISS orbit speed.
      setPositions((oldPositions) => {
        const previousPosition = oldPositions[oldPositions.length - 1];
        const timeDiffSeconds = previousPosition
          ? Math.max((newPosition.timestamp - previousPosition.timestamp) / 1000, 1)
          : 15;
        const newSpeed = previousPosition
          ? calculateSpeed(previousPosition, newPosition, timeDiffSeconds)
          : 27600;

        setIssPosition({ ...newPosition, speed: newSpeed });
        setSpeedReadings((oldReadings) =>
          [
            ...oldReadings,
            {
              time: formatTime(newPosition.timestamp),
              speed: Math.round(newSpeed)
            }
          ].slice(-30)
        );

        // 3. Keep only the last 15 positions for the map path.
        return [...oldPositions, { ...newPosition, speed: newSpeed }].slice(-15);
      });

      setLastUpdated(new Date());
      setLoading(false);
      if (showToast) showSuccessToast('ISS data refreshed successfully');

      // Reverse geocoding is separate so the dashboard still works if it fails.
      const placeName = await getLocationName(newPosition.lat, newPosition.lng);
      setLocationName(placeName);
    } catch {
      setLoading(false);
      setError('Unable to fetch ISS data. Please try again.');
      showErrorToast('Unable to fetch ISS data');
    }
  }

  async function fetchAstronauts() {
    try {
      setAstronautLoading(true);
      const people = await getAstronauts();
      setAstronauts(people);
    } catch {
      showErrorToast('Unable to fetch astronaut data');
    } finally {
      setAstronautLoading(false);
    }
  }

  useEffect(() => {
    fetchISSData();
    fetchAstronauts();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return undefined;

    // This interval runs every 15 seconds while auto refresh is enabled.
    const intervalId = setInterval(() => {
      fetchISSData();
    }, REFRESH_TIME);

    // Cleanup stops duplicate intervals when the component updates.
    return () => clearInterval(intervalId);
  }, [autoRefresh]);

  function handleThemeChange() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showSuccessToast(`${nextTheme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
  }

  function handleAutoRefreshChange() {
    setAutoRefresh((currentValue) => {
      const nextValue = !currentValue;
      showSuccessToast(`Auto-refresh ${nextValue ? 'enabled' : 'disabled'}`);
      return nextValue;
    });
  }

  return (
    <div className="dashboard-app">
      <Navbar theme={theme} onThemeChange={handleThemeChange} />

      <main className="dashboard-container">
        <section className="hero-card">
          <div>
            <p className="eyebrow">NASA-style mission control</p>
            <h1>ISS Mission Control Dashboard</h1>
            <p>
              Track the International Space Station, monitor live speed, view the orbital path,
              and see the people currently working in space.
            </p>
          </div>
          <RefreshControls
            autoRefresh={autoRefresh}
            onAutoRefreshChange={handleAutoRefreshChange}
            onRefresh={() => fetchISSData(true)}
            lastUpdated={lastUpdated}
          />
        </section>

        {loading && <Loader message="Connecting to ISS telemetry..." />}

        {error && <ErrorMessage message={error} onRetry={() => fetchISSData(true)} />}

        {issPosition && (
          <>
            <ISSInfoCards
              position={issPosition}
              locationName={locationName}
              trackedCount={positions.length}
            />

            <section className="main-grid">
              <ISSMap position={issPosition} positions={positions} />
              <SpeedChart data={speedReadings} />
            </section>
          </>
        )}

        <Astronauts astronauts={astronauts} loading={astronautLoading} />

        <NewsSection onArticlesChange={setNewsArticles} />
      </main>

      <ChatbotButton isOpen={chatOpen} onClick={() => setChatOpen((currentValue) => !currentValue)} />

      {chatOpen && (
        <ChatbotWindow
          dashboardData={{
            issPosition,
            locationName,
            astronauts,
            newsArticles
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={2600} theme={theme} />
    </div>
  );
}

export default App;
