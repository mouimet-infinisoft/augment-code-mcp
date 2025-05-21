import { NextResponse } from 'next/server';

// In-memory storage for messages (in a real app, you'd use a database like Supabase)
interface Message {
  id: string;
  text: string;
  timestamp: string;
  sent: boolean; // Track if the message has been sent to the client
}

let messages: Message[] = [];

// Generate a unique ID for messages
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Create a new message
    const message: Message = {
      id: generateId(),
      text,
      timestamp: new Date().toISOString(),
      sent: false // New messages are not sent yet
    };

    // Add to in-memory storage
    messages.push(message);

    return NextResponse.json({
      success: true,
      message: 'stop and wait for response',
      messageId: message.id,
    });
  } catch (error) {
    console.error('Error processing speak request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Get the URL parameters
  const { searchParams } = new URL(request.url);
  const getAll = searchParams.get('all') === 'true';

  if (getAll) {
    // Return all messages if requested
    return NextResponse.json({ messages });
  }

  // Filter for unsent messages
  const unsentMessages = messages.filter(msg => !msg.sent);

  // Mark these messages as sent
  unsentMessages.forEach(msg => {
    msg.sent = true;
  });

  // Return only the unsent messages
  return NextResponse.json({ messages: unsentMessages });
}
