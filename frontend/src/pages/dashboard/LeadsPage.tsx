import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leadsAPI } from '../../lib/api';
import { Search, Eye, Trash2, AlertTriangle, X } from 'lucide-react';

function ScoreBadge({ score }: { score?: number }) {
  if (!score) return <span className="text-muted text-xs">—</span>;
  const color = score >= 80 ? 'text-red-600 bg-red-50' : score >= 50 ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-50';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
      {score}
    </span>
  );
}

function CategoryBadge({ cat }: { cat?: string }) {
  if (!cat) return <span className="text-muted text-xs">—</span>;
  if (cat === 'Hot') return <span className="badge-hot">🔥 Hot</span>;
  if (cat === 'Warm') return <span className="badge-warm">🌡 Warm</span>;
  return <span className="badge text-slate-500 bg-slate-50 border border-slate-200">❄ Cold</span>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: 'bg-gray-50 text-gray-600 border-gray-200',
    contacted: 'bg-blue-50 text-blue-600 border-blue-100',
    qualified: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    proposal: 'bg-violet-50 text-violet-600 border-violet-100',
    won: 'bg-green-50 text-green-700 border-green-100',
    lost: 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <span className={`badge border capitalize ${map[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState('');
  const [deleting, setDeleting] = useState(false);
  const LIMIT = 15;

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await leadsAPI.list({
        page,
        limit: LIMIT,
        search: search || undefined,
        status: status || undefined,
        category: category || undefined,
      });
      setLeads(res.data.leads || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [page, search, status, category]);

  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      await leadsAPI.delete(confirmDeleteId);
      setConfirmDeleteId(null);
      fetchLeads();
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to delete lead.';
      alert(`Delete failed: ${msg}`);
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">Leads</h2>
          <p className="text-sm text-muted">{total} total leads</p>
        </div>
        <Link to="/demo" className="btn-primary text-sm">+ New Lead</Link>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search leads..."
            className="input pl-9 py-2 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="input py-2 text-sm w-36"
        >
          <option value="">All Status</option>
          {['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="input py-2 text-sm w-36"
        >
          <option value="">All Categories</option>
          <option value="Hot">🔥 Hot</option>
          <option value="Warm">🌡 Warm</option>
          <option value="Cold">❄ Cold</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-th">Name</th>
                <th className="table-th">Company</th>
                <th className="table-th">Service</th>
                <th className="table-th">AI Score</th>
                <th className="table-th">Category</th>
                <th className="table-th">Priority</th>
                <th className="table-th">Status</th>
                <th className="table-th">Created</th>
                <th className="table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="table-td">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-muted">
                    No leads found. <Link to="/demo" className="text-primary-600 hover:underline">Add your first lead →</Link>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-td">
                      <div>
                        <p className="font-medium text-charcoal">{lead.name}</p>
                        <p className="text-xs text-muted">{lead.email}</p>
                      </div>
                    </td>
                    <td className="table-td text-muted">{lead.company || '—'}</td>
                    <td className="table-td">
                      <span className="text-xs bg-gray-100 text-charcoal rounded-md px-2 py-1">{lead.service}</span>
                    </td>
                    <td className="table-td"><ScoreBadge score={lead.ai_score} /></td>
                    <td className="table-td"><CategoryBadge cat={lead.ai_category} /></td>
                    <td className="table-td text-xs text-muted">{lead.ai_priority || '—'}</td>
                    <td className="table-td"><StatusBadge status={lead.status} /></td>
                    <td className="table-td text-xs text-muted">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/dashboard/leads/${lead.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                        >
                          <Eye size={12} /> View
                        </Link>
                        <button
                          onClick={() => { setConfirmDeleteId(lead.id); setConfirmDeleteName(lead.name); }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-muted">
              Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Prev
              </button>
              <span className="text-sm font-medium">{page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">Delete Lead</h3>
                <p className="text-xs text-muted">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to permanently delete <strong className="text-charcoal">{confirmDeleteName}</strong>? All associated proposals and logs will also be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 size={14} />}
                {deleting ? 'Deleting...' : 'Delete Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
