#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Script directory: $SCRIPT_DIR"

# Change to the script directory
cd "$SCRIPT_DIR"

# Source NVM to ensure the correct Node environment is set up
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Read values from .env file
if [ ! -f "$SCRIPT_DIR/.env" ]; then
  echo "Error: .env file not found in $SCRIPT_DIR"
  echo "Please create a .env file with the required configuration."
  exit 1
fi

echo "Reading configuration from .env file..."

# Extract values using grep and cut
POSTGREST_API_URL=$(grep -E "^POSTGREST_API_URL=" "$SCRIPT_DIR/.env" | cut -d= -f2)
POSTGREST_API_KEY=$(grep -E "^POSTGREST_API_KEY=" "$SCRIPT_DIR/.env" | cut -d= -f2)
POSTGREST_SCHEMA=$(grep -E "^POSTGREST_SCHEMA=" "$SCRIPT_DIR/.env" | cut -d= -f2)

# Check if values were successfully extracted
if [ -z "$POSTGREST_API_URL" ]; then
  echo "Error: POSTGREST_API_URL not found in .env file"
  exit 1
fi

if [ -z "$POSTGREST_API_KEY" ]; then
  echo "Error: POSTGREST_API_KEY not found in .env file"
  exit 1
fi

if [ -z "$POSTGREST_SCHEMA" ]; then
  echo "Error: POSTGREST_SCHEMA not found in .env file"
  exit 1
fi

# Run the MCP server
echo "Starting Supabase PostgREST MCP Server..."
echo "API URL: $POSTGREST_API_URL"
echo "Schema: $POSTGREST_SCHEMA"

npx -y @supabase/mcp-server-postgrest \
  --apiUrl "$POSTGREST_API_URL" \
  --apiKey "$POSTGREST_API_KEY" \
  --schema "$POSTGREST_SCHEMA"

