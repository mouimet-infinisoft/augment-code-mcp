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
 * Setup signal handlers to make process uninterruptible
 */
function setupSignalHandlers(): void {
  console.log("Setting up signal handlers to make process uninterruptible...");

  const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP', 'SIGUSR1', 'SIGUSR2'];

  signals.forEach(signal => {
    process.on(signal as NodeJS.Signals, () => {
      console.log(`Received ${signal} signal - ignoring to remain uninterruptible`);
      // Ignore the signal - process continues running
    });
  });

  // Handle uncaught exceptions and unhandled rejections
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit, just log and continue
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit, just log and continue
  });
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
        ai_teammate: {
          type: "string",
          description: "Name of the AI teammate this message is from.",
         },
      },
      required: ["text","ai_teammate"],
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

  // Tool for signaling end of turn
  const endOfTurnTool: Tool = {
    name: "end_of_turn",
    description:
      "Must call this tool at the end of every turn. Signal that the conversation turn has ended. Use this tool to indicate that the assistant has finished its response and is ready for the next user input.",
    inputSchema: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "Optional summary of what was accomplished in this turn",
        },
        last_ai_teammate: {
          type: "string",
          description: "Name of the AI teammate who sent the last message",
        },
      },
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
        case 'end_of_turn':
          response = await endOfTurnToolHandler(request);
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
    const aiTeammate = request.params.arguments?.ai_teammate || "system";
    console.log(`Sending text to API: ${text} (from: ${aiTeammate})`);

    // Send the text to the API endpoint with AI teammate information
    await axios.post('http://localhost:3000/api/mcp/speak', {
      text,
      ai_teammate: aiTeammate
    });

    return "Message sent to speech API successfully";
  }
  const getUserMessagesToolHandler = async (_request: CallToolRequest) => {
    // Send the text to the API endpoint
    const response = await axios.get('http://localhost:3000/api/mcp/user-messages');
    const messages = response.data?.messages ?? []

    return messages.map((msg: any) => msg.text).join("\n")

  }

  const endOfTurnToolHandler = async (request: CallToolRequest) => {
    const summary = request.params.arguments?.summary || "Turn completed";
    const lastAiTeammate = String(request.params.arguments?.last_ai_teammate || "").toLowerCase();

    console.log(`End of turn: ${summary}`);
    console.log(`Last AI teammate: ${lastAiTeammate}`);

    console.log("Waiting for user message...");

    // Wait for user messages - promise never resolves until there is a message
    return new Promise((resolve) => {
      // Check for user messages every 2 seconds
      const intervalId = setInterval(async () => {
        try {
          // Get user messages
          const response = await axios.get('http://localhost:3000/api/mcp/user-messages');
          const messages = response.data?.messages ?? [];

          // If we have messages, return them and stop polling
          if (messages.length > 0) {
            clearInterval(intervalId);
            const userResponse = messages.map((msg: any) => msg.text).join("\n");
            console.log(`Received user response: ${userResponse}`);

            const conversationPrompt = `The conversation is with ${lastAiTeammate}, unless the user explicitly asks process message for ${lastAiTeammate}. User responded: ${userResponse}`
            resolve(conversationPrompt);
          }
        } catch (error) {
          console.error("Error checking for user messages:", error);
          // Don't reject on error, just continue waiting
        }
      }, 2000);

      // Ensure the interval is cleared if the promise is rejected
      process.on('unhandledRejection', () => {
        clearInterval(intervalId);
      });
    });
  }


  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("Received ListToolsRequest");
    return {
      tools: [
        speechResponseTool,
        getUserMessagesTool,
        endOfTurnTool,
      ],
    };
  });

  // Make process uninterruptible by catching and ignoring signals
  setupSignalHandlers();

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
