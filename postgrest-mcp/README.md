# Supabase PostgREST MCP for Augment Code

This directory contains the Supabase PostgREST Model Context Protocol (MCP) implementation for Augment Code. It allows LLMs to perform database queries and operations on Postgres databases via PostgREST.

## Quick Start

1. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your actual Supabase project details:
   - `POSTGREST_API_URL`: Your Supabase REST API URL (e.g., `https://your-project-ref.supabase.co/rest/v1`)
   - `POSTGREST_API_KEY`: Your Supabase API key (anon key or service role key)
   - `POSTGREST_SCHEMA`: The Postgres schema to use (default: `public`)

3. Make the run script executable:
   ```bash
   chmod +x run-postgrest-mcp.sh
   ```

4. Run the MCP server:
   ```bash
   ./run-postgrest-mcp.sh
   ```

5. Configure Augment Code extension to use this MCP implementation

## Configuration

The `mcp-config-postgrest.json` file contains the configuration for the Supabase PostgREST MCP server. The environment variables from your `.env` file will be automatically inserted into this configuration when you run the script.

## Available Tools

This MCP server provides the following tools to LLMs:

### `postgrestRequest`

Performs HTTP requests to your PostgREST server. It accepts:
- `method`: HTTP method (GET, POST, PATCH, DELETE)
- `path`: The path to query (e.g., `/todos?id=eq.1`)
- `body`: Request body (for POST and PATCH requests)

### `sqlToRest`

Converts SQL queries to equivalent PostgREST syntax. Useful for complex queries. It accepts:
- `sql`: The SQL query to convert

## Requirements

- Node.js v16 or higher (managed via NVM in the run script)
- Supabase project with PostgREST enabled
- Supabase API key with appropriate permissions

## Usage with VSCode and Augment Code

1. Install the Augment Code extension for VSCode
2. Run the PostgREST MCP server using `./run-postgrest-mcp.sh`
3. Configure the Augment Code extension to use this MCP server
4. You can now query your Supabase database using natural language in VSCode

## Usage with WSL 2 (Windows)

If you're using WSL 2 on Windows:

1. Make sure Node.js is installed in your WSL 2 environment
2. Follow the Quick Start steps above within your WSL 2 environment
3. Configure Augment Code to connect to the MCP server running in WSL 2

For detailed setup instructions, refer to the main README in the repository root.
