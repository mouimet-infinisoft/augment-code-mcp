# Talk MCP Web App

A Next.js web application that receives text from the Talk MCP tool and converts it to speech using the Web Speech API.

## Features

- **API Endpoint**: Receives text from the MCP tool via POST requests
- **Text-to-Speech**: Converts received text to speech using the Web Speech API
- **Voice Selection**: Choose from available system voices
- **Speech Rate Control**: Adjust the speed of speech
- **Message History**: View and replay previous messages

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Usage

### Send Text to be Spoken

```bash
curl -X POST http://localhost:3000/api/speak \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, this is a test message"}'
```

### Get Message History

```bash
curl http://localhost:3000/api/speak
```

## Testing

A test script is included to send sample messages to the API:

```bash
node test-api.js
```

## Integration with Talk MCP

This web app is designed to work with the Talk MCP tool. When the MCP tool receives text from a language model, it sends it to this web app's API, which then converts it to speech.

## Future Enhancements

- Database integration with Supabase for persistent storage
- Real-time updates using Supabase subscriptions
- User authentication
- Voice customization options
- Support for multiple languages

## Built With

- [Next.js](https://nextjs.org/) - The React framework
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - For text-to-speech functionality
- [Tailwind CSS](https://tailwindcss.com/) - For styling
