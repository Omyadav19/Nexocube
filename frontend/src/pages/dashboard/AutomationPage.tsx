import { useEffect, useState } from 'react';
import { automationAPI } from '../../lib/api';
import { Zap, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

const EVENT_LABELS: Record<string, { label: string; icon: string }> = {
  lead_received: { label: 'Lead Received', icon: '📥' },
  webhook_lead_received: { label: 'Webhook Lead', icon: '🔗' },
  ai_analysis_completed: { label: 'AI Analysis Completed', icon: '🧠' },
  ai_analysis_failed: { label: 'AI Analysis Failed', icon: '❌' },
  requirements_extracted: { label: 'Requirements Extracted', icon: '📋' },
  requirements_failed: { label: 'Requirements Failed', icon: '❌' },
  proposal_generated: { label: 'Proposal Generated', icon: '📄' },
  proposal_failed: { label: 'Proposal Failed', icon: '❌' },
  email_sent: { label: 'Email Sent', icon: '📧' },
  email_failed: { label: 'Email Failed', icon: '❌' },
  status_updated: { label: 'Status Updated', icon: '🔄' },
};

export default function AutomationPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await automationAPI.getLogs();
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const groups = logs.reduce<Record<string, any[]>>((acc, log) => {
    const date = new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">Automation Logs</h2>
          <p className="text-sm text-muted">{logs.length} events logged</p>
        </div>
        <button onClick={fetchLogs} className="btn-ghost text-sm">
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Pipeline diagram */}
      <div className="card">
        <h3 className="font-semibold text-charcoal mb-4">Automation Pipeline</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {[
            'Lead Received', 'MongoDB Stored', 'AI Analysis', 'Requirements', 'Proposal', 'PDF Generated', 'Email Sent', 'CRM Updated'
          ].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-lg text-xs font-semibold">
                {step}
              </span>
              {i < arr.length - 1 && <span className="text-muted text-lg">→</span>}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : logs.length === 0 ? (
        <div className="card text-center py-12">
          <Zap size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-muted">No automation logs yet.</p>
          <p className="text-sm text-muted mt-1">Submit a lead via the Demo page to see the automation pipeline in action.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([date, dayLogs]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-muted" />
                  <span className="text-xs font-semibold text-muted">{date}</span>
                </div>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="space-y-2">
                {dayLogs.map((log, i) => {
                  const meta = EVENT_LABELS[log.event] || { label: log.event?.replace(/_/g, ' '), icon: '⚡' };
                  const isSuccess = log.status === 'success';

                  return (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-soft hover:shadow-card transition-all">
                      <div className="text-xl flex-shrink-0 mt-0.5">{meta.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-charcoal capitalize">{meta.label}</p>
                          {isSuccess ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                          ) : (
                            <XCircle size={14} className="text-red-400" />
                          )}
                        </div>
                        <p className="text-sm text-muted">{log.message}</p>
                        {log.lead_id && (
                          <p className="text-xs text-muted mt-1">Lead: {log.lead_id}</p>
                        )}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(log.metadata).slice(0, 3).map(([k, v]) => (
                              <span key={k} className="text-xs bg-gray-50 text-muted border border-gray-100 rounded px-2 py-0.5">
                                {k}: {String(v)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted whitespace-nowrap flex-shrink-0">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
