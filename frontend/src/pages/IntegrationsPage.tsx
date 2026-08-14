import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Globe, Cpu, Database, Mail, Webhook, Zap, FileText,
  CheckCircle2, ArrowRight, ExternalLink, Shield, Clock, Code2
} from 'lucide-react';

const INTEGRATIONS = [
  {
    name: 'Groq Llama 3',
    category: 'AI Engine',
    desc: 'Powers all AI capabilities — lead scoring, requirement extraction, and full proposal generation.',
    icon: Cpu,
    color: 'from-emerald-400 to-emerald-600',
    lightBg: 'bg-emerald-50',
    lightText: 'text-emerald-700',
    features: ['Lead scoring (0–100)', 'NLP requirement extraction', 'Proposal generation', 'Actionable recommendations'],
    badge: 'Core',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    status: 'Active',
  },
  {
    name: 'SQLite / MongoDB',
    category: 'Database',
    desc: 'SQLite for quick local development and MongoDB Atlas for production-scale document storage.',
    icon: Database,
    color: 'from-green-400 to-green-600',
    lightBg: 'bg-green-50',
    lightText: 'text-green-700',
    features: ['Document-based storage', 'Lead & proposal records', 'Automation event logs', 'Schema-flexible queries'],
    badge: 'Storage',
    badgeColor: 'bg-green-100 text-green-700',
    status: 'Active',
  },
  {
    name: 'Resend API',
    category: 'Email Delivery',
    desc: 'Production-grade transactional email with 99%+ delivery rates. Sends branded HTML emails with PDF attachments.',
    icon: Mail,
    color: 'from-violet-400 to-violet-600',
    lightBg: 'bg-violet-50',
    lightText: 'text-violet-700',
    features: ['HTML email templates', 'PDF proposal attachment', 'Delivery tracking', '99%+ delivery rate'],
    badge: 'Email',
    badgeColor: 'bg-violet-100 text-violet-700',
    status: 'Active',
  },
  {
    name: 'n8n Automation',
    category: 'Workflow Automation',
    desc: 'No-code workflow automation that connects Nexocube with hundreds of external tools via pre-built nodes.',
    icon: Webhook,
    color: 'from-red-400 to-rose-600',
    lightBg: 'bg-red-50',
    lightText: 'text-red-700',
    features: ['Pre-built n8n workflow', 'Webhook trigger node', 'Custom action chains', 'Multi-step automation'],
    badge: 'Automation',
    badgeColor: 'bg-red-100 text-red-700',
    status: 'Active',
  },
  {
    name: 'ReportLab PDF',
    category: 'Document Generation',
    desc: 'Professional PDF proposal generation with custom layout, branding, tables, and multi-section document structure.',
    icon: FileText,
    color: 'from-blue-400 to-blue-600',
    lightBg: 'bg-blue-50',
    lightText: 'text-blue-700',
    features: ['Multi-section proposals', 'Tables & formatted lists', 'Custom branding & logo', 'Phase timeline charts'],
    badge: 'PDF',
    badgeColor: 'bg-blue-100 text-blue-700',
    status: 'Active',
  },
  {
    name: 'FastAPI',
    category: 'Backend Framework',
    desc: 'High-performance Python REST API with async support, automatic OpenAPI docs, and Pydantic validation.',
    icon: Zap,
    color: 'from-amber-400 to-amber-600',
    lightBg: 'bg-amber-50',
    lightText: 'text-amber-700',
    features: ['Async REST endpoints', 'OpenAPI / Swagger docs', 'Pydantic data validation', 'JWT middleware'],
    badge: 'API',
    badgeColor: 'bg-amber-100 text-amber-700',
    status: 'Active',
  },
];

const WEBHOOK_PAYLOAD = `{
  "name": "John Smith",
  "email": "john@fashionhub.com",
  "company": "FashionHub",
  "project_type": "E-commerce Platform",
  "budget": "1,50,000",
  "timeline": "2 months",
  "message": "Need a full-stack e-commerce 
  platform with payment gateway..."
}`;

const API_ENDPOINTS = [
  { method: 'POST', path: '/api/leads', desc: 'Create new lead', color: 'bg-emerald-100 text-emerald-700' },
  { method: 'GET', path: '/api/leads', desc: 'List all leads', color: 'bg-blue-100 text-blue-700' },
  { method: 'POST', path: '/api/leads/{id}/qualify', desc: 'Trigger AI scoring', color: 'bg-violet-100 text-violet-700' },
  { method: 'POST', path: '/api/proposals/generate', desc: 'Generate proposal', color: 'bg-amber-100 text-amber-700' },
  { method: 'POST', path: '/api/proposals/{id}/send-email', desc: 'Send proposal email', color: 'bg-pink-100 text-pink-700' },
  { method: 'POST', path: '/api/webhooks/lead', desc: 'Webhook intake endpoint', color: 'bg-red-100 text-red-700' },
];

export default function IntegrationsPage() {
  const [activeIntg, setActiveIntg] = useState(0);
  const intg = INTEGRATIONS[activeIntg];
  const Icon = intg.icon;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-primary-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-20 left-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl opacity-40" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-200 mb-6">
            <Globe size={14} className="text-primary-500" />
            Seamless Integrations
          </span>
          <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-charcoal mb-6 leading-tight">
            Powered by{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">
              Best-in-Class APIs
            </span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
            Nexocube is built on a battle-tested technology stack — each integration chosen for reliability, performance, and developer experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/demo" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-400 text-charcoal font-bold rounded-full hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5">
              <Zap size={18} /> Try Live Demo
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-charcoal font-semibold rounded-full border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
              How It Works <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTEGRATION EXPLORER ──────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-charcoal mb-3">Integration Details</h2>
            <p className="text-muted">Click any integration to explore how it fits into the workflow</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-3 mb-8">
            {INTEGRATIONS.map((item, i) => {
              const ItemIcon = item.icon;
              const isActive = i === activeIntg;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveIntg(i)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-white border-primary-300 shadow-elevated'
                      : 'bg-white border-gray-100 shadow-soft hover:shadow-card hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 ${isActive ? 'scale-110' : ''} transition-transform`}>
                    <ItemIcon size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-charcoal text-sm truncate">{item.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${item.badgeColor}`}>{item.badge}</span>
                    </div>
                    <p className="text-xs text-muted truncate">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-emerald-600 font-medium">{item.status}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active detail panel */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-elevated p-8 lg:p-10">
              <div className="flex items-start gap-5 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${intg.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon size={28} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-2xl font-extrabold text-charcoal">{intg.name}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${intg.badgeColor}`}>{intg.badge}</span>
                  </div>
                  <p className={`text-sm font-semibold ${intg.lightText}`}>{intg.category}</p>
                </div>
              </div>

              <p className="text-muted leading-relaxed mb-8">{intg.desc}</p>

              <div className="space-y-3 mb-8">
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Capabilities</p>
                {intg.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-charcoal">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${intg.color} flex items-center justify-center flex-shrink-0`}>
                      <CheckCircle2 size={11} className="text-white" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-emerald-600 font-semibold">Connected & Active</span>
              </div>
            </div>

            {/* Stack diagram */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Architecture Position</p>
                <div className="space-y-2">
                  {[
                    { label: 'Client (React + Vite)', active: false, layer: 'Frontend' },
                    { label: 'FastAPI REST Backend', active: false, layer: 'API Layer' },
                    { label: intg.name, active: true, layer: intg.category },
                    { label: 'SQLite / MongoDB', active: false, layer: 'Database' },
                  ].map((layer) => (
                    <div
                      key={layer.label}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                        layer.active
                          ? `bg-gradient-to-r ${intg.color} border-transparent`
                          : 'bg-gray-50 border-gray-100'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${layer.active ? 'text-white' : 'text-charcoal'}`}>{layer.label}</span>
                      <span className={`text-xs ${layer.active ? 'text-white/70' : 'text-muted'}`}>{layer.layer}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech specs */}
              <div className="bg-charcoal rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 size={16} className="text-primary-400" />
                  <p className="text-sm font-bold text-primary-400">Tech Details</p>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-500">Integration</span>
                    <span>{intg.name}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-500">Type</span>
                    <span>{intg.category}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-500">Status</span>
                    <span className="text-emerald-400">● {intg.status}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span className="text-gray-500">Auth</span>
                    <span>Bearer Token / API Key</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WEBHOOK & API SECTION ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-charcoal mb-3">REST API & Webhooks</h2>
            <p className="text-muted max-w-xl mx-auto">Connect any external system in minutes. Nexocube exposes a clean, documented REST API and accepts webhooks from n8n, Zapier, and custom apps.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Webhook payload */}
            <div>
              <h3 className="font-display font-bold text-xl text-charcoal mb-4 flex items-center gap-2">
                <Webhook size={20} className="text-primary-500" />
                Webhook Payload Example
              </h3>
              <div className="bg-charcoal rounded-2xl overflow-hidden shadow-elevated">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-gray-400 text-xs ml-2 font-mono">POST /api/webhooks/lead</span>
                  </div>
                  <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2.5 py-1 rounded-full font-semibold">200 OK</span>
                </div>
                <pre className="p-5 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed">
                  {WEBHOOK_PAYLOAD}
                </pre>
              </div>

              <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <Shield size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-700">Webhook Authentication</p>
                  <p className="text-xs text-amber-600 mt-0.5">All webhook requests must include a Bearer token in the Authorization header. Requests without valid tokens return 401 Unauthorized.</p>
                </div>
              </div>
            </div>

            {/* API endpoints */}
            <div>
              <h3 className="font-display font-bold text-xl text-charcoal mb-4 flex items-center gap-2">
                <Code2 size={20} className="text-primary-500" />
                Available Endpoints
              </h3>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-elevated overflow-hidden">
                {API_ENDPOINTS.map((ep, i) => (
                  <div key={ep.path} className={`flex items-center gap-3 p-4 ${i < API_ENDPOINTS.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md font-mono flex-shrink-0 ${ep.color}`}>{ep.method}</span>
                    <code className="text-sm font-mono text-charcoal flex-1 truncate">{ep.path}</code>
                    <span className="text-xs text-muted flex-shrink-0">{ep.desc}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-3 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                <ExternalLink size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-primary-700">Interactive API Docs</p>
                  <p className="text-xs text-primary-600 mt-0.5">FastAPI auto-generates Swagger UI docs at <code className="font-mono bg-primary-100 px-1 rounded">/docs</code> and ReDoc at <code className="font-mono bg-primary-100 px-1 rounded">/redoc</code>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK OVERVIEW ───────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-charcoal mb-3">Full Technology Stack</h2>
            <p className="text-muted">Every layer of the platform, explained</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                layer: 'Frontend',
                color: 'from-blue-400 to-blue-600',
                items: ['React 18 + TypeScript', 'Vite build system', 'Tailwind CSS v3', 'React Router v6', 'Recharts analytics', 'Lucide Icons'],
              },
              {
                layer: 'Backend',
                color: 'from-emerald-400 to-emerald-600',
                items: ['Python 3.11+', 'FastAPI + Uvicorn', 'Pydantic v2 validation', 'SQLite / Motor (MongoDB)', 'python-jose JWT', 'bcrypt password hashing'],
              },
              {
                layer: 'AI & Automation',
                color: 'from-violet-400 to-violet-600',
                items: ['Groq Llama 3', 'Custom prompt engineering', 'n8n workflow automation', 'Webhook event handling', 'SMTP email API', 'ReportLab PDF engine'],
              },
              {
                layer: 'Infrastructure',
                color: 'from-amber-400 to-amber-600',
                items: ['SQLite (dev) / MongoDB Atlas (prod)', 'Environment-based config', 'CORS middleware', 'Auto OpenAPI documentation', 'Health check endpoints', 'Docker ready'],
              },
            ].map((stack) => (
              <div key={stack.layer} className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                <div className={`bg-gradient-to-r ${stack.color} p-4`}>
                  <p className="text-white font-bold">{stack.layer}</p>
                </div>
                <div className="p-5 space-y-2">
                  {stack.items.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-charcoal">
                      <CheckCircle2 size={14} className="text-primary-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-charcoal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Ready to Connect Your Stack?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Everything is pre-configured. Just clone the repo, set your API keys, and you're live.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/demo" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-400 text-charcoal font-bold rounded-full hover:bg-primary-300 transition-all">
              <Zap size={18} /> Try Live Demo
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all">
              See How It Works <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
