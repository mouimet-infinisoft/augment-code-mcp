import { NextResponse } from 'next/server';
import { addMessage, getUnsentMessages, markMessagesAsSent } from '@/lib/messageStore';

// Route for MCP tool to send messages to be spoken
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

    // Add message from MCP tool (type: 'assistant')
    const message = addMessage({
      text,
      role: 'assistant',
      sent: false
    });

    return NextResponse.json({
      success: true,
      message: 'Message received and will be spoken',
      messageId: message.id,
    });
  } catch (error) {
    console.error('Error processing MCP speak request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Route for web app to get unsent messages from MCP tool
export async function GET(request: Request) {
  // Get the URL parameters
  const { searchParams } = new URL(request.url);
  const getAll = searchParams.get('all') === 'true';
  const role = searchParams.get('role') || 'assistant';
  
  if (getAll) {
    // Return all messages if requested (for debugging)
    const allMessages = getUnsentMessages(role, true);
    return NextResponse.json({ messages: allMessages });
  }
  
  // Get unsent messages from MCP tool (role: 'assistant')
  const unsentMessages = getUnsentMessages(role);
  
  // Mark these messages as sent
  markMessagesAsSent(unsentMessages);
  
  // Return only the unsent messages
  return NextResponse.json({ messages: unsentMessages });
}
