import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const HF_TOKEN = import.meta.env.VITE_AI_TOKEN;

export const fetchISS = () => axios.get('http://api.open-notify.org/iss-now.json');

export const fetchNews = async () => {
  const cached = localStorage.getItem('news_data');
  const expiry = localStorage.getItem('news_expiry');
  if (cached && expiry && Date.now() < expiry) return JSON.parse(cached);

  const res = await axios.get(`https://newsapi.org/v2/top-headlines?category=technology&apiKey=${NEWS_API_KEY}`);
  localStorage.setItem('news_data', JSON.stringify(res.data.articles.slice(0, 10)));
  localStorage.setItem('news_expiry', Date.now() + 15 * 60 * 1000);
  return res.data.articles.slice(0, 10);
};

export const chatWithAI = async (prompt, context) => {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    { inputs: `Context: ${context}\n\nUser: ${prompt}\n\nAssistant (Answer ONLY using context):` },
    { headers: { Authorization: `Bearer ${HF_TOKEN}` } }
  );
  return response.data[0].generated_text.split("Assistant:")[1] || response.data[0].generated_text;
};

// Haversine for Speed
export const calculateSpeed = (p1, p2, timeDiffSeconds) => {
  const R = 6371; 
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLon = (p2.lon - p1.lon) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return (distance / (timeDiffSeconds / 3600)).toFixed(2);
};