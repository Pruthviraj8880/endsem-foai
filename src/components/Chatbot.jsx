import { useState } from 'react';
import { chatWithAI } from '../utils/api';

export default function Chatbot({ context }) {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  const handleSend = async () => {
    const res = await chatWithAI(msg, JSON.stringify(context));
    setChat([...chat, { u: msg, a: res }]);
    setMsg("");
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-xl p-4 rounded-lg border">
      <div className="h-64 overflow-y-auto mb-2 text-sm">
        {chat.map((c, i) => <div key={i}><b>You:</b> {c.u}<br/><b>AI:</b> {c.a}</div>)}
      </div>
      <input value={msg} onChange={e => setMsg(e.target.value)} className="border w-full p-1" />
      <button onClick={handleSend} className="bg-blue-500 text-white w-full mt-2">Ask AI</button>
    </div>
  );
}