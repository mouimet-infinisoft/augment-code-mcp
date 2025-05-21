# Talk MCP Mock API

A simple mock API server for testing the Talk MCP tool.

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

The server will listen on port 3000 and log any text received at the `/api/speak` endpoint.

## Testing

You can test the API directly using curl:

```bash
curl -X POST http://localhost:3000/api/speak \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, this is a test message"}'
```

When the Talk MCP tool sends text to this API, it will be logged to the console.
