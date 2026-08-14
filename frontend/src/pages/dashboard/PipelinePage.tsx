import { useEffect, useState } from 'react';
import { leadsAPI } from '../../lib/api';
import { Loader2 } from 'lucide-react';

const COLUMNS = [
  { id: 'new', label: 'New', color: 'bg-gray-100 text-gray-600' },
  { id: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  { id: 'qualified', label: 'Qualified', color: 'bg-violet-100 text-violet-700' },
  { id: 'proposal', label: 'Proposal', color: 'bg-amber-100 text-amber-700' },
  { id: 'won', label: 'Won', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'lost', label: 'Lost', color: 'bg-red-100 text-red-600' },
];

function LeadCard({ lead, onMove }: { lead: any; onMove: (id: string, status: string) => void }) {
  const scoreColor = !lead.ai_score ? 'text-gray-400' : lead.ai_score >= 80 ? 'text-red-600' : lead.ai_score >= 50 ? 'text-amber-600' : 'text-gray-500';

  return (
    <div 
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', lead.id)}
      className="bg-white rounded-xl border border-gray-100 p-3 shadow-soft hover:shadow-card transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-charcoal">{lead.name}</p>
          <p className="text-xs text-muted">{lead.company || lead.email}</p>
        </div>
        {lead.ai_score != null && (
          <span className={`text-xs font-bold ${scoreColor}`}>{lead.ai_score}</span>
        )}
      </div>
      <p className="text-xs text-primary-600 font-medium mb-2">{lead.service}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{lead.budget || 'No budget'}</span>
        <select
          value={lead.status}
          onChange={(e) => onMove(lead.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-charcoal bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {COLUMNS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await leadsAPI.list({ limit: 100 });
      setLeads(res.data.leads || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleMove = async (id: string, newStatus: string) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status: newStatus } : l));
    try {
      await leadsAPI.update(id, { status: newStatus });
    } catch {
      fetchLeads(); // revert on error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal">Pipeline</h2>
        <p className="text-sm text-muted">Drag and drop or use the dropdown to move leads through stages</p>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {COLUMNS.map((col) => {
            const colLeads = leads.filter((l) => l.status === col.id);
            return (
              <div 
                key={col.id} 
                className="w-64 flex-shrink-0"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const leadId = e.dataTransfer.getData('text/plain');
                  if (leadId) {
                    handleMove(leadId, col.id);
                  }
                }}
              >
                <div className={`flex items-center justify-between px-3 py-2 rounded-xl mb-3 ${col.color}`}>
                  <span className="text-sm font-bold">{col.label}</span>
                  <span className="text-xs font-bold bg-white/60 rounded-full px-2 py-0.5">
                    {colLeads.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[200px]">
                  {colLeads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} onMove={handleMove} />
                  ))}
                  {colLeads.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center h-full">
                      <p className="text-xs text-muted">Drop here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
