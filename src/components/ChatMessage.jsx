function ChatMessage({ message }) {
  return (
    <div className={`chat-message-row ${message.sender === 'user' ? 'user-row' : 'ai-row'}`}>
      <div className={`chat-bubble ${message.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
        <p>{message.text}</p>
        <span>{message.time}</span>
      </div>
    </div>
  );
}

export default ChatMessage;
