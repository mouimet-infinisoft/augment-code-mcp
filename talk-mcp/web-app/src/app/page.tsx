import MessageList from '@/components/MessageList';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      <header style={{ backgroundColor: 'var(--header-bg)', color: 'var(--header-text)' }} className="p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Talk MCP</h1>
            <p className="text-sm opacity-80">Text-to-Speech Interface for MCP Tools</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
          color: 'var(--text-dark)'
        }} className="rounded-lg shadow-lg p-4 md:p-6 min-h-[80vh] border">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>Messages</h2>
          <MessageList />
        </div>
      </main>

      <footer style={{ backgroundColor: 'var(--footer-bg)', color: 'var(--footer-text)' }} className="p-4">
        <div className="container mx-auto text-center text-sm">
          <p>Talk MCP Web Interface - Powered by Next.js and Web Speech API</p>
        </div>
      </footer>
    </div>
  );
}
