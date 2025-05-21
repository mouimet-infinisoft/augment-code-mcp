# n8n Workflow Builder MCP for Augment Code

This directory contains the n8n Workflow Builder Model Context Protocol (MCP) implementation for Augment Code. It allows LLMs to create, update, delete, activate, and deactivate workflows through a set of tools available in Claude AI and Cursor IDE.

## Key Features

- Full integration with Claude AI and Cursor IDE via MCP protocol
- Create and manage n8n workflows via natural language
- Predefined workflow templates through prompts system
- Interactive workflow building with real-time feedback

## Quick Start

1. Copy `.env.example` to `.env` and fill in your n8n credentials:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your actual n8n instance details:
   - `N8N_HOST`: Your n8n API URL (e.g., `https://your-n8n-instance.com/api/v1/`)
   - `N8N_API_KEY`: Your n8n API key

3. Make the run script executable:
   ```bash
   chmod +x config/run-n8n-workflow-builder-mcp.sh
   ```

4. Run the MCP server:
   ```bash
   ./config/run-n8n-workflow-builder-mcp.sh
   ```

5. Configure Augment Code extension to use this MCP implementation

## Configuration

The `config/mcp-config-n8n-workflow-builder.json` file contains the configuration for the n8n Workflow Builder MCP server. The environment variables from your `.env` file will be automatically inserted into this configuration when you run the script.

## Available Tools

This MCP server provides the following tools to LLMs:

### Workflow Management

- **list_workflows**: Displays a list of all workflows from n8n.
- **create_workflow**: Creates a new workflow in n8n.
- **get_workflow**: Gets workflow details by its ID.
- **update_workflow**: Updates an existing workflow.
- **delete_workflow**: Deletes a workflow by its ID.
- **activate_workflow**: Activates a workflow by its ID.
- **deactivate_workflow**: Deactivates a workflow by its ID.
- **execute_workflow**: Manually executes a workflow by its ID.

### Execution Management

- **list_executions**: Displays a list of all workflow executions with filtering capabilities.
- **get_execution**: Gets details of a specific execution by its ID.
- **delete_execution**: Deletes an execution record by its ID.

### Tag Management

- **create_tag**: Creates a new tag.
- **get_tags**: Gets a list of all tags.
- **get_tag**: Gets tag details by its ID.
- **update_tag**: Updates an existing tag.
- **delete_tag**: Deletes a tag by its ID.

## Requirements

- Node.js (v14+ recommended)
- npm
- n8n instance with API access (tested and compatible with n8n version 1.82.3)
- Claude App or Cursor IDE for AI interaction

## Usage with WSL 2 (Windows)

For Windows users with WSL 2, use the WSL configuration:

1. Edit the `config/mcp-config-n8n-workflow-builder-wsl.json` file to match your WSL path
2. Configure Augment Code to use this configuration file

## Notes

- This MCP server is based on the [@kernel.salacoste/n8n-workflow-builder](https://github.com/salacoste/mcp-n8n-workflow-builder) package
- Compatible with n8n version 1.82.3 and above
- Requires a valid n8n API key with appropriate permissions
