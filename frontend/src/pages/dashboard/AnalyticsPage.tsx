import { useEffect, useState } from 'react';
import { analyticsAPI } from '../../lib/api';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { RefreshCw, TrendingUp } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#94a3b8', '#6366f1', '#10b981', '#8b5cf6'];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await analyticsAPI.get();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const s = data?.summary || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">Analytics</h2>
          <p className="text-sm text-muted">Real-time metrics from MongoDB</p>
        </div>
        <button onClick={fetch} className="btn-ghost text-sm"><RefreshCw size={14} /> Refresh</button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: s.total_leads, color: 'text-primary-600' },
          { label: 'Conversion Rate', value: `${s.conversion_rate || 0}%`, color: 'text-emerald-600' },
          { label: 'Email Success', value: `${s.email_success_rate || 0}%`, color: 'text-blue-600' },
          { label: 'Proposals Sent', value: s.sent_proposals, color: 'text-violet-600' },
        ].map((kpi) => (
          <div key={kpi.label} className="card text-center">
            <p className={`text-3xl font-display font-extrabold ${kpi.color} mb-1`}>{kpi.value ?? '0'}</p>
            <p className="text-sm text-muted">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leads over time */}
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-4">Leads Over Time (Last 30 Days)</h3>
          {data?.leads_over_time?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.leads_over_time}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-muted text-sm">
              No data yet. Submit leads to see the trend.
            </div>
          )}
        </div>

        {/* Lead quality */}
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-4">Lead Quality Distribution</h3>
          {data?.lead_quality?.some((d: any) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data.lead_quality}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {data.lead_quality.map((entry: any, i: number) => (
                    <Cell key={i} fill={entry.color || COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-muted text-sm">
              Run AI analysis on leads to see quality distribution.
            </div>
          )}
        </div>

        {/* Leads by service */}
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-4">Leads by Service</h3>
          {data?.leads_by_service?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.leads_by_service} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-muted text-sm">No service data yet.</div>
          )}
        </div>

        {/* Proposal status */}
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-4">Proposal Status</h3>
          {data?.proposal_status?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.proposal_status}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]}>
                  {data.proposal_status.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-muted text-sm">No proposals yet.</div>
          )}
        </div>
      </div>

      {/* AI Scores table */}
      {data?.recent_scores?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-600" />
            Recent AI Lead Scores
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-th">Lead Name</th>
                  <th className="table-th">AI Score</th>
                  <th className="table-th">Score Bar</th>
                  <th className="table-th">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recent_scores.map((s: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="table-td font-medium">{s.name}</td>
                    <td className="table-td">
                      <span className={`font-bold ${s.score >= 80 ? 'text-red-600' : s.score >= 50 ? 'text-amber-600' : 'text-slate-500'}`}>
                        {s.score}
                      </span>
                    </td>
                    <td className="table-td w-40">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-emerald-500"
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                    </td>
                    <td className="table-td text-muted text-xs">
                      {s.date ? new Date(s.date).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
