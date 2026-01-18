import { useState } from 'react';
import { Send, Settings2 } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (query: string, topK: number) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSubmit, isLoading }: ChatInputProps) => {
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim(), topK);
    }
  };

  return (
    <div className="border-t border-border bg-card/50 p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="input-field w-full pr-12"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <Settings2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Submit</span>
          </button>
        </div>

        {showSettings && (
          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg animate-slide-in">
            <label className="text-sm text-muted-foreground">Top K Results:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-32 accent-primary"
            />
            <span className="font-mono text-sm text-primary">{topK}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
