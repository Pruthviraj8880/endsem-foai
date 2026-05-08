import { useEffect, useRef, useState } from 'react';
import { showErrorToast, showSuccessToast } from './ToastMessage.jsx';
import ChatMessage from './ChatMessage.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import ChatInput from './ChatInput.jsx';
import ClearChatButton from './ClearChatButton.jsx';
import { askDashboardAI } from '../services/chatbotService.js';
import { clearChatHistory, getSavedChatHistory, saveChatHistory } from '../utils/saveChatHistory.js';

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function ChatbotWindow({ dashboardData }) {
  const [messages, setMessages] = useState(() => {
    const savedMessages = getSavedChatHistory();

    if (savedMessages.length > 0) return savedMessages;

    return [
      {
        sender: 'ai',
        text: 'Ask me about the ISS location, ISS speed, astronauts, or the current news dashboard.',
        time: getCurrentTime()
      }
    ];
  });
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    saveChatHistory(messages);
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  async function handleSend(userText) {
    const userMessage = {
      sender: 'user',
      text: userText,
      time: getCurrentTime()
    };

    setMessages((oldMessages) => saveChatHistory([...oldMessages, userMessage]));
    setLoading(true);
    showSuccessToast('Message sent');

    try {
      const aiText = await askDashboardAI(userText, dashboardData);

      const aiMessage = {
        sender: 'ai',
        text: aiText,
        time: getCurrentTime()
      };

      setMessages((oldMessages) => saveChatHistory([...oldMessages, aiMessage]));
    } catch {
      showErrorToast('AI service temporarily unavailable');

      setMessages((oldMessages) =>
        saveChatHistory([
          ...oldMessages,
          {
            sender: 'ai',
            text: 'AI service temporarily unavailable. Please try again.',
            time: getCurrentTime()
          }
        ])
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClearChat() {
    clearChatHistory();
    setMessages([
      {
        sender: 'ai',
        text: 'Chat cleared. I can answer using only the current ISS and news dashboard data.',
        time: getCurrentTime()
      }
    ]);
    showSuccessToast('Chat cleared');
  }

  return (
    <aside className="chatbot-window">
      <header className="chatbot-header">
        <div>
          <p className="eyebrow">Part 3: AI chatbot</p>
          <h2>Mission AI Assistant</h2>
        </div>
        <ClearChatButton onClear={handleClearChat} />
      </header>

      <div className="chat-messages" ref={messagesRef}>
        {messages.map((message, index) => (
          <ChatMessage message={message} key={`${message.sender}-${message.time}-${index}`} />
        ))}
        {loading && <TypingIndicator />}
      </div>

      <ChatInput onSend={handleSend} disabled={loading} />
    </aside>
  );
}

export default ChatbotWindow;
