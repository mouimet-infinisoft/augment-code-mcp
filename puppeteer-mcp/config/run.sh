#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Script directory: $SCRIPT_DIR"

# Change to the parent directory (root of the project)
cd "$SCRIPT_DIR/.."
PROJECT_DIR="$(pwd)"
echo "Project directory: $PROJECT_DIR"

# Source NVM to ensure the correct Node environment is set up
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Read values from .env file if it exists
if [ -f "$PROJECT_DIR/.env" ]; then
  echo "Reading configuration from .env file..."
  export $(grep -v "^#" "$PROJECT_DIR/.env" | xargs)
else
  echo "Warning: .env file not found in $PROJECT_DIR"
  echo "Using default configuration."
fi

# Build the TypeScript code
npm i @modelcontextprotocol/server-puppeteer -g

# Run the MCP server
echo "Starting Puppeteer MCP Server with stdio..."
npx -y @modelcontextprotocol/server-puppeteer
