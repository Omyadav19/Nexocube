import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Brain, FileText, BarChart3, Webhook, Database, Shield,
  Clock, Mail, Star, CheckCircle2, ArrowRight, Zap, Users,
  TrendingUp, Lock, Bell, ChevronDown
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Lead Scoring',
    badge: 'Core AI',
    badgeColor: 'bg-primary-100 text-primary-700',
    desc: 'Llama 3 analyzes every inquiry and scores it 0–100 based on budget clarity, requirement detail, timeline realism, and buying intent.',
    details: ['Real-time scoring in < 2 seconds', 'Multi-factor analysis (budget, clarity, intent)', 'HOT / WARM / COLD classification', 'Actionable recommendation per lead'],
    color: 'from-primary-400 to-primary-600',
    lightColor: 'bg-primary-50 text-primary-600',
    stat: '< 2s',
    statLabel: 'Analysis time',
  },
  {
    icon: FileText,
    title: 'Proposal Generation',
    badge: 'AI Powered',
    badgeColor: 'bg-violet-100 text-violet-700',
    desc: 'Full project proposals generated in seconds — executive summary, scope, feature list, user roles, tech stack, dev phases, timeline, and budget estimate.',
    details: ['Executive Summary & Scope', 'Feature List & User Roles', 'Tech Stack Recommendations', 'Phase-wise Timeline & Budget'],
    color: 'from-violet-400 to-violet-600',
    lightColor: 'bg-violet-50 text-violet-600',
    stat: '60s',
    statLabel: 'Proposal ready',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    badge: 'Dashboard',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    desc: 'Live dashboard with conversion rates, lead quality trends, pipeline stage overview, and revenue forecasting — all in one view.',
    details: ['Conversion funnel tracking', 'Lead quality over time', 'Pipeline stage breakdown', 'Revenue forecast charts'],
    color: 'from-emerald-400 to-emerald-600',
    lightColor: 'bg-emerald-50 text-emerald-600',
    stat: 'Live',
    statLabel: 'Data refresh',
  },
  {
    icon: Webhook,
    title: 'Webhook Integration',
    badge: 'Automation',
    badgeColor: 'bg-amber-100 text-amber-700',
    desc: 'Accept leads from any external system — n8n, Zapier, website forms, or custom apps — via a secure, authenticated webhook endpoint.',
    details: ['Bearer token authentication', 'n8n & Zapier compatible', 'Custom payload support', 'Real-time event processing'],
    color: 'from-amber-400 to-amber-600',
    lightColor: 'bg-amber-50 text-amber-600',
    stat: '∞',
    statLabel: 'Source systems',
  },
  {
    icon: Database,
    title: 'Built-in CRM',
    badge: 'Pipeline',
    badgeColor: 'bg-blue-100 text-blue-700',
    desc: 'Full Kanban pipeline management — New, Contacted, Qualified, Proposal Sent, Won, Lost — with drag-and-drop stage management.',
    details: ['6-stage Kanban pipeline', 'Lead detail tracking', 'Status history & audit trail', 'Follow-up reminders'],
    color: 'from-blue-400 to-blue-600',
    lightColor: 'bg-blue-50 text-blue-600',
    stat: '6',
    statLabel: 'Pipeline stages',
  },
  {
    icon: Mail,
    title: 'Email Automation',
    badge: 'Delivery',
    badgeColor: 'bg-pink-100 text-pink-700',
    desc: 'Proposals sent automatically via Resend API with beautiful branded HTML email templates and a professional PDF attachment.',
    details: ['Branded HTML templates', 'PDF proposal attachment', 'Delivery status tracking', 'Resend API powered'],
    color: 'from-pink-400 to-pink-600',
    lightColor: 'bg-pink-50 text-pink-600',
    stat: '99%',
    statLabel: 'Delivery rate',
  },
  {
    icon: Shield,
    title: 'JWT Authentication',
    badge: 'Security',
    badgeColor: 'bg-slate-100 text-slate-700',
    desc: 'Secure admin dashboard with bcrypt password hashing, JWT token-based authentication, and protected API routes.',
    details: ['JWT access tokens', 'Bcrypt password hashing', 'Protected API routes', 'Session management'],
    color: 'from-slate-500 to-slate-700',
    lightColor: 'bg-slate-50 text-slate-600',
    stat: '256-bit',
    statLabel: 'Encryption',
  },
  {
    icon: Clock,
    title: 'Automation Logs',
    badge: 'Audit',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    desc: 'Full audit trail of every AI action, email sent, webhook received, and status change — timestamped and searchable for compliance.',
    details: ['Full event audit trail', 'AI action logging', 'Email delivery logs', 'Timestamped entries'],
    color: 'from-indigo-400 to-indigo-600',
    lightColor: 'bg-indigo-50 text-indigo-600',
    stat: '100%',
    statLabel: 'Events logged',
  },
];

const COMPARISON = [
  { feature: 'AI Lead Scoring', manual: false, nexocube: true },
  { feature: 'Instant Proposal Generation', manual: false, nexocube: true },
  { feature: 'Automated Email Delivery', manual: false, nexocube: true },
  { feature: 'Real-time Analytics Dashboard', manual: false, nexocube: true },
  { feature: 'Webhook Integrations', manual: false, nexocube: true },
  { feature: 'Automation Audit Logs', manual: false, nexocube: true },
  { feature: 'Zero manual data entry', manual: false, nexocube: true },
  { feature: 'Proposal turnaround < 60s', manual: false, nexocube: true },
];

export default function FeaturesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-200 mb-6">
            <Star size={14} className="fill-primary-400 text-primary-400" />
            Full Feature Suite
          </span>
          <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-charcoal mb-6 leading-tight">
            Everything You Need to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">
              Close More Deals
            </span>
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto mb-10 leading-relaxed">
            A complete AI-powered sales engine — from the first inquiry to a signed deal. Nexocube replaces hours of manual work with intelligent automation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/demo" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-400 text-charcoal font-bold rounded-full hover:bg-primary-500 transition-all shadow-lg hover:shadow-primary-200/50 hover:shadow-xl hover:-translate-y-0.5">
              <Zap size={18} /> Try Live Demo
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-charcoal font-semibold rounded-full border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
              How It Works <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative max-w-4xl mx-auto px-6 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '8', label: 'Core AI Features', icon: Brain },
            { value: '60s', label: 'Proposal Generation', icon: FileText },
            { value: '99%', label: 'Email Delivery Rate', icon: Mail },
            { value: '∞', label: 'Webhook Sources', icon: Webhook },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 text-center hover:shadow-card transition-shadow">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-primary-600" />
                </div>
                <p className="text-2xl font-display font-extrabold text-charcoal">{s.value}</p>
                <p className="text-xs text-muted mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FEATURE CARDS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-charcoal mb-4">
              Feature Deep-Dive
            </h2>
            <p className="text-muted text-lg">Click any feature to see full details</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              const isOpen = expanded === feature.title;
              return (
                <div
                  key={feature.title}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${isOpen ? 'border-primary-300 shadow-elevated' : 'border-gray-100 shadow-soft hover:shadow-card hover:-translate-y-0.5'
                    }`}
                  onClick={() => setExpanded(isOpen ? null : feature.title)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <Icon size={22} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-bold text-charcoal text-lg">{feature.title}</h3>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${feature.badgeColor}`}>{feature.badge}</span>
                          </div>
                          <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xl font-display font-extrabold text-charcoal">{feature.stat}</p>
                          <p className="text-xs text-muted">{feature.statLabel}</p>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-60' : 'max-h-0'}`}>
                    <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                      <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">What's included</p>
                      <div className="grid grid-cols-2 gap-2">
                        {feature.details.map((d) => (
                          <div key={d} className="flex items-center gap-2 text-sm text-charcoal">
                            <CheckCircle2 size={14} className="text-primary-500 flex-shrink-0" />
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-charcoal mb-4">
              Nexocube vs. Manual Process
            </h2>
            <p className="text-muted text-lg">Stop wasting hours on admin. Automate the sales pipeline.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-elevated overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100">
              <div className="p-5 font-semibold text-muted text-sm">Capability</div>
              <div className="p-5 text-center font-semibold text-muted text-sm border-l border-gray-100">Manual / Traditional</div>
              <div className="p-5 text-center font-bold text-primary-700 text-sm border-l border-primary-100 bg-primary-50">Nexocube ✦</div>
            </div>

            {COMPARISON.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <div className="p-4 text-sm font-medium text-charcoal">{row.feature}</div>
                <div className="p-4 text-center border-l border-gray-100">
                  {row.manual ? (
                    <span className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold">
                      <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500">✕</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold">
                      <span className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center text-red-400">✕</span>
                    </span>
                  )}
                </div>
                <div className="p-4 text-center border-l border-primary-100 bg-primary-50/30">
                  {row.nexocube ? (
                    <CheckCircle2 size={18} className="text-primary-500 mx-auto" />
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-charcoal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap size={28} className="text-charcoal" />
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Ready to Automate Your Sales?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Try the live demo and see every feature in action — no login required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/demo" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-400 text-charcoal font-bold rounded-full hover:bg-primary-300 transition-all">
              <Zap size={18} /> Try Live Demo
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all">
              Access Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
