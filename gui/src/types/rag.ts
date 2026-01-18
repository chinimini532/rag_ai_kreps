export interface Citation {
  documentName: string;
  page?: string;
  section?: string;
  vectorId: string;
  similarityScore: number;
}

export interface QueryMetrics {
  totalResponseTime: number;
  llmInferenceTime: number;
  chunksUsed: number;
  promptLength: number;
  answerLength: number;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
  metrics: QueryMetrics;
}

export interface IngestionStats {
  totalDocuments: number;
  totalChunks: number;
  embeddingDimension: number;
  metadataRowsInserted: number;
  totalIngestionTime: number;
  status: 'success' | 'failure';
  message?: string;
}

export interface DashboardStats {
  numberOfDocuments: number;
  numberOfChunks: number;
  numberOfVectors: number;
  chunkDistribution: { name: string; count: number }[];
  latencyMetrics: { query: string; latency: number; timestamp: string }[];
}

export interface AnalysisSection {
  id: string;
  title: string;
  description: string;
  icon: string;
}
