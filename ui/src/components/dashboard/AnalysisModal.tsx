import { X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'retrieval' | 'latency' | 'chunk';
}

const COLORS = ['hsl(185, 80%, 50%)', 'hsl(145, 70%, 45%)', 'hsl(38, 90%, 55%)', 'hsl(280, 70%, 60%)', 'hsl(0, 70%, 50%)'];

const retrievalData = [
  { name: 'Query 1', precision: 0.94, recall: 0.88 },
  { name: 'Query 2', precision: 0.89, recall: 0.92 },
  { name: 'Query 3', precision: 0.91, recall: 0.85 },
  { name: 'Query 4', precision: 0.87, recall: 0.90 },
  { name: 'Query 5', precision: 0.93, recall: 0.87 },
];

const latencyData = [
  { time: '10:00', latency: 1200 },
  { time: '10:15', latency: 980 },
  { time: '10:30', latency: 1450 },
  { time: '10:45', latency: 870 },
  { time: '11:00', latency: 1100 },
  { time: '11:15', latency: 950 },
  { time: '11:30', latency: 1050 },
];

const chunkData = [
  { name: 'Small (< 256)', value: 1234 },
  { name: 'Medium (256-512)', value: 2341 },
  { name: 'Large (512-1024)', value: 987 },
  { name: 'XL (> 1024)', value: 261 },
];

const AnalysisModal = ({ isOpen, onClose, title, type }: AnalysisModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 overflow-auto scrollbar-thin">
          {type === 'retrieval' && (
            <div className="space-y-6">
              <p className="text-muted-foreground">Precision and recall metrics for recent queries.</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={retrievalData}>
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
                    <Bar dataKey="precision" fill="hsl(185, 80%, 50%)" name="Precision" />
                    <Bar dataKey="recall" fill="hsl(145, 70%, 45%)" name="Recall" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {type === 'latency' && (
            <div className="space-y-6">
              <p className="text-muted-foreground">Query response latency over time (ms).</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 22%)" />
                    <XAxis dataKey="time" stroke="hsl(215, 15%, 55%)" />
                    <YAxis stroke="hsl(215, 15%, 55%)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(220, 18%, 13%)', 
                        border: '1px solid hsl(220, 15%, 22%)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="latency" 
                      stroke="hsl(185, 80%, 50%)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(185, 80%, 50%)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {type === 'chunk' && (
            <div className="space-y-6">
              <p className="text-muted-foreground">Distribution of chunks by token size.</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chunkData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {chunkData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(220, 18%, 13%)', 
                        border: '1px solid hsl(220, 15%, 22%)',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
