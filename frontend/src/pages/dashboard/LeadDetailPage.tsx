import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leadsAPI, automationAPI } from '../../lib/api';
import {
  ArrowLeft, Brain, FileText, Mail, CheckCircle2,
  AlertCircle, Loader2, Zap, RefreshCw
} from 'lucide-react';

function ActionBtn({ onClick, loading, disabled, icon: Icon, label, variant = 'primary' }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
        variant === 'primary'
          ? 'bg-primary-600 text-white hover:bg-primary-700'
          : variant === 'emerald'
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'bg-gray-100 text-charcoal hover:bg-gray-200'
      }`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
      {label}
    </button>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#ef4444' : score >= 50 ? '#f59e0b' : '#94a3b8';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-extrabold text-charcoal leading-none">{score}</p>
        <p className="text-xs text-muted">/100</p>
      </div>
    </div>
  );
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    if (!id) return;
    try {
      const [leadRes, logsRes] = await Promise.all([
        leadsAPI.get(id),
        automationAPI.getLogs(id),
      ]);
      setLead(leadRes.data);
      setLogs(logsRes.data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const runAction = async (action: string, apiFn: () => Promise<any>) => {
    setActionLoading(action);
    setMessage(null);
    try {
      await apiFn();
      setMessage({ type: 'success', text: `${action} completed successfully!` });
      await fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.detail || `${action} failed.` });
    } finally {
      setActionLoading(null);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!id) return;
    await leadsAPI.update(id, { status: newStatus });
    await fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!lead) {
    return <div className="text-center py-12 text-muted">Lead not found.</div>;
  }

  const categoryColor = lead.ai_category === 'Hot' ? 'text-red-600' : lead.ai_category === 'Warm' ? 'text-amber-600' : 'text-slate-500';

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard/leads" className="btn-ghost text-sm">
          <ArrowLeft size={14} /> Back to Leads
        </Link>
      </div>

      {/* Header */}
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-charcoal">{lead.name}</h2>
            <p className="text-muted">{lead.email} {lead.phone && `• ${lead.phone}`}</p>
            <p className="text-sm text-primary-600 font-medium mt-1">{lead.company} — {lead.service}</p>
          </div>

          {/* Status selector */}
          <select
            value={lead.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="input py-2 text-sm w-40"
          >
            {['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Alert */}
        {message && (
          <div className={`flex items-center gap-2 mt-4 p-3 rounded-xl text-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {message.text}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-5">
          <ActionBtn
            onClick={() => runAction('AI Analysis', () => leadsAPI.analyze(id!))}
            loading={actionLoading === 'AI Analysis'}
            icon={Brain}
            label="Analyze Lead"
            variant="primary"
          />
          <ActionBtn
            onClick={() => runAction('Requirements', () => leadsAPI.extractRequirements(id!))}
            loading={actionLoading === 'Requirements'}
            icon={Zap}
            label="Extract Requirements"
            variant="primary"
          />
          <ActionBtn
            onClick={() => runAction('Proposal', () => leadsAPI.generateProposal(id!))}
            loading={actionLoading === 'Proposal'}
            icon={FileText}
            label="Generate Proposal"
            variant="emerald"
          />
          <ActionBtn
            onClick={fetchData}
            loading={false}
            icon={RefreshCw}
            label="Refresh"
            variant="ghost"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Score */}
        {lead.ai_score != null && (
          <div className="card flex flex-col items-center text-center">
            <ScoreRing score={lead.ai_score} />
            <div className="mt-3">
              <p className={`text-xl font-bold ${categoryColor}`}>
                {lead.ai_category === 'Hot' ? '🔥' : lead.ai_category === 'Warm' ? '🌡' : '❄'} {lead.ai_category}
              </p>
              <p className="text-sm text-muted">Priority: {lead.ai_priority}</p>
            </div>
          </div>
        )}

        {/* Project Info */}
        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-charcoal mb-3">Project Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3"><span className="text-muted w-24 flex-shrink-0">Service</span><span className="text-charcoal font-medium">{lead.service}</span></div>
            <div className="flex gap-3"><span className="text-muted w-24 flex-shrink-0">Budget</span><span className="text-charcoal">{lead.budget || '—'}</span></div>
            <div className="flex gap-3"><span className="text-muted w-24 flex-shrink-0">Timeline</span><span className="text-charcoal">{lead.timeline || '—'}</span></div>
            <div className="flex gap-3"><span className="text-muted w-24 flex-shrink-0">Status</span><span className="capitalize font-medium text-primary-600">{lead.status}</span></div>
          </div>
          <p className="text-sm text-muted bg-gray-50 rounded-lg p-3 mt-4">{lead.description}</p>
        </div>
      </div>

      {/* AI Summary */}
      {lead.ai_summary && (
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
            <Brain size={16} className="text-primary-600" /> AI Summary
          </h3>
          <p className="text-sm text-charcoal italic bg-primary-50 p-3 rounded-lg">{lead.ai_summary}</p>

          {lead.ai_recommendation && (
            <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 mb-1">💡 Recommended Action</p>
              <p className="text-sm text-emerald-700">{lead.ai_recommendation}</p>
            </div>
          )}
        </div>
      )}

      {/* Requirements */}
      {lead.ai_requirements?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-3">Extracted Requirements</h3>
          <div className="flex flex-wrap gap-2">
            {lead.ai_requirements.map((req: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-1 text-sm bg-primary-50 text-primary-700 border border-primary-100 rounded-lg px-3 py-1">
                <CheckCircle2 size={12} /> {req}
              </span>
            ))}
          </div>

          {lead.requirements_data && (
            <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted font-semibold mb-1">Project Type</p>
                <p className="text-charcoal">{lead.requirements_data.project_type}</p>
              </div>
              <div>
                <p className="text-muted font-semibold mb-1">Complexity</p>
                <p className="text-charcoal">{lead.requirements_data.complexity}</p>
              </div>
              <div>
                <p className="text-muted font-semibold mb-1">Tech Stack</p>
                <p className="text-charcoal">{lead.requirements_data.recommended_stack?.join(', ')}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Automation Logs */}
      {logs.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-3">Automation History</h3>
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.status === 'success' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal capitalize">{log.event?.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted">{log.message}</p>
                </div>
                <span className="text-xs text-muted">{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
