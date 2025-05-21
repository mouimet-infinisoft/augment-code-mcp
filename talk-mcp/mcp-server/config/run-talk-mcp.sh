#!/bin/bash

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

# Change to the parent directory
cd "$PARENT_DIR" || exit 1

# Load environment variables from .env file
if [ -f "$PARENT_DIR/.env" ]; then
  echo "Loading environment variables from .env file"
  export $(grep -v "^#" "$PARENT_DIR/.env" | xargs)
else
  echo "No .env file found, using default configuration"
  # Copy example file if it doesn't exist
  cp "$PARENT_DIR/.env.example" "$PARENT_DIR/.env"
  export $(grep -v "^#" "$PARENT_DIR/.env" | xargs)
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "$PARENT_DIR/node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the project
echo "Building the project..."
npm run build

# Run the MCP server
echo "Starting Talk MCP Server with stdio..."
npm start
