# Slack MCP for Augment Code

This directory contains the Slack Model Context Protocol (MCP) implementation for Augment Code.

## Quick Start

1. Copy `.env.example` to `.env` and fill in your Slack credentials
2. Run the MCP server using `./run-slack-nvm.sh`
3. Configure Augment Code extension to use this MCP implementation

## Configuration

The `mcp-config-nvm.json` file contains the configuration for the Slack MCP server. You may need to adjust paths to match your local environment.

## Requirements

- Node.js (managed via NVM in the run script)
- Slack Bot Token with appropriate scopes
- Slack Team ID

For detailed setup instructions, refer to the main README in the repository root.
