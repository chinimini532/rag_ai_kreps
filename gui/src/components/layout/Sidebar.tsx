import { MessageSquare, Database, BarChart3, Cpu, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'chat', label: 'Chatbot', icon: MessageSquare, path: '/' },
  { id: 'ingest', label: 'Document Ingestion', icon: Database, path: '/ingestion' },
  { id: 'dashboard', label: 'Analysis Dashboard', icon: BarChart3, path: '/dashboard' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">KREPS Assistant</h1>
            <p className="text-xs text-muted-foreground">Offline Enterprise AI</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`nav-item w-full ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="glass-panel p-3">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">System Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="pulse-dot" />
            <span className="text-sm text-success">Operational</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            All services running locally
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
