import { NextResponse } from 'next/server';
import { addMessage, getUnsentMessages, markMessagesAsSent } from '../../../../lib/messageStore';

// Route for web app to send user messages
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

    // Add message from user (type: 'user')
    const message = addMessage({
      text,
      role: 'user',
      sent: false
    });

    return NextResponse.json({
      success: true,
      message: 'User message received',
      messageId: message.id,
    });
  } catch (error) {
    console.error('Error processing user speak request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Route for web app to get all user messages (for display purposes)
export async function GET(request: Request) {
  // Get the URL parameters
  const { searchParams } = new URL(request.url);
  const getAll = searchParams.get('all') === 'true';
  
  // Get user messages (role: 'user')
  const userMessages = getUnsentMessages('user', getAll);
  
  // If not getting all, mark these messages as sent
  if (!getAll) {
    markMessagesAsSent(userMessages);
  }
  
  // Return the user messages
  return NextResponse.json({ messages: userMessages });
}
