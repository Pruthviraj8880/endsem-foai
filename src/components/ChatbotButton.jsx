function ChatbotButton({ onClick, isOpen }) {
  return (
    <button className="chatbot-button" onClick={onClick} aria-label="Open mission control AI chat">
      {isOpen ? '×' : 'AI'}
    </button>
  );
}

export default ChatbotButton;
