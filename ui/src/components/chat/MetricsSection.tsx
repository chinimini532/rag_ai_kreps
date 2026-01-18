import { useState } from 'react';
import { ChevronDown, ChevronRight, Activity, Clock, Layers, FileCode, FileText } from 'lucide-react';
import { QueryMetrics } from '@/types/rag';

interface MetricsSectionProps {
  metrics: QueryMetrics;
}

const MetricsSection = ({ metrics }: MetricsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const metricsData = [
    { 
      label: 'Total Response Time', 
      value: `${metrics.totalResponseTime}ms`, 
      icon: Clock,
      color: 'text-primary' 
    },
    { 
      label: 'LLM Inference Time', 
      value: `${metrics.llmInferenceTime}ms`, 
      icon: Activity,
      color: 'text-chart-2' 
    },
    { 
      label: 'Chunks Used', 
      value: metrics.chunksUsed.toString(), 
      icon: Layers,
      color: 'text-chart-3' 
    },
    { 
      label: 'Prompt Length', 
      value: `${metrics.promptLength} tokens`, 
      icon: FileCode,
      color: 'text-chart-4' 
    },
    { 
      label: 'Answer Length', 
      value: `${metrics.answerLength} chars`, 
      icon: FileText,
      color: 'text-muted-foreground' 
    },
  ];

  return (
    <div className="expandable-section bg-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-chart-2" />
          <span className="font-medium">Performance Metrics</span>
          <span className="font-mono text-sm text-muted-foreground">
            {metrics.totalResponseTime}ms total
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border p-4 animate-slide-in">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {metricsData.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="stat-card text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${metric.color}`} />
                  <p className="font-mono text-lg font-semibold text-foreground">
                    {metric.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsSection;
