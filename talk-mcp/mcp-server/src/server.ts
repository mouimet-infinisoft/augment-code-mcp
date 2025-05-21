import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// import { z } from 'zod';
import axios from 'axios';
import {
  CallToolRequestSchema,
  CallToolRequest,
  ListToolsRequestSchema,
  Tool
} from "@modelcontextprotocol/sdk/types.js";


interface ServerConfig {
  apiEndpoint?: string;
}

/**
 * Creates an MCP server with a speak tool
 * @param config Server configuration
 * @returns MCP server instance
 */
export function createServer(config: ServerConfig = {}): Server {
  // Create an MCP server
  const server = new Server({
    name: 'Talk MCP',
    version: '0.1.0'
  },
    {
      capabilities: {
        tools: {}
      }
    }

  );

  const speechResponseTool: Tool = {
    name: "speech_response",
    description:
      "Each response must use this tool to speech the message.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The response text",
        },
      },
    },
  };

  // Tool for getting user messages
  const getUserMessagesTool: Tool = {
    name: "get_user_messages",
    description:
      "Get messages from the user. Use this tool to check if the user has sent any new messages.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  };


  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    console.error("Received CallToolRequest:", request);
    let response;

    try {

      switch (request.params.name) {
        case 'speech_response':
          response = await speechResponseToolHandler(request);
          break;
        case 'get_user_messages':
          response = await getUserMessagesToolHandler(request);
          break;
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);

      }

    } catch (error) {
      console.error('Error sending text to API:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Failed to send text: ${error instanceof Error ? error.message : String(error)}`
          }
        ],
        isError: true
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: response
        }
      ],
    };

  })


  const speechResponseToolHandler = async (request: CallToolRequest) => {
    const text = request.params.arguments?.text;
    console.log(`Sending text to API: ${text}`);

    // Send the text to the API endpoint
    const response = await axios.post('http://localhost:3000/api/mcp/speak', { text });

    return "sent"

  }
  const getUserMessagesToolHandler = async (request: CallToolRequest) => {
    // Send the text to the API endpoint
    const response = await axios.get('http://localhost:3000/api/mcp/user-messages');
    const messages = response.data?.messages ?? []

    return messages.map((msg: any) => msg.text).join("\n")

  }


  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("Received ListToolsRequest");
    return {
      tools: [
        speechResponseTool,
        getUserMessagesTool,
      ],
    };
  });

  return server;
}

/**
 * Starts the MCP server with stdio transport
 * @param server MCP server instance
 */
export async function startServer(server: Server): Promise<void> {
  console.log('Starting Talk MCP server with stdio');

  // Create a stdio transport
  const transport = new StdioServerTransport();

  // Connect the server to the transport
  await server.connect(transport);

  console.log('Talk MCP server is ready to receive tool calls via stdio');
}
