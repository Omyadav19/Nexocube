import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { proposalsAPI } from '../../lib/api';
import { FileText, Eye, Download } from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: 'bg-gray-50 text-gray-600 border-gray-200',
    sent: 'bg-blue-50 text-blue-600 border-blue-100',
    accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rejected: 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <span className={`badge border capitalize ${map[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const LIMIT = 15;

  useEffect(() => {
    proposalsAPI.list({ page, limit: LIMIT })
      .then((res) => {
        setProposals(res.data.proposals || []);
        setTotal(res.data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const handleDownload = async (id: string, title: string) => {
    try {
      const res = await proposalsAPI.downloadPdf(id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">Proposals</h2>
          <p className="text-sm text-muted">{total} proposals generated</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-muted mb-2">No proposals yet.</p>
            <p className="text-sm text-muted">Go to a lead and click "Generate Proposal".</p>
            <Link to="/dashboard/leads" className="btn-primary mt-4 text-sm inline-flex">View Leads</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-th">Title</th>
                  <th className="table-th">Budget</th>
                  <th className="table-th">Timeline</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Created</th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {proposals.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                          <FileText size={14} className="text-violet-600" />
                        </div>
                        <div>
                          <p className="font-medium text-charcoal text-sm">{p.title || 'Untitled Proposal'}</p>
                          <p className="text-xs text-muted">Lead: {p.lead_id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td text-sm">{p.budget || '—'}</td>
                    <td className="table-td text-sm">{p.timeline || '—'}</td>
                    <td className="table-td"><StatusBadge status={p.status} /></td>
                    <td className="table-td text-xs text-muted">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboard/proposals/${p.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                        >
                          <Eye size={12} /> View
                        </Link>
                        <button
                          onClick={() => handleDownload(p.id, p.title || 'proposal')}
                          className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-charcoal"
                        >
                          <Download size={12} /> PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
