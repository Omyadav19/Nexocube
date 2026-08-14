import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { proposalsAPI } from '../../lib/api';
import { ArrowLeft, Download, Send, Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    proposalsAPI.get(id)
      .then((r) => setProposal(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSend = async () => {
    if (!id) return;
    setSending(true);
    setMessage(null);
    try {
      await proposalsAPI.send(id);
      setMessage({ type: 'success', text: 'Proposal sent to client email successfully!' });
      const r = await proposalsAPI.get(id);
      setProposal(r.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to send email.' });
    } finally {
      setSending(false);
    }
  };

  const handleAccept = async () => {
    if (!id) return;
    setAccepting(true);
    setMessage(null);
    try {
      await proposalsAPI.update(id, { status: 'accepted' });
      setMessage({ type: 'success', text: 'Proposal accepted! Project marked as Won.' });
      const r = await proposalsAPI.get(id);
      setProposal(r.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update proposal.' });
    } finally {
      setAccepting(false);
    }
  };

  const handleDownload = async () => {
    if (!id) return;
    setDownloading(true);
    try {
      const res = await proposalsAPI.downloadPdf(id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proposal_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage({ type: 'error', text: 'Failed to download PDF.' });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  if (!proposal) return <div className="text-center py-12 text-muted">Proposal not found.</div>;

  const content = proposal.content || {};

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/dashboard/proposals" className="btn-ghost text-sm"><ArrowLeft size={14} /> Proposals</Link>
      </div>

      {/* Header card */}
      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
              <FileText size={22} className="text-violet-600" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-charcoal">{proposal.title || 'Project Proposal'}</h2>
              <p className="text-sm text-muted">
                Status: <span className="font-medium capitalize text-charcoal">{proposal.status}</span>
                {' · '} Created {new Date(proposal.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-charcoal text-sm font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50"
            >
              {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Download PDF
            </button>
            <button
              onClick={handleSend}
              disabled={sending || proposal.status === 'sent' || proposal.status === 'accepted'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50"
            >
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {proposal.status === 'sent' ? 'Already Sent' : 'Send to Client'}
            </button>
            <button
              onClick={handleAccept}
              disabled={accepting || proposal.status === 'accepted'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
            >
              {accepting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              {proposal.status === 'accepted' ? 'Accepted' : 'Mark as Accepted'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`flex items-center gap-2 mt-4 p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {message.text}
          </div>
        )}

        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
          ⚠ {content.disclaimer || 'AI-generated preliminary estimate — requires human review.'}
        </div>
      </div>

      {/* Summary */}
      {(content.executive_summary || proposal.summary) && (
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-3">Executive Summary</h3>
          <p className="text-sm text-charcoal leading-relaxed">{content.executive_summary || proposal.summary}</p>
        </div>
      )}

      {/* Scope */}
      {(content.scope || proposal.scope) && (
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-3">Project Scope</h3>
          <p className="text-sm text-charcoal leading-relaxed">{content.scope || proposal.scope}</p>
        </div>
      )}

      {/* Timeline & Budget */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card text-center">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Timeline</p>
          <p className="text-2xl font-display font-bold text-primary-600">{content.timeline || proposal.timeline || '—'}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Budget Estimate</p>
          <p className="text-2xl font-display font-bold text-violet-600">{content.budget_range || proposal.budget || '—'}</p>
        </div>
      </div>

      {/* Features */}
      {(content.features || proposal.features)?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-3">Features</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {(content.features || proposal.features).map((f: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm text-charcoal">
                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" /> {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {(content.technology || proposal.technology)?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-3">Technology Stack</h3>
          <div className="flex flex-wrap gap-2">
            {(content.technology || proposal.technology).map((t: string, i: number) => (
              <span key={i} className="badge-primary">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Phases */}
      {content.phases?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-4">Development Phases</h3>
          <div className="space-y-3">
            {content.phases.map((phase: any, i: number) => (
              <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{phase.phase}</p>
                  <p className="text-xs text-muted mb-1">{phase.duration}</p>
                  <p className="text-xs text-charcoal">{phase.deliverables?.join(' · ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {content.next_steps?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-charcoal mb-3">Next Steps</h3>
          <ol className="space-y-2">
            {content.next_steps.map((step: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-sm text-charcoal">
                <span className="w-6 h-6 bg-primary-50 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
