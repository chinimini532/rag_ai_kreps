import { Bot, Loader2 } from 'lucide-react';

interface AnswerDisplayProps {
  answer: string | null;
  isLoading: boolean;
}

const AnswerDisplay = ({ answer, isLoading }: AnswerDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <div>
            <p className="text-foreground font-medium">Processing your query...</p>
            <p className="text-sm text-muted-foreground">Searching through indexed documents</p>
          </div>
        </div>
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Bot className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-foreground font-medium">Ready to assist</p>
            <p className="text-sm text-muted-foreground">
              Ask a question about your ingested documents. The AI will search through your knowledge base and provide relevant answers with citations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto scrollbar-thin p-6">
      <div className="max-w-3xl mx-auto animate-slide-in">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="prose prose-invert max-w-none">
              {answer.split('\n').map((paragraph, idx) => (
                <p key={idx} className="text-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerDisplay;
