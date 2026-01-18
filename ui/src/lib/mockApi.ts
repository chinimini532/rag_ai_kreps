import { ChatResponse, IngestionStats, DashboardStats } from '@/types/rag';

// Mock API functions - replace these with actual backend calls
export const chat_api = async (query: string, top_k: number = 5): Promise<ChatResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    answer: `Based on the analyzed documents, here's the answer to your query about "${query}":\n\nThe system has identified relevant information from multiple sources. According to the indexed documents, the key findings indicate that the operational parameters are within expected ranges. The analysis shows consistent patterns across the monitored timeframe.\n\nFor detailed technical specifications, please refer to the cited documents below.`,
    citations: [
      {
        documentName: "Power_Grid_Operations_Manual_2024.pdf",
        page: "42",
        section: "3.2.1 - Load Balancing",
        vectorId: "vec_8a7f3c2d",
        similarityScore: 0.94
      },
      {
        documentName: "Technical_Specifications_Rev5.docx",
        page: "18",
        section: "Appendix B",
        vectorId: "vec_1b4e9f6a",
        similarityScore: 0.89
      },
      {
        documentName: "Safety_Protocols_Q4.pdf",
        page: "7",
        vectorId: "vec_3c8d2e1f",
        similarityScore: 0.82
      }
    ],
    metrics: {
      totalResponseTime: 1247,
      llmInferenceTime: 892,
      chunksUsed: top_k,
      promptLength: 2048,
      answerLength: 456
    }
  };
};

export const ingest_api = async (): Promise<IngestionStats> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    totalDocuments: 127,
    totalChunks: 4823,
    embeddingDimension: 1536,
    metadataRowsInserted: 4823,
    totalIngestionTime: 45230,
    status: 'success',
    message: 'All documents processed successfully'
  };
};

export const dashboard_api = async (): Promise<DashboardStats> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    numberOfDocuments: 127,
    numberOfChunks: 4823,
    numberOfVectors: 4823,
    chunkDistribution: [
      { name: 'PDF', count: 2341 },
      { name: 'DOCX', count: 1256 },
      { name: 'TXT', count: 892 },
      { name: 'CSV', count: 234 },
      { name: 'JSON', count: 100 }
    ],
    latencyMetrics: [
      { query: "Load balancing query", latency: 1247, timestamp: "2024-01-15 14:32" },
      { query: "Safety protocols search", latency: 982, timestamp: "2024-01-15 14:28" },
      { query: "Technical specs lookup", latency: 1456, timestamp: "2024-01-15 14:15" },
      { query: "Maintenance schedule", latency: 876, timestamp: "2024-01-15 13:52" },
      { query: "Compliance check", latency: 1102, timestamp: "2024-01-15 13:41" }
    ]
  };
};
