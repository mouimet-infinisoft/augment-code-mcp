// In-memory message store (in a real app, you'd use a database like Supabase)

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  role: 'user' | 'assistant';
  sent: boolean; // Track if the message has been sent to the client
}

// In-memory storage for messages
let messages: Message[] = [];

// Generate a unique ID for messages
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Add a new message to the store
export function addMessage(messageData: {
  text: string;
  role: 'user' | 'assistant';
  sent: boolean;
}): Message {
  const message: Message = {
    id: generateId(),
    text: messageData.text,
    timestamp: new Date().toISOString(),
    role: messageData.role,
    sent: messageData.sent
  };

  // Add to in-memory storage
  messages.push(message);

  // Keep only the last 100 messages
  if (messages.length > 100) {
    messages = messages.slice(-100);
  }

  return message;
}

// Get all messages
export function getAllMessages(): Message[] {
  return [...messages];
}

// Get messages by role
export function getMessagesByRole(role: 'user' | 'assistant'): Message[] {
  return messages.filter(msg => msg.role === role);
}

// Get unsent messages
export function getUnsentMessages(role: 'user' | 'assistant', includeAll: boolean = false): Message[] {
  if (includeAll) {
    return messages.filter(msg => msg.role === role);
  }
  return messages.filter(msg => msg.role === role && !msg.sent);
}

// Mark messages as sent
export function markMessagesAsSent(messagesToMark: Message[]): void {
  const ids = messagesToMark.map(msg => msg.id);
  
  messages = messages.map(msg => {
    if (ids.includes(msg.id)) {
      return { ...msg, sent: true };
    }
    return msg;
  });
}

// Clear all messages (for testing)
export function clearMessages(): void {
  messages = [];
}
