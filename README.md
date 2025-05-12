# Augment Code MCP (Model Context Protocol)

This repository contains the Model Context Protocol (MCP) implementation for Augment Code, enabling seamless integration with various external services.

## What is MCP?

The Model Context Protocol (MCP) is a core component of Augment Code that facilitates communication between AI models and external services. It provides a standardized way to:

- Access external data sources
- Interact with third-party platforms
- Execute actions in connected systems
- Retrieve contextual information for AI processing

## Supported Integrations

- **Slack MCP**: Enables AI assistants to interact with Slack workspaces, channels, and messages
- **PlantUML MCP**: Allows AI assistants to generate UML diagrams with automatic branding
- **PostgREST MCP**: Provides database access through a RESTful API
- Additional integrations are being developed

## How to Use

### Setup Requirements
- **VSCode**: This implementation is optimized for Visual Studio Code
- **Augment Code Extension**: Install the Augment Code extension in VSCode
- **WSL 2**: Running in Windows Subsystem for Linux 2 environment

### Installation Steps
1. Clone this repository to your local environment
2. Navigate to the specific MCP directory you want to use
3. Follow the setup instructions in the MCP-specific README

### Running the PlantUML MCP
1. Navigate to the PlantUML MCP directory:
   ```bash
   cd plantuml-mcp
   ```

2. Make the run script executable:
   ```bash
   chmod +x config/run-plantuml-mcp.sh
   ```

3. Run the MCP server:
   ```bash
   ./config/run-plantuml-mcp.sh
   ```

4. For WSL 2 users, use the WSL-specific configuration:
   ```bash
   cp config/mcp-config-plantuml-wsl.json config/mcp-config-plantuml.json
   ```

### Running the Slack MCP
1. Navigate to the Slack MCP directory:
   ```bash
   cd slack-mcp
   ```

2. Configure your Slack credentials in the `.env` file
3. Run the MCP server using the provided script

### Integration with Augment Code
1. Open VSCode with the Augment Code extension installed
2. Configure the extension to use your local MCP implementation
3. Verify the connection between Augment Code and your MCP services
4. Test the integration by executing commands through the Augment Code interface

### Troubleshooting
- Ensure all paths in the configuration are correct for your WSL 2 environment
- Check that environment variables are properly set in your `.env` file
- Verify network connectivity for external service APIs
- Review logs for any connection or authentication errors

## Architecture

The MCP serves as a middleware layer between Augment Code's AI capabilities and external services. It:

1. Translates requests from the AI into service-specific API calls
2. Handles authentication and security
3. Processes and formats responses for AI consumption
4. Manages rate limiting and error handling

## Configuration

Each MCP integration has its own configuration requirements, typically involving:

- API keys and authentication tokens
- Service-specific settings
- Permission scopes
- Environment variables

### PlantUML MCP Configuration

The PlantUML MCP can be configured using:

1. Environment variables in a `.env` file:
   ```
   # Optional: Custom PlantUML server URL
   PLANTUML_SERVER_URL=https://www.plantuml.com/plantuml
   ```

2. Configuration files in the `config` directory:
   - `mcp-config-plantuml.json`: Standard configuration
   - `mcp-config-plantuml-wsl.json`: WSL-specific configuration

### Slack MCP Configuration

The Slack MCP requires:

1. Slack API credentials in a `.env` file
2. Workspace-specific configuration in the JSON config file

## Security Considerations

- All authentication credentials are stored locally in `.env` files
- Sensitive information is never committed to version control
- The `.gitignore` file is configured to exclude `.env` files
- MCP implementations follow security best practices for each integrated service

## MCP Features

### PlantUML MCP
- Generate UML diagrams from PlantUML code
- Support for multiple output formats (PNG, SVG, TXT)
- Automatic footer branding on all diagrams
- Dark theme support with styling recommendations
- Compatible with the Model Context Protocol standard

### Slack MCP
- Post messages to Slack channels
- Reply to threads
- Add emoji reactions
- Get channel history
- List channels and users
- Access user profiles

### PostgREST MCP
- Execute SQL queries via RESTful API
- Convert SQL to REST requests
- Access database resources securely

## Development

The MCP architecture is designed to be extensible, allowing for the addition of new service integrations through a standardized interface.

