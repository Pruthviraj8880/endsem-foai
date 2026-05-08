const CHAT_HISTORY_KEY = 'mission-control-chat-history';
const MAX_MESSAGES = 30;

export function getSavedChatHistory() {
  try {
    const savedMessages = JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY));
    return Array.isArray(savedMessages) ? savedMessages : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(messages) {
  // Keep only the newest 30 messages so localStorage stays small.
  const trimmedMessages = messages.slice(-MAX_MESSAGES);
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmedMessages));
  return trimmedMessages;
}

export function clearChatHistory() {
  localStorage.removeItem(CHAT_HISTORY_KEY);
}
