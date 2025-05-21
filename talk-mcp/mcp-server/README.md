# Talk MCP

A Model Context Protocol (MCP) server for converting text to speech. This package enables AI assistants to send text to a speech API through the MCP standard.

## Features

- **Simple Text-to-Speech Integration**: Send text from AI responses to a speech API
- **MCP Standard**: Compatible with the Model Context Protocol for AI tools
- **Configurable API Endpoint**: Can be configured to use any text-to-speech API

## Quick Start

1. Copy `.env.example` to `.env` and configure your API endpoint:
   ```bash
   cp .env.example .env
   ```

2. Make the run script executable:
   ```bash
   chmod +x config/run-talk-mcp.sh
   ```

3. Run the MCP server:
   ```bash
   ./config/run-talk-mcp.sh
   ```

## Configuration

### Environment Variables

Create a `.env` file in your project root with these options:

```
# API endpoint to send text for speech conversion
API_ENDPOINT=http://localhost:3000/api/speak
```

## API Reference

### MCP Tool: `speak`

This MCP server provides a single tool for sending text to be spoken:

**Tool Name:** `speak`
**Description:** Convert text to speech by sending it to a text-to-speech API

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "The text to convert to speech"
    }
  },
  "required": ["text"]
}
```

**Response:**
```json
{
  "status": "sent",
  "apiResponse": "Response from the API"
}
```

When the language model uses this tool, it will understand that it can send text to be converted to speech. The tool will forward this text to the configured API endpoint.

## Testing with a Mock API

To test this MCP with a mock API, you can use a simple HTTP server that logs the received text. Here's how to set up a basic mock server:

1. Create a simple Express server:
   ```javascript
   const express = require('express');
   const app = express();
   const port = 3000;

   app.use(express.json());

   app.post('/api/speak', (req, res) => {
     console.log('Received text:', req.body.text);
     res.json({ success: true, message: 'Text received' });
   });

   app.listen(port, () => {
     console.log(`Mock API listening at http://localhost:${port}`);
   });
   ```

2. Run this server in a separate terminal while testing the MCP.

## License

MIT
