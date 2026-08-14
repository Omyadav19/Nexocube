import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI, automationAPI } from '../../lib/api';
import {
  Users, FileText, TrendingUp, Target, CheckCircle2,
  Flame, Zap, ArrowRight, Clock
} from 'lucide-react';

function StatCard({ title, value, icon: Icon, color, sub }: any) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-display font-extrabold text-charcoal mb-1">{value ?? '—'}</p>
      <p className="text-sm text-muted">{title}</p>
      {sub && <p className="text-xs text-emerald-600 mt-1 font-medium">{sub}</p>}
    </div>
  );
}

function LogRow({ log }: { log: any }) {
  const statusColor = log.status === 'success' ? 'bg-emerald-500' : 'bg-red-500';
  const date = log.created_at ? new Date(log.created_at).toLocaleString() : '';

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-charcoal capitalize">
          {log.event?.replace(/_/g, ' ')}
        </p>
        <p className="text-xs text-muted truncate">{log.message}</p>
      </div>
      <span className="text-xs text-muted whitespace-nowrap">{date}</span>
    </div>
  );
}

export default function DashboardHome() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsAPI.get(), automationAPI.getLogs()])
      .then(([aRes, lRes]) => {
        setAnalytics(aRes.data);
        setLogs(lRes.data.logs?.slice(0, 8) || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const s = analytics?.summary || {};

  const STATS = [
    { title: 'Total Leads', value: s.total_leads, icon: Users, color: 'bg-primary-600' },
    { title: 'Hot Leads', value: s.hot_leads, icon: Flame, color: 'bg-red-500' },
    { title: 'Qualified Leads', value: s.qualified_leads, icon: Target, color: 'bg-emerald-500' },
    { title: 'Total Proposals', value: s.total_proposals, icon: FileText, color: 'bg-violet-500' },
    { title: 'Deals Won', value: s.won_leads, icon: CheckCircle2, color: 'bg-amber-500' },
    { title: 'Conversion Rate', value: s.conversion_rate != null ? `${s.conversion_rate}%` : null, icon: TrendingUp, color: 'bg-blue-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">Overview</h2>
          <p className="text-muted text-sm mt-1">Real-time data from MongoDB</p>
        </div>
        <Link to="/demo" className="btn-primary text-sm">
          <Zap size={14} />
          Submit Test Lead
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Automation Logs */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-charcoal">Recent Automation</h3>
            <Link to="/dashboard/automation" className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <Zap size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No automation logs yet.</p>
              <p className="text-xs mt-1">Submit a lead to start the automation pipeline.</p>
            </div>
          ) : (
            <div>
              {logs.map((log, i) => <LogRow key={i} log={log} />)}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'View All Leads', desc: 'Manage and qualify leads', to: '/dashboard/leads', icon: Users, color: 'bg-primary-50 text-primary-600' },
              { label: 'View Proposals', desc: 'Review and send proposals', to: '/dashboard/proposals', icon: FileText, color: 'bg-violet-50 text-violet-600' },
              { label: 'Pipeline Board', desc: 'Drag-drop Kanban view', to: '/dashboard/pipeline', icon: Target, color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Analytics', desc: 'Charts and conversion metrics', to: '/dashboard/analytics', icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.to} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-charcoal">{item.label}</p>
                    <p className="text-xs text-muted">{item.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-muted group-hover:text-primary-600 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
