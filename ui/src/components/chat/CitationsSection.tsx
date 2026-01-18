import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Hash } from 'lucide-react';
import { Citation } from '@/types/rag';

interface CitationsSectionProps {
  citations: Citation[];
}

const CitationsSection = ({ citations }: CitationsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (citations.length === 0) return null;

  return (
    <div className="expandable-section bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <span className="font-medium">Citations</span>
          <span className="status-badge bg-primary/20 text-primary">
            {citations.length} sources
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border animate-slide-in">
          <div className="divide-y divide-border">
            {citations.map((citation, idx) => (
              <div key={idx} className="p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {citation.documentName}
                    </p>
                    {(citation.page || citation.section) && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {citation.page && `Page ${citation.page}`}
                        {citation.page && citation.section && ' · '}
                        {citation.section}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                      <Hash className="w-3 h-3" />
                      {citation.vectorId}
                    </div>
                    <div className={`text-sm font-mono ${
                      citation.similarityScore >= 0.9 ? 'text-success' :
                      citation.similarityScore >= 0.8 ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                      {(citation.similarityScore * 100).toFixed(1)}% match
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitationsSection;
