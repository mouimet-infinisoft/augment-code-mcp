import MessageList from '@/components/MessageList';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Talk MCP</h1>
          <p className="text-sm text-blue-100">Text-to-Speech Interface for MCP Tools</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 min-h-[80vh] border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Messages</h2>
          <MessageList />
        </div>
      </main>

      <footer className="bg-blue-800 p-4 text-white">
        <div className="container mx-auto text-center text-sm">
          <p>Talk MCP Web Interface - Powered by Next.js and Web Speech API</p>
        </div>
      </footer>
    </div>
  );
}
