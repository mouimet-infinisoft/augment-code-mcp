import { NextResponse } from 'next/server';
import { getUnsentMessages, markMessagesAsSent } from '../../../../lib/messageStore';

// Route for MCP tool to get unsent user messages
export async function GET(request: Request) {
  // Get the URL parameters
  const { searchParams } = new URL(request.url);
  const getAll = searchParams.get('all') === 'true';
  
  // Get unsent messages from users (role: 'user')
  const unsentMessages = getUnsentMessages('user', getAll);
  
  // If not getting all, mark these messages as sent
  if (!getAll) {
    markMessagesAsSent(unsentMessages);
  }
  
  // Return the user messages
  return NextResponse.json({ messages: unsentMessages });
}
