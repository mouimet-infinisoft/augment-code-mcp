#!/usr/bin/env node

import { createServer, startServer } from './server.js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configure PlantUML server URL if provided
const PLANTUML_SERVER_URL = process.env.PLANTUML_SERVER_URL;
if (PLANTUML_SERVER_URL) {
  console.log(`Using custom PlantUML server: ${PLANTUML_SERVER_URL}`);
}

async function main() {
  try {
    // Create the MCP server
    const mcpServer = createServer({
      plantUmlServerUrl: PLANTUML_SERVER_URL
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
