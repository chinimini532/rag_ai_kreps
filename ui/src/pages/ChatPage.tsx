import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, BarChart3 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ChatInput from '@/components/chat/ChatInput';
import AnswerDisplay from '@/components/chat/AnswerDisplay';
import CitationsSection from '@/components/chat/CitationsSection';
import MetricsSection from '@/components/chat/MetricsSection';
import { ChatResponse } from '@/types/rag';
import { chat_api } from '@/lib/mockApi';

const ChatPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);

  const handleSubmit = async (query: string, topK: number) => {
    setIsLoading(true);
    setResponse(null);
    
    try {
      const result = await chat_api(query, topK);
      setResponse(result);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">AI Chatbot</h1>
              <p className="text-sm text-muted-foreground">Query your knowledge base with natural language</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/ingestion')}
                className="btn-secondary flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Document Ingestion
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analysis Dashboard
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <AnswerDisplay answer={response?.answer || null} isLoading={isLoading} />
          
          {response && !isLoading && (
            <div className="border-t border-border px-6 py-4 space-y-3">
              <CitationsSection citations={response.citations} />
              <MetricsSection metrics={response.metrics} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default ChatPage;
