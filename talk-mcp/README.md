# Talk MCP

A Model Context Protocol (MCP) implementation for converting language model responses to speech.

## Project Structure

- **mcp-server**: The MCP server implementation that provides the `speak` tool
- **mock-api**: A simple mock API server for testing the MCP tool
- **web-app**: A Next.js web application that receives text and converts it to speech

## Tool Description

The Talk MCP provides a `speak` tool that allows language models to send text to be converted to speech. The tool is defined with a descriptive schema that helps language models understand its purpose and usage.

When the language model uses this tool, it sends text to the MCP server, which forwards it to the configured API endpoint. This minimalist approach allows for easy testing and validation of the concept.

### Tool Schema

```json
{
  "name": "speak",
  "description": "Convert text to speech by sending it to a text-to-speech API",
  "inputSchema": {
    "type": "object",
    "properties": {
      "text": {
        "type": "string",
        "description": "The text to convert to speech"
      }
    },
    "required": ["text"]
  }
}
```

## Quick Start

### 1. Start the Web App

```bash
cd web-app
npm install
npm run dev
```

This will start the Next.js web app on port 3000, which provides an API endpoint and a web interface for text-to-speech.

### 2. Start the MCP Server

In a new terminal:

```bash
cd mcp-server
cp .env.example .env
# Update the API endpoint in .env to point to the web app
# API_ENDPOINT=http://localhost:3000/api/speak
chmod +x config/run-talk-mcp.sh
./config/run-talk-mcp.sh
```

### 3. Configure Augment Code

Configure the Augment Code extension to use the Talk MCP server.

## Testing

### Testing with the Web App

1. Start the web app and MCP server as described above
2. Open the web app in your browser at http://localhost:3000
3. Use the Augment Code extension with the Talk MCP configured
4. When the language model uses the `speak` tool, the text will be sent to the web app and spoken aloud

### Testing with the Test Script

You can also test the web app directly using the included test script:

```bash
cd web-app
node test-api.js
```

This will send a series of test messages to the API, which will be displayed and spoken in the web interface.

### Testing with the Mock API

If you prefer to use the mock API instead of the web app:

```bash
cd mock-api
npm install
npm start
```

Make sure to update the API endpoint in the MCP server's `.env` file to point to the mock API.

## Features

### MCP Server
- Provides a `speak` tool for language models
- Sends text to a configurable API endpoint
- Simple and lightweight implementation

### Web App
- Receives text via API endpoint
- Converts text to speech using Web Speech API
- Provides voice selection and speech rate controls
- Displays message history
- Allows replaying previous messages

## Next Steps

Future enhancements could include:

- Database integration with Supabase for persistent storage
- Real-time updates using Supabase subscriptions
- User response handling (voice input)
- Support for multiple languages
- Voice customization options
