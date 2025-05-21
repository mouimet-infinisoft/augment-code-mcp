# Talk MCP

A Model Context Protocol (MCP) implementation for converting language model responses to speech.

## Project Structure

- **mcp-server**: The MCP server implementation that provides the `speak` tool
- **mock-api**: A simple mock API server for testing the MCP tool

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

### 1. Start the Mock API Server

```bash
cd mock-api
npm install
npm start
```

This will start a server on port 3000 that logs any text received from the MCP tool.

### 2. Start the MCP Server

In a new terminal:

```bash
cd mcp-server
cp .env.example .env
chmod +x config/run-talk-mcp.sh
./config/run-talk-mcp.sh
```

### 3. Configure Augment Code

Configure the Augment Code extension to use the Talk MCP server.

## Testing

Once both servers are running, you can test the integration by:

1. Using the Augment Code extension with the Talk MCP configured
2. Having the language model use the `speak` tool
3. Checking the mock API server logs to see if the text was received

## Next Steps

This is a minimal implementation to validate the approach. Future enhancements could include:

- Web interface with text-to-speech using Web Speech API
- Support for different voices and speech parameters
- User response handling
- Persistent conversation storage
