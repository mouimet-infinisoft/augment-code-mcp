# Augment Code MCP (Model Context Protocol)

This repository contains ready-to-use Model Context Protocol (MCP) configurations and implementations that work with any MCP-compatible system, including the Augment Code VSCode extension.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI assistants to interact with external tools and services:

- Generate diagrams and visualizations
- Access messaging platforms like Slack
- Query databases and APIs
- Execute specialized functions

## Supported MCPs

- **PlantUML MCP** (`@brainstack/plantuml-mcp`): Generate professional UML diagrams with automatic branding
- **Slack MCP**: Interact with Slack workspaces, channels, and messages
- **PostgREST MCP**: Access PostgreSQL databases through a RESTful API

## Quick Start

1. **Install VSCode and Augment Code Extension**
2. **Choose an MCP**:
   - Use PlantUML MCP: `npm install @brainstack/plantuml-mcp`
   - Or use the configuration files in this repository
3. **Run the MCP server** using the provided scripts
4. **Configure Augment Code** to connect to your MCP

Each MCP directory contains complete configuration files and run scripts that work out of the box with the Augment Code extension.

## MCP Features

Each MCP in this repository is fully configured and ready to use with the Augment Code extension:

### PlantUML MCP
- **Generate UML diagrams** with automatic branding
- **Multiple formats**: PNG, SVG, and text output
- **Dark theme support** with professional styling
- **Available as npm package**: `npm install @brainstack/plantuml-mcp`

### Slack MCP
- **Post and read messages** in channels and threads
- **React with emojis** to messages
- **List channels and users** in your workspace
- **Access user profiles** and information

### PostgREST MCP
- **Execute SQL queries** via a RESTful API
- **Convert SQL to REST** requests automatically
- **Access database resources** securely

## Works with Augment Code

These MCPs are fully compatible with the Augment Code VSCode extension, enabling AI assistants to:

- Generate diagrams and visualizations
- Interact with external services
- Access and manipulate data
- Extend AI capabilities with specialized tools

For more information, visit the [Augment Code website](https://augment.dev/).

