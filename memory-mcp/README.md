# Memory MCP for Augment Code

This directory contains the Memory Model Context Protocol (MCP) implementation for Augment Code. It allows LLMs to store and retrieve memories, creating a persistent knowledge base.

## Configuration

The `mcp-config-memory.json` file contains the configuration for the Memory MCP server. It's set up to work with WSL environments.

## Available Tools

This MCP server provides the following tools to LLMs:

### `remember`

Stores a new memory in the knowledge graph. It accepts:
- `memory`: The text content to remember

### `recall`

Retrieves memories from the knowledge graph based on a query. It accepts:
- `query`: The search query to find relevant memories

## Requirements

- Node.js (managed via NVM in the run script)
- No additional API keys or credentials needed

## Usage with VSCode and Augment Code

1. Install the Augment Code extension for VSCode
2. Configure the Augment Code extension to use this MCP server
3. You can now store and retrieve memories using natural language in VSCode

## Usage with WSL 2 (Windows)

The configuration is already set up for WSL 2 on Windows. The `mcp-config-memory.json` file contains the appropriate configuration for running the server in WSL.

## Notes

- Memories are stored locally in a file-based knowledge graph
- By default, memories are stored in the user's home directory
- The memory store persists between sessions
