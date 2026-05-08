import { useState, useEffect } from 'react';
import { fetchISS, fetchNews, calculateSpeed } from './utils/api';
import ISSMap from './components/ISSMap';
import SpeedChart from './components/SpeedChart';
import Chatbot from './components/Chatbot';

export default function App() {
  const [pos, setPos] = useState({ lat: 0, lon: 0 });
  const [path, setPath] = useState([]);
  const [speed, setSpeed] = useState([]);
  const [news, setNews] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = async () => {
      const { data } = await fetchISS();
      const newPos = { lat: parseFloat(data.iss_position.latitude), lon: parseFloat(data.iss_position.longitude) };
      
      if (pos.lat !== 0) {
        const s = calculateSpeed(pos, newPos, 15);
        setSpeed(prev => [...prev.slice(-29), s]);
      }
      
      setPos(newPos);
      setPath(prev => [...prev.slice(-14), [newPos.lat, newPos.lon]]);
    };

    update();
    const interval = setInterval(update, 15000);
    fetchNews().then(setNews);
    return () => clearInterval(interval);
  }, [pos]);

  return (
    <div className={isDark ? 'bg-gray-900 text-white min-h-screen' : 'bg-gray-100 min-h-screen'}>
      <nav className="p-4 flex justify-between shadow">
        <h1 className="text-xl font-bold">ISS Mission Control</h1>
        <button onClick={() => setIsDark(!isDark)}>Toggle Mode</button>
      </nav>
      
      <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow text-black"><ISSMap pos={pos} path={path} /></div>
        <div className="bg-white p-4 rounded shadow text-black"><SpeedChart data={speed} /></div>
        
        <section className="col-span-full">
          <h2 className="text-2xl mb-4">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.map((n, i) => (
              <div key={i} className="p-4 bg-white rounded shadow text-black">
                <img src={n.urlToImage} className="w-full h-32 object-cover" />
                <h3 className="font-bold">{n.title}</h3>
                <a href={n.url} target="_blank" className="text-blue-500">Read More</a>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Chatbot context={{ pos, speed: speed[speed.length-1], newsCount: news.length }} />
    </div>
  );
}