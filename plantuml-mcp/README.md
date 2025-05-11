# PlantUML MCP for Augment Code

This directory contains the PlantUML Model Context Protocol (MCP) implementation for Augment Code. It allows LLMs to generate diagrams from PlantUML code and return URLs to the generated images.

## Quick Start

1. Copy `.env.example` to `.env` (optional):
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file if you want to use a custom PlantUML server (optional):
   - `PLANTUML_SERVER_URL`: Your custom PlantUML server URL (default: https://www.plantuml.com/plantuml)

3. Make the run script executable:
   ```bash
   chmod +x run-plantuml-mcp.sh
   ```

4. Run the MCP server:
   ```bash
   ./run-plantuml-mcp.sh
   ```

5. Configure Augment Code extension to use this MCP implementation

## Configuration

The configuration files are located in the `config` directory:

- `config/mcp-config-plantuml.json`: Contains the configuration for the PlantUML MCP server
- `config/run-plantuml-mcp.sh`: The script that runs the MCP server

The environment variables from your `.env` file will be automatically used when you run the script.

## Available Tools

This MCP server provides the following tool to LLMs:

### `generateDiagram`

Generates a diagram from PlantUML code and returns the URL. It accepts:
- `plantUmlCode`: The PlantUML code to generate a diagram from
- `format`: The format of the diagram (png, svg, or txt) - default is png

Example usage:
```
@startuml
Alice -> Bob: Hello
Bob --> Alice: Hi!
@enduml
```

## Requirements

- Node.js v16 or higher (managed via NVM in the run script)
- Internet connection to access the PlantUML server (unless using a local server)

## Usage with VSCode and Augment Code

1. Install the Augment Code extension for VSCode
2. Run the PlantUML MCP server using `./run-plantuml-mcp.sh`
3. Configure the Augment Code extension to use this MCP server
4. You can now generate diagrams using natural language in VSCode

## Usage with WSL 2 (Windows)

If you're using WSL 2 on Windows:

1. Make sure Node.js is installed in your WSL 2 environment
2. Follow the Quick Start steps above within your WSL 2 environment
3. Configure Augment Code to connect to the MCP server running in WSL 2

## Examples

Here are some examples of PlantUML code you can use:

### Class Diagram

```
@startuml
class Car {
  +String make
  +String model
  +int year
  +start()
  +stop()
}
class Driver {
  +String name
  +String licenseNumber
  +drive(Car car)
}
Driver -- Car : drives >
@enduml
```

### Sequence Diagram

```
@startuml
participant User
participant System
participant Database

User -> System: Login request
System -> Database: Validate credentials
Database --> System: Authentication result
System --> User: Login response
@enduml
```

## Development

### Implementation Details

This MCP server is implemented using:
- TypeScript for type safety
- `@modelcontextprotocol/sdk` for MCP server functionality
- `@brainstack/diagram` for generating PlantUML diagram URLs
- Stdio communication for tool calling

### Running Tests

To run the tests:

```bash
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

For more PlantUML examples and syntax, visit the [PlantUML website](https://plantuml.com/).

For detailed setup instructions, refer to the main README in the repository root.
