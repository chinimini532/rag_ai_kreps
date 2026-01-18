import { useState, useEffect } from 'react';
import { FileText, Layers, Box, Target, Clock, PieChart, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MainLayout from '@/components/layout/MainLayout';
import KPICard from '@/components/dashboard/KPICard';
import AnalysisModal from '@/components/dashboard/AnalysisModal';
import { DashboardStats } from '@/types/rag';
import { dashboard_api } from '@/lib/mockApi';

const analysisSections = [
  { id: 'retrieval', title: 'Retrieval Performance', description: 'Precision and recall metrics', icon: Target },
  { id: 'latency', title: 'Chatbot Latency', description: 'Response time analysis', icon: Clock },
  { id: 'chunk', title: 'Chunk Usage Analysis', description: 'Token distribution stats', icon: PieChart },
];

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboard_api();
        setStats(data);
      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card/50 px-6 py-4 flex-shrink-0">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Analysis & Evaluation Dashboard</h1>
            <p className="text-sm text-muted-foreground">System performance and retrieval metrics</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto scrollbar-thin">
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard
                title="Documents"
                value={stats?.numberOfDocuments || 0}
                icon={FileText}
                color="primary"
              />
              <KPICard
                title="Chunks"
                value={stats?.numberOfChunks || 0}
                icon={Layers}
                color="success"
              />
              <KPICard
                title="Vectors"
                value={stats?.numberOfVectors || 0}
                icon={Box}
                color="warning"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chunk Distribution */}
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Chunk Distribution by File Type</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.chunkDistribution || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 22%)" />
                      <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" />
                      <YAxis stroke="hsl(215, 15%, 55%)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(220, 18%, 13%)', 
                          border: '1px solid hsl(220, 15%, 22%)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="count" fill="hsl(185, 80%, 50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Latency */}
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Query Latency</h3>
                <div className="space-y-3">
                  {stats?.latencyMetrics.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.query}</p>
                        <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className={`w-2 h-2 rounded-full ${
                          item.latency < 1000 ? 'bg-success' : 
                          item.latency < 1500 ? 'bg-warning' : 'bg-destructive'
                        }`} />
                        <span className="font-mono text-sm text-foreground">{item.latency}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis Sections */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setModalOpen(section.id)}
                      className="stat-card text-left hover:border-primary/50 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-medium text-foreground">{section.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Modal */}
        <AnalysisModal
          isOpen={modalOpen !== null}
          onClose={() => setModalOpen(null)}
          title={analysisSections.find(s => s.id === modalOpen)?.title || ''}
          type={modalOpen as 'retrieval' | 'latency' | 'chunk'}
        />
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
