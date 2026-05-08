import { useState, useEffect } from 'react';
import { fetchISS, calculateSpeed, getNews } from './utils/api'; // From past code
import ISSMap from './components/ISSMap';
import SpeedChart from './components/SpeedChart'; // Make sure your SpeedChart component handles white bg
import Chatbot from './components/Chatbot';
import Card from './components/Card';
import { Search } from 'lucide-react'; // npm install lucide-react

export default function App() {
  const [pos, setPos] = useState({ lat: 0, lon: 0 });
  const [path, setPath] = useState([]);
  const [speed, setSpeed] = useState([]);
  const [news, setNews] = useState([]);
  const [isDark, setIsDark] = useState(false);

  // ISS Tracking Logic (unchanged from past)
  useEffect(() => {
    const update = async () => {
      try {
        const { data } = await fetchISS();
        const newPos = { lat: parseFloat(data.iss_position.latitude), lon: parseFloat(data.iss_position.longitude) };
        if (pos.lat !== 0) {
          const s = calculateSpeed(pos, newPos, 15);
          setSpeed(prev => [...prev.slice(-29), parseFloat(s)]);
        }
        setPos(newPos);
        setPath(prev => [...prev.slice(-14), [newPos.lat, newPos.lon]]);
      } catch (err) { console.error("ISS error", err) }
    };
    update();
    const interval = setInterval(update, 15000);
    return () => clearInterval(interval);
  }, [pos]);

  // News Logic (unchanged from past)
  useEffect(() => {
    getNews().then(setNews);
  }, []);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="bg-gray-50 min-h-screen text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        
        {/* Navbar */}
        <nav className="p-4 flex justify-between items-center border-b border-gray-100 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            <h1 className="text-xl font-bold tracking-tighter">ISS MISSION CONTROL</h1>
          </div>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Switch to {isDark ? "Light" : "Dark"}
          </button>
        </nav>
        
        <main className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Tracking Section */}
          <Card title="ISS Live Tracking" className="col-span-full">
            {/* Minimal Stat Panel as seen in image_1.png */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    {label: "Latitude / Longitude", value: `${pos.lat.toFixed(3)}, ${pos.lon.toFixed(3)}`},
                    {label: "Speed", value: `${speed[speed.length-1]?.toFixed(2) || 'Calculating...'} km/h`},
                    {label: "Nearest Place", value: "Over Ocean / Remote"}, // Static placeholder for speed
                    {label: "Tracked Positions", value: path.length}
                ].map(stat => (
                    <div key={stat.label} className="bg-gray-100 p-4 rounded-xl dark:bg-gray-700">
                        <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                        <div className="text-lg font-bold">{stat.value}</div>
                    </div>
                ))}
            </div>
            <ISSMap pos={pos} path={path} />
          </Card>

          {/* Visualization Section */}
          <Card title="ISS Speed Trend (Last 30 Min)">
            <SpeedChart data={speed} />
          </Card>
          
          {/* ... Add News Distribution Pie Chart (Part 4) in another Card here ... */}
          
          {/* News Section (Part 2) */}
          <Card title="Latest News" className="col-span-full">
            <div className="flex items-center border rounded-full px-4 py-2 bg-gray-50 mb-6 dark:bg-gray-700 dark:border-gray-600">
                <Search size={18} className="text-gray-400 mr-2"/>
                <input type="text" placeholder="Search title, source, author..." className="w-full bg-transparent focus:outline-none"/>
            </div>
            <div className="space-y-4">
              {news.map((n, i) => (
                <div key={i} className="flex gap-4 p-4 items-center bg-gray-100 rounded-xl hover:bg-gray-200 transition dark:bg-gray-700 dark:hover:bg-gray-600">
                    <img src={n.urlToImage} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" alt="News"/>
                    <div>
                        <h3 className="font-semibold text-lg leading-snug mb-1">{n.title}</h3>
                        <div className="text-xs text-gray-500 mb-2 uppercase">{n.source.name} | {new Date(n.publishedAt).toLocaleDateString()}</div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2 dark:text-gray-400">{n.description}</p>
                        <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 font-medium hover:underline">Read More</a>
                    </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
        <Chatbot context={{ pos, speed: speed[speed.length-1], newsCount: news.length }} />
      </div>
    </div>
  );
}