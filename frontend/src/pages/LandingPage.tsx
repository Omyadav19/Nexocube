import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Zap, Brain, FileText, Mail,
  BarChart3, Webhook, Database, Clock, Star,
  Users, TrendingUp, Target, Sparkles, ChevronRight,
  Globe, Cpu, PlayCircle, Building2, ShoppingCart,
  Laptop, Smartphone, Activity
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ─── Animated counter hook ─── */
function useCounter(end: number, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

/* ─── Data ─── */
const WORKFLOW_STEPS = [
  { label: 'New Client Inquiry', detail: 'Rahul Sharma — FashionHub', color: 'bg-primary-500', icon: Users },
  { label: 'AI Analysis Running…', detail: 'Extracting requirements…', color: 'bg-violet-500', icon: Brain },
  { label: '92/100 — 🔥 HOT LEAD', detail: 'High buying intent detected', color: 'bg-emerald-500', icon: Target },
  { label: '6 Requirements Found', detail: 'Auth, Cart, Payment, Admin…', color: 'bg-amber-500', icon: CheckCircle2 },
  { label: 'Proposal Generated', detail: 'E-Commerce Platform, 6–8 wks', color: 'bg-blue-500', icon: FileText },
  { label: 'Email Sent ✓', detail: 'PDF delivered via Resend API', color: 'bg-pink-500', icon: Mail },
];

const STATS = [
  { value: 92, suffix: '%', label: 'AI Accuracy Rate', icon: Star },
  { value: 60, suffix: 's', label: 'Proposal Generated', icon: Clock },
  { value: 10, suffix: 'x', label: 'Faster Qualification', icon: TrendingUp },
  { value: 100, suffix: '%', label: 'Process Automated', icon: Sparkles },
];

const FEATURES_PREVIEW = [
  {
    icon: Brain,
    title: 'AI Lead Scoring',
    desc: 'Llama 3 scores every inquiry 0–100 across 4 dimensions — budget, specificity, timeline & intent.',
    tag: 'Core AI',
    tagColor: 'bg-primary-100 text-primary-700',
    color: 'from-primary-400 to-primary-600',
    bullets: ['Real-time scoring < 2s', 'HOT / WARM / COLD tiers', 'Actionable next-step'],
  },
  {
    icon: FileText,
    title: 'Proposal Generation',
    desc: 'From client inquiry to a polished, professional PDF proposal — automatically in under 60 seconds.',
    tag: 'Automation',
    tagColor: 'bg-violet-100 text-violet-700',
    color: 'from-violet-400 to-violet-600',
    bullets: ['Executive Summary', 'Phase-wise timeline', 'Budget & tech stack'],
  },
  {
    icon: BarChart3,
    title: 'Live Analytics',
    desc: 'Real-time dashboard tracking pipeline health, conversion rates, and lead quality trends.',
    tag: 'Dashboard',
    tagColor: 'bg-emerald-100 text-emerald-700',
    color: 'from-emerald-400 to-emerald-600',
    bullets: ['Conversion funnel', 'Revenue forecast', 'Pipeline stages'],
  },
  {
    icon: Webhook,
    title: 'Webhook & CRM',
    desc: 'Accept leads from n8n, Zapier, or any source. Built-in 6-stage Kanban CRM pipeline.',
    tag: 'Integration',
    tagColor: 'bg-amber-100 text-amber-700',
    color: 'from-amber-400 to-amber-600',
    bullets: ['n8n & Zapier ready', '6-stage pipeline', 'Full audit trail'],
  },
];

const USE_CASES = [
  {
    icon: ShoppingCart,
    title: 'E-Commerce Agencies',
    desc: 'Score inbound leads for Shopify/WooCommerce projects, auto-generate proposals with platform-specific tech stacks.',
    color: 'from-primary-400 to-primary-600',
    stat: '3x more proposals sent per week',
  },
  {
    icon: Laptop,
    title: 'SaaS Development Studios',
    desc: 'Qualify enterprise SaaS leads by budget clarity and requirement completeness before investing in discovery calls.',
    color: 'from-violet-400 to-violet-600',
    stat: '40% reduction in unqualified calls',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Agencies',
    desc: 'Extract iOS/Android requirements, estimate complexity, and send branded proposals while the lead is still warm.',
    color: 'from-emerald-400 to-emerald-600',
    stat: '60s from inquiry to proposal',
  },
  {
    icon: Building2,
    title: 'Enterprise Dev Firms',
    desc: 'Handle high-volume inbound inquiries at scale. Never miss a hot lead again — AI prioritizes automatically.',
    color: 'from-amber-400 to-amber-600',
    stat: 'Zero leads missed, ever',
  },
];



const INTEGRATIONS = [
  { name: 'OpenAI', icon: Cpu, color: 'from-emerald-400 to-emerald-600' },
  { name: 'n8n', icon: Webhook, color: 'from-red-400 to-rose-600' },
  { name: 'Resend', icon: Mail, color: 'from-violet-400 to-violet-600' },
  { name: 'MongoDB', icon: Database, color: 'from-green-400 to-green-600' },
  { name: 'FastAPI', icon: Zap, color: 'from-amber-400 to-amber-600' },
  { name: 'ReportLab', icon: FileText, color: 'from-blue-400 to-blue-600' },
];

/* ─── Sub-components ─── */
function StatCard({ stat }: { stat: typeof STATS[0] }) {
  const count = useCounter(stat.value);
  const Icon = stat.icon;
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon size={22} className="text-primary-300" />
      </div>
      <p className="text-4xl font-display font-extrabold text-white mb-1">
        {count}{stat.suffix}
      </p>
      <p className="text-sm text-slate-400">{stat.label}</p>
    </div>
  );
}

/* ─── Main component ─── */
export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-16 overflow-hidden bg-white">
        {/* Subtle radial gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary-50 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-50 rounded-full blur-3xl opacity-30 -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left: Isometric image */}
            <div className="order-2 lg:order-1 relative">
              <img
                src="/hero-isometric.png"
                alt="Nexocube AI Platform"
                className="w-full h-auto max-w-[600px] mx-auto"
                style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.08))' }}
              />
              {/* Floating badge */}
              <div className="absolute top-8 right-8 bg-white rounded-2xl shadow-elevated border border-gray-100 p-3 hidden lg:flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Activity size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal">92 — HOT LEAD 🔥</p>
                  <p className="text-xs text-muted">Scored in 1.8 seconds</p>
                </div>
              </div>
              {/* Floating proposal badge */}
              <div className="absolute bottom-16 left-4 bg-white rounded-2xl shadow-elevated border border-gray-100 p-3 hidden lg:flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center">
                  <FileText size={16} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal">Proposal Ready ✓</p>
                  <p className="text-xs text-muted">PDF generated in 60s</p>
                </div>
              </div>
            </div>

            {/* Right: Text */}
            <div className="order-1 lg:order-2 lg:pl-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-200 mb-6">
                <Zap size={14} className="text-primary-500" />
                AI Sales Automation Platform
              </div>

              <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-charcoal leading-[1.08] mb-6 tracking-tight">
                Precision AI,<br />
                Designed to<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">
                  Elevate Your Sales
                </span>
              </h1>

              <p className="text-xl text-muted leading-relaxed mb-8 max-w-lg">
                Turn every client inquiry into a qualified lead and professional proposal — automatically. From intake to PDF in under 60 seconds.
              </p>

              {/* Mini checklist */}
              <div className="space-y-2.5 mb-10">
                {[
                  'AI scores every lead 0–100 in real-time',
                  'Full project proposals generated in 60 seconds',
                  'PDF emailed automatically via Resend API',
                  'Built-in CRM + automation audit trail',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-charcoal">
                    <CheckCircle2 size={16} className="text-primary-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary-400 text-charcoal font-bold rounded-full hover:bg-primary-500 transition-all shadow-lg hover:shadow-primary-200/60 hover:shadow-xl hover:-translate-y-0.5 text-base"
                >
                  <PlayCircle size={20} /> Try Live Demo
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-charcoal font-semibold rounded-full border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-base"
                >
                  How It Works <ArrowRight size={18} />
                </Link>
              </div>


            </div>
          </div>

          {/* Bottom 3-card strip */}
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {[
              { icon: Sparkles, title: 'Sharp Intelligence', desc: 'Groq Llama 3 delivers precise lead scores and actionable insights instantly.', color: 'text-charcoal' },
              { icon: Clock, title: 'Effortless Automation', desc: 'Entire sales workflow runs itself — from intake to PDF delivery.', color: 'text-primary-600', bg: 'bg-primary-50 border-primary-100' },
              { icon: Zap, title: 'Instant Creation', desc: 'Professional proposals created and sent in under 60 seconds.', color: 'text-charcoal' },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className={`flex items-center gap-4 bg-white rounded-2xl p-5 border shadow-soft ${card.bg || 'border-gray-100'}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bg || 'bg-gray-50 border border-gray-100'}`}>
                    <Icon size={20} className={card.color} />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal text-sm mb-0.5">{card.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-charcoal">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => <StatCard key={stat.label} stat={stat} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          LIVE AI WORKFLOW
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Description */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-200 mb-6">
                <Activity size={14} /> Live Automation
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-charcoal mb-6 leading-tight">
                Watch the AI Pipeline{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">
                  In Action
                </span>
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-8">
                From the moment a lead submits their inquiry, Nexocube's AI engine springs into action — analyzing, scoring, generating, and delivering — with zero human intervention required.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { step: '01', title: 'Capture', desc: 'Lead form / webhook / API intake' },
                  { step: '02', title: 'Analyze', desc: 'Groq extracts requirements & intent' },
                  { step: '03', title: 'Score & Qualify', desc: '0–100 lead score with tier classification' },
                  { step: '04', title: 'Generate Proposal', desc: 'Full document in under 60 seconds' },
                  { step: '05', title: 'Email & Update CRM', desc: 'PDF delivered, pipeline auto-updated' },
                ].map((item, i) => (
                  <div key={item.step} className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${i === activeStep % 5 ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${i === activeStep % 5 ? 'bg-primary-400 text-charcoal' : 'bg-gray-100 text-muted'}`}>
                      {item.step}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${i === activeStep % 5 ? 'text-primary-700' : 'text-charcoal'}`}>{item.title}</p>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                    {i === activeStep % 5 && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>

              <Link to="/how-it-works" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all">
                See full workflow breakdown <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: Animated pipeline card */}
            <div className="relative">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-elevated overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-charcoal to-gray-800 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-gray-400 text-xs font-mono ml-1">nexocube.ai / pipeline</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-900/50 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </div>
                </div>

                {/* Steps */}
                <div className="p-5 space-y-3 bg-gray-50/50">
                  {WORKFLOW_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const isActive = i === activeStep;
                    const isDone = i < activeStep;
                    return (
                      <div
                        key={step.label}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-500 ${
                          isActive
                            ? 'bg-white border-primary-200 shadow-soft scale-[1.02]'
                            : isDone
                            ? 'bg-white border-gray-100 opacity-60'
                            : 'bg-white/50 border-transparent opacity-30'
                        }`}
                      >
                        <div className={`w-9 h-9 ${isDone ? 'bg-emerald-500' : isActive ? step.color : 'bg-gray-200'} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors`}>
                          {isDone ? (
                            <CheckCircle2 size={16} className="text-white" />
                          ) : (
                            <Icon size={16} className="text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-charcoal truncate">{step.label}</p>
                          <p className="text-xs text-muted truncate">{step.detail}</p>
                        </div>
                        {isActive && (
                          <div className="flex gap-0.5 flex-shrink-0">
                            {[0, 1, 2].map((j) => (
                              <div key={j} className="w-1.5 h-5 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: `${j * 150}ms`, opacity: 0.6 + j * 0.2 }} />
                            ))}
                          </div>
                        )}
                        {isDone && <span className="text-xs text-emerald-600 font-semibold flex-shrink-0">Done</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-muted">Processing FashionHub inquiry…</span>
                  <div className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold">
                    <Clock size={12} />
                    {activeStep < 5 ? `Step ${activeStep + 1}/6` : 'Complete ✓'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-200 mb-5">
              <Star size={14} className="fill-primary-400 text-primary-400" /> Core Features
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-charcoal mb-5">
              Everything You Need to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">Close More Deals</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              A complete AI sales automation engine — from the first inquiry to a signed proposal. No manual work required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {FEATURES_PREVIEW.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-7 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                      <Icon size={26} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-display font-bold text-charcoal text-lg">{feature.title}</h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${feature.tagColor}`}>{feature.tag}</span>
                      </div>
                      <p className="text-muted text-sm leading-relaxed mb-4">{feature.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {feature.bullets.map((b) => (
                          <span key={b} className="inline-flex items-center gap-1 text-xs bg-gray-50 text-charcoal rounded-full px-2.5 py-1 border border-gray-100">
                            <CheckCircle2 size={10} className="text-primary-500" /> {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/features" className="inline-flex items-center gap-2 px-7 py-3 bg-charcoal text-white font-semibold rounded-full hover:bg-gray-800 transition-colors hover:gap-3">
              View All 8 Features <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          AI PROPOSAL DEMO PREVIEW
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Proposal card mockup */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-50 to-primary-50 rounded-3xl p-1.5 border border-primary-100 shadow-elevated">
                <div className="bg-white rounded-2xl overflow-hidden">
                  {/* Proposal header */}
                  <div className="bg-gradient-to-r from-primary-500 to-violet-600 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-bold text-lg">E-Commerce Platform</p>
                        <p className="text-white/70 text-sm">Proposal for FashionHub Pvt. Ltd.</p>
                      </div>
                      <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">AI Generated</span>
                    </div>
                    <div className="flex gap-3 mt-4">
                      {['₹1.4L–₹2.2L', '6–8 Weeks', '5 Phases'].map((tag) => (
                        <span key={tag} className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Proposal body */}
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Executive Summary</p>
                      <p className="text-sm text-charcoal leading-relaxed bg-gray-50 rounded-xl p-3">
                        FashionHub requires a scalable e-commerce platform with advanced features including product catalog management, secure payment processing, and real-time inventory tracking. Our proposal covers a full-stack solution built on React + FastAPI.
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-muted uppercase tracking-widest mb-2">Feature Breakdown</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['User Authentication', 'Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Tracking', 'Admin Dashboard'].map((f) => (
                          <div key={f} className="flex items-center gap-1.5 text-xs text-charcoal">
                            <CheckCircle2 size={12} className="text-primary-500 flex-shrink-0" /> {f}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Technology', value: 'React + FastAPI' },
                        { label: 'Database', value: 'MongoDB Atlas' },
                        { label: 'Deployment', value: 'AWS / Vercel' },
                      ].map((item) => (
                        <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                          <p className="text-xs text-muted">{item.label}</p>
                          <p className="text-xs font-bold text-charcoal mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 py-2.5 bg-primary-400 text-charcoal text-sm font-bold rounded-xl hover:bg-primary-500 transition-colors">
                        Download PDF
                      </button>
                      <button className="flex-1 py-2.5 bg-gray-100 text-charcoal text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                        Send via Email
                      </button>
                    </div>
                    <p className="text-center text-xs text-amber-600 bg-amber-50 rounded-lg py-1.5">
                      ⚠ AI estimate — review before sending
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating time badge */}
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white rounded-2xl px-4 py-2.5 shadow-lg">
                <p className="text-xs font-semibold opacity-80">Generated in</p>
                <p className="text-xl font-extrabold">58s</p>
              </div>
            </div>

            {/* Right: Description */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-200 mb-6">
                <FileText size={14} /> Proposal Generation
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-charcoal mb-6 leading-tight">
                Professional Proposals{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">in Seconds</span>
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-8">
                Llama 3 synthesizes the client inquiry into a complete, client-ready project proposal — executive summary, feature list, tech stack, development phases, timeline, and a budget estimate. All formatted into a professional PDF and emailed automatically.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: FileText, title: 'Executive Summary & Project Scope', desc: 'Clear, structured overview tailored to the client\'s industry.' },
                  { icon: CheckCircle2, title: 'Feature List & User Roles', desc: 'Every requirement extracted and organized by priority.' },
                  { icon: Clock, title: 'Phase-wise Timeline & Budget', desc: 'Realistic estimates broken into development milestones.' },
                  { icon: Mail, title: 'Auto-delivered PDF via Email', desc: 'Branded HTML email with PDF attachment sent automatically.' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={16} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-bold text-charcoal text-sm">{item.title}</p>
                        <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link to="/demo" className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-400 text-charcoal font-bold rounded-full hover:bg-primary-500 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-primary-200/50 hover:shadow-xl">
                <PlayCircle size={18} /> Generate a Demo Proposal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          USE CASES
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-200 mb-5">
              <Building2 size={14} /> Use Cases
            </span>
            <h2 className="font-display text-4xl font-extrabold text-charcoal mb-4">
              Built for{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">Every Agency</span>
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Whether you're a solo dev or a 50-person studio, Nexocube adapts to your sales workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {USE_CASES.map((uc) => {
              const Icon = uc.icon;
              return (
                <div key={uc.title} className="bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  <div className={`h-2 bg-gradient-to-r ${uc.color}`} />
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${uc.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <h3 className="font-display font-bold text-charcoal mb-2">{uc.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4">{uc.desc}</p>
                    <div className="pt-3 border-t border-gray-50">
                      <p className="text-xs font-bold text-primary-600">"{uc.stat}"</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════════════
          INTEGRATIONS STRIP
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-charcoal mb-3">
              Powered by Best-in-Class APIs
            </h2>
            <p className="text-muted">Battle-tested integrations for production-grade reliability.</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            {INTEGRATIONS.map((intg) => {
              const Icon = intg.icon;
              return (
                <div key={intg.name} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 text-center hover:shadow-card hover:-translate-y-0.5 transition-all group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${intg.color} flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <p className="text-xs font-bold text-charcoal">{intg.name}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/integrations" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all text-sm">
              View all integrations & API docs <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EXPLORE PLATFORM CARDS
      ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-charcoal mb-3">
              Explore the{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">Platform</span>
            </h2>
            <p className="text-muted">Deep-dive into every part of the Nexocube ecosystem.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                to: '/features',
                icon: Star,
                iconBg: 'bg-primary-50 text-primary-600',
                title: 'All Features',
                desc: 'Explore all 8 AI-powered modules — from lead scoring to automation audit logs.',
                link: 'Explore Features',
                linkColor: 'text-primary-600',
                count: '8 modules',
              },
              {
                to: '/how-it-works',
                icon: Zap,
                iconBg: 'bg-emerald-50 text-emerald-600',
                title: 'How It Works',
                desc: 'Step-by-step walkthrough of the 5-stage automated pipeline with interactive demos.',
                link: 'See the Pipeline',
                linkColor: 'text-emerald-600',
                count: '5 stages',
              },
              {
                to: '/integrations',
                icon: Globe,
                iconBg: 'bg-violet-50 text-violet-600',
                title: 'Integrations',
                desc: 'API docs, webhook setup, tech stack details, and architecture diagrams.',
                link: 'View Integrations',
                linkColor: 'text-violet-600',
                count: '6 integrations',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.to} to={card.to} className="bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all group p-7 flex flex-col">
                  <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon size={26} />
                  </div>
                  <span className="text-xs font-bold text-muted uppercase tracking-widest mb-2">{card.count}</span>
                  <h3 className="font-display font-bold text-xl text-charcoal mb-2">{card.title}</h3>
                  <p className="text-muted text-sm leading-relaxed flex-1 mb-5">{card.desc}</p>
                  <span className={`${card.linkColor} font-semibold flex items-center gap-1 group-hover:gap-2 transition-all text-sm`}>
                    {card.link} <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-charcoal">
        {/* Decorative glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400 rounded-full blur-3xl opacity-10" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-400 rounded-full blur-3xl opacity-10" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-primary-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Zap size={36} className="text-charcoal" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to Automate<br />Your Sales Process?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Try the live demo — submit a client inquiry and watch AI qualify the lead, extract requirements, and generate a full proposal in real time. No signup required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/demo" className="inline-flex items-center gap-2 px-10 py-4 bg-primary-400 text-charcoal font-bold rounded-full hover:bg-primary-300 transition-all text-lg shadow-lg hover:shadow-primary-400/20 hover:shadow-2xl hover:-translate-y-1">
              <PlayCircle size={22} /> Try AI Demo — Free
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 px-10 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 border border-white/20 transition-all text-lg">
              Access Dashboard <ChevronRight size={20} />
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6">No credit card required · Takes 30 seconds to try</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
