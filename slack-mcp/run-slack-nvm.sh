#!/bin/bash

# This script sources NVM to ensure the correct Node environment is set up
# and then runs the Slack MCP server with environment variables from .env file

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Script directory: $SCRIPT_DIR"

# Change to the repository root directory
cd "$SCRIPT_DIR/.."
REPO_ROOT="$(pwd)"
echo "Repository root: $REPO_ROOT"

# Source NVM to ensure the correct Node environment is set up
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Load environment variables from .env file
if [ -f "$SCRIPT_DIR/.env" ]; then
  echo "Loading environment variables from .env file"
  export $(grep -v "^#" "$SCRIPT_DIR/.env" | xargs)
else
  echo "Error: .env file not found in $SCRIPT_DIR"
  exit 1
fi

# Run the server
echo "Running the server..."
npx -y @modelcontextprotocol/server-slack
