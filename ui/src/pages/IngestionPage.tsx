import { useState, useRef } from 'react';
import { Upload, Loader2, CheckCircle2, XCircle, FileText, Layers, Box, Database, Clock, X, File } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { IngestionStats } from '@/types/rag';
import { ingest_api } from '@/lib/mockApi';

const ACCEPTED_FILE_TYPES = '.pdf,.md,.txt';
const ACCEPTED_MIME_TYPES = ['application/pdf', 'text/markdown', 'text/plain'];

const IngestionPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<IngestionStats | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        const ext = file.name.toLowerCase().split('.').pop();
        return ext === 'pdf' || ext === 'md' || ext === 'txt';
      });
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        const ext = file.name.toLowerCase().split('.').pop();
        return ext === 'pdf' || ext === 'md' || ext === 'txt';
      });
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRunIngestion = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsProcessing(true);
    setStats(null);
    
    try {
      const result = await ingest_api();
      setStats({
        ...result,
        totalDocuments: uploadedFiles.length
      });
      setUploadedFiles([]);
    } catch (error) {
      setStats({
        totalDocuments: 0,
        totalChunks: 0,
        embeddingDimension: 0,
        metadataRowsInserted: 0,
        totalIngestionTime: 0,
        status: 'failure',
        message: 'An error occurred during ingestion'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const statCards = stats ? [
    { label: 'Total Documents', value: stats.totalDocuments, icon: FileText, color: 'primary' },
    { label: 'Total Chunks', value: stats.totalChunks, icon: Layers, color: 'success' },
    { label: 'Embedding Dimension', value: stats.embeddingDimension, icon: Box, color: 'warning' },
    { label: 'Metadata Rows', value: stats.metadataRowsInserted, icon: Database, color: 'primary' },
    { label: 'Ingestion Time', value: `${(stats.totalIngestionTime / 1000).toFixed(1)}s`, icon: Clock, color: 'success' },
  ] : [];

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/50 px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Document Ingestion & Indexing</h1>
            <p className="text-sm text-muted-foreground">Upload and process documents for RAG queries</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto scrollbar-thin">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Upload Area */}
            <div className="glass-panel p-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Upload Documents</h2>
              
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-foreground font-medium mb-1">
                  Drag & drop files here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: PDF, Markdown (.md), Text (.txt)
                </p>
              </div>

              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} selected
                  </p>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg group"
                    >
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                        {getFileIcon(file.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Ingest Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleRunIngestion}
                  disabled={isProcessing || uploadedFiles.length === 0}
                  className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Ingest Documents
                    </>
                  )}
                </button>
                {uploadedFiles.length === 0 && !isProcessing && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload at least one document to begin ingestion
                  </p>
                )}
              </div>

              {isProcessing && (
                <div className="mt-6">
                  <div className="w-full max-w-xs mx-auto h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Processing, chunking, and embedding documents...
                  </p>
                </div>
              )}
            </div>

            {/* Status */}
            {stats && (
              <div className="animate-slide-in">
                <div className={`glass-panel p-4 flex items-center gap-3 mb-6 ${
                  stats.status === 'success' ? 'border-success/50' : 'border-destructive/50'
                }`}>
                  {stats.status === 'success' ? (
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                  )}
                  <div>
                    <p className={`font-medium ${
                      stats.status === 'success' ? 'text-success' : 'text-destructive'
                    }`}>
                      {stats.status === 'success' ? 'Ingestion Complete' : 'Ingestion Failed'}
                    </p>
                    <p className="text-sm text-muted-foreground">{stats.message}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    const colorClass = stat.color === 'primary' ? 'text-primary' : 
                                       stat.color === 'success' ? 'text-success' : 'text-warning';
                    return (
                      <div key={idx} className="stat-card text-center">
                        <Icon className={`w-6 h-6 mx-auto mb-3 ${colorClass}`} />
                        <p className="kpi-value text-foreground">{stat.value.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default IngestionPage;
