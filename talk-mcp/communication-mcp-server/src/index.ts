#!/usr/bin/env node

import { createServer, startServer } from './server.js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get API endpoint from environment variable
const API_ENDPOINT = process.env.API_ENDPOINT;

async function main() {
  try {
    // Create the MCP server
    const mcpServer = createServer({
      apiEndpoint: API_ENDPOINT
    });

    // Start the server with stdio
    await startServer(mcpServer);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Run the main function
main();
