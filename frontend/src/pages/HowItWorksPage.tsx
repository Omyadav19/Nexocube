import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Zap, Users, Brain, Target, FileText, Mail, CheckCircle2,
  ArrowRight, Clock, Shield, BarChart3, ChevronRight, PlayCircle
} from 'lucide-react';

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Capture Lead',
    subtitle: 'Omnichannel intake',
    desc: 'A client submits their project inquiry via your branded lead form, website widget, or directly through the webhook API. The inquiry — company name, contact, project description, budget, and timeline — is instantly stored in your database.',
    icon: Users,
    color: 'from-primary-400 to-primary-600',
    accentColor: 'text-primary-600',
    accentBg: 'bg-primary-50',
    details: [
      'Branded inquiry form with custom fields',
      'Webhook API for external integrations',
      'n8n / Zapier compatible',
      'Instant confirmation email to client',
    ],
    mockup: {
      title: 'New Lead Received',
      body: 'FashionHub — E-commerce Platform\nBudget: ₹1,50,000 | Timeline: 2 months',
      tag: 'Incoming',
      tagColor: 'bg-blue-100 text-blue-700',
    },
  },
  {
    num: '02',
    title: 'AI Understanding',
    subtitle: 'Deep NLP analysis',
    desc: 'Llama 3 reads the full inquiry and performs deep natural language processing — extracting explicit and implicit requirements, identifying the project type, technology preferences, team size signals, and complexity indicators.',
    icon: Brain,
    color: 'from-violet-400 to-violet-600',
    accentColor: 'text-violet-600',
    accentBg: 'bg-violet-50',
    details: [
      'Groq powered analysis engine',
      'Requirement extraction & categorization',
      'Project type classification',
      'Technology stack inference',
    ],
    mockup: {
      title: 'AI Extracting Requirements',
      body: '✓ Authentication System\n✓ Product Catalog\n✓ Payment Gateway\n✓ Admin Dashboard',
      tag: 'Processing',
      tagColor: 'bg-violet-100 text-violet-700',
    },
  },
  {
    num: '03',
    title: 'Smart Qualification',
    subtitle: '0–100 lead scoring',
    desc: 'The AI scores every lead from 0 to 100 based on four weighted dimensions: budget clarity (25%), requirement specificity (30%), timeline realism (25%), and decision-maker signals (20%). Scores translate to actionable priority tiers.',
    icon: Target,
    color: 'from-emerald-400 to-emerald-600',
    accentColor: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
    details: [
      'Four-dimension scoring model',
      'HOT (80+) / WARM (50-79) / COLD (0-49)',
      'Actionable next-step recommendation',
      'Score history & trend tracking',
    ],
    mockup: {
      title: 'Lead Score: 92/100',
      body: '🔥 HOT LEAD — High Priority\nRecommendation: Schedule call today',
      tag: '🔥 HOT',
      tagColor: 'bg-red-100 text-red-700',
    },
  },
  {
    num: '04',
    title: 'Proposal Generation',
    subtitle: 'Full document in 60s',
    desc: "Llama 3 synthesizes the analysis into a complete, professional project proposal — an executive summary, detailed project scope, feature list, recommended technology stack, development phases, timeline breakdown, and budget estimate tailored to the client's context.",
    icon: FileText,
    color: 'from-amber-400 to-amber-600',
    accentColor: 'text-amber-600',
    accentBg: 'bg-amber-50',
    details: [
      'Executive Summary & Project Scope',
      'Feature breakdown with effort estimates',
      'Phase-wise timeline (weeks)',
      'Budget range with contingency',
    ],
    mockup: {
      title: 'Proposal Generated ✓',
      body: 'E-Commerce Platform — FashionHub\nTimeline: 6-8 weeks | Budget: ₹1.4L–₹2.2L',
      tag: 'AI Generated',
      tagColor: 'bg-amber-100 text-amber-700',
    },
  },
  {
    num: '05',
    title: 'Automated Delivery',
    subtitle: 'PDF + email in one click',
    desc: 'ReportLab converts the proposal into a professional PDF with your branding. Resend API delivers a beautiful HTML email with the PDF attached to the client — all automatically. The lead status in your CRM is updated to "Proposal Sent".',
    icon: Mail,
    color: 'from-pink-400 to-rose-600',
    accentColor: 'text-pink-600',
    accentBg: 'bg-pink-50',
    details: [
      'Professional PDF with your branding',
      'HTML email via Resend API (99% delivery)',
      'CRM auto-updated to "Proposal Sent"',
      'Delivery confirmation logged',
    ],
    mockup: {
      title: 'Email Delivered ✓',
      body: 'Proposal sent to: john@fashionhub.com\nPDF attached: proposal_fashionhub.pdf',
      tag: 'Delivered',
      tagColor: 'bg-emerald-100 text-emerald-700',
    },
  },
];

const TIMELINE_COMPARISON = [
  { task: 'Read & understand inquiry', manual: '15 min', ai: '< 3 sec' },
  { task: 'Score & prioritize lead', manual: '30 min', ai: 'Instant' },
  { task: 'Write project proposal', manual: '2–3 days', ai: '60 sec' },
  { task: 'Format as PDF', manual: '45 min', ai: '< 5 sec' },
  { task: 'Send proposal email', manual: '20 min', ai: 'Automatic' },
  { task: 'Update CRM status', manual: '10 min', ai: 'Automatic' },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const step = HOW_IT_WORKS[activeStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-50" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-200 mb-6">
            <Zap size={14} className="text-primary-500" />
            Automated Workflow
          </span>
          <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-charcoal mb-6 leading-tight">
            Five Steps to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">
              Zero Manual Work
            </span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
            From client inquiry to a professional PDF proposal in your client's inbox — in under 60 seconds. Fully automated.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/demo" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-400 text-charcoal font-bold rounded-full hover:bg-primary-500 transition-all shadow-lg hover:-translate-y-0.5">
              <PlayCircle size={18} /> See it Live
            </Link>
            <Link to="/features" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-charcoal font-semibold rounded-full border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
              View All Features <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE STEP EXPLORER ─────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-charcoal mb-3">The Automated Pipeline</h2>
            <p className="text-muted">Click each step to explore the details</p>
          </div>

          {/* Step selector tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {HOW_IT_WORKS.map((s, i) => {
              const SIcon = s.icon;
              const isActive = i === activeStep;
              return (
                <button
                  key={s.num}
                  onClick={() => setActiveStep(i)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 border ${
                    isActive
                      ? `bg-gradient-to-r ${s.color} text-white border-transparent shadow-lg`
                      : 'bg-white text-muted border-gray-200 hover:border-gray-300 hover:text-charcoal'
                  }`}
                >
                  <span className="text-xs font-bold opacity-70">{s.num}</span>
                  <SIcon size={15} />
                  {s.title}
                </button>
              );
            })}
          </div>

          {/* Active step detail */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Content */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-elevated p-8 lg:p-10">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${step.accentBg} rounded-full text-sm font-semibold ${step.accentColor} mb-5`}>
                <Icon size={14} />
                Step {step.num} — {step.subtitle}
              </div>
              <h3 className="font-display text-3xl font-extrabold text-charcoal mb-4">{step.title}</h3>
              <p className="text-muted leading-relaxed mb-8">{step.desc}</p>

              <div className="space-y-3 mb-8">
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Included in this step</p>
                {step.details.map((d) => (
                  <div key={d} className="flex items-center gap-3 text-sm text-charcoal">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                    {d}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {activeStep > 0 && (
                  <button
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="px-5 py-2 bg-gray-100 text-charcoal rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    ← Previous
                  </button>
                )}
                {activeStep < HOW_IT_WORKS.length - 1 && (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="px-5 py-2 bg-charcoal text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-1"
                  >
                    Next Step <ChevronRight size={14} />
                  </button>
                )}
                {activeStep === HOW_IT_WORKS.length - 1 && (
                  <Link to="/demo" className="px-5 py-2 bg-primary-400 text-charcoal rounded-full text-sm font-bold hover:bg-primary-500 transition-colors">
                    Try it Now →
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Mockup card + progress */}
            <div className="space-y-5">
              {/* Progress indicator */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Workflow Progress</span>
                  <span className="text-xs font-bold text-primary-600">{activeStep + 1} / {HOW_IT_WORKS.length}</span>
                </div>
                <div className="flex gap-1.5">
                  {HOW_IT_WORKS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                        i <= activeStep
                          ? `bg-gradient-to-r ${step.color}`
                          : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Live mockup */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-elevated overflow-hidden">
                <div className={`bg-gradient-to-r ${step.color} p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-white/30" />
                      <div className="w-3 h-3 rounded-full bg-white/30" />
                      <div className="w-3 h-3 rounded-full bg-white/30" />
                    </div>
                    <span className="text-white/80 text-xs font-mono ml-2">nexocube.ai / pipeline</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${step.mockup.tagColor}`}>{step.mockup.tag}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-charcoal text-sm">{step.mockup.title}</p>
                      <p className="text-muted text-xs mt-1 whitespace-pre-line leading-relaxed">{step.mockup.body}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Clock size={12} />
                    <span>Just now · Automated by Nexocube AI</span>
                  </div>
                </div>
              </div>

              {/* All steps mini list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 space-y-2">
                {HOW_IT_WORKS.map((s, i) => {
                  const SIcon = s.icon;
                  return (
                    <button
                      key={s.num}
                      onClick={() => setActiveStep(i)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                        i === activeStep ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                        <SIcon size={14} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${i === activeStep ? 'text-primary-700' : 'text-charcoal'}`}>{s.title}</p>
                        <p className="text-xs text-muted">{s.subtitle}</p>
                      </div>
                      {i < activeStep && <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />}
                      {i === activeStep && <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIME SAVINGS TABLE ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-charcoal mb-3">
              Time Saved Per Lead
            </h2>
            <p className="text-muted">See how Nexocube compresses days of work into seconds.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-elevated overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100 text-sm font-semibold">
              <div className="p-4 text-muted">Task</div>
              <div className="p-4 text-center text-muted border-l border-gray-100">Manual</div>
              <div className="p-4 text-center text-primary-700 border-l border-primary-100 bg-primary-50">Nexocube</div>
            </div>
            {TIMELINE_COMPARISON.map((row, i) => (
              <div key={row.task} className={`grid grid-cols-3 border-b border-gray-50 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                <div className="p-4 text-charcoal font-medium">{row.task}</div>
                <div className="p-4 text-center text-muted border-l border-gray-100">{row.manual}</div>
                <div className="p-4 text-center font-bold text-primary-600 border-l border-primary-100 bg-primary-50/30">{row.ai}</div>
              </div>
            ))}
            <div className="grid grid-cols-3 bg-charcoal text-sm font-bold">
              <div className="p-4 text-white">Total per lead</div>
              <div className="p-4 text-center text-red-300 border-l border-white/10">3–4 days</div>
              <div className="p-4 text-center text-primary-300 border-l border-white/10">~90 seconds</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI QUALIFICATION DEEP DIVE ────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold border border-primary-200 mb-5">
                <Brain size={14} /> AI Lead Qualification
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-charcoal mb-5">
                Know Exactly Which Leads to{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">Chase First</span>
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                Our AI doesn't just score leads — it gives you a clear rationale and a specific recommended action for each one, so your team always knows exactly what to do next.
              </p>

              {/* Scoring dimensions */}
              {[
                { label: 'Requirement Specificity', pct: 30, color: 'bg-primary-400' },
                { label: 'Budget Clarity', pct: 25, color: 'bg-violet-400' },
                { label: 'Timeline Realism', pct: 25, color: 'bg-emerald-400' },
                { label: 'Decision-maker Signals', pct: 20, color: 'bg-amber-400' },
              ].map((dim) => (
                <div key={dim.label} className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-charcoal">{dim.label}</span>
                    <span className="font-bold text-muted">{dim.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${dim.color} rounded-full`} style={{ width: `${dim.pct * 3}%` }} />
                  </div>
                </div>
              ))}

              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { label: '🔥 HOT', range: '80–100', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', action: 'Call today' },
                  { label: '🌡 WARM', range: '50–79', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', action: 'Nurture now' },
                  { label: '❄️ COLD', range: '0–49', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', action: 'Newsletter' },
                ].map((tier) => (
                  <div key={tier.label} className={`${tier.bg} border ${tier.border} rounded-xl p-3 text-center`}>
                    <p className={`font-bold text-sm ${tier.text}`}>{tier.label}</p>
                    <p className="text-xs text-muted my-0.5">{tier.range}</p>
                    <p className={`text-xs font-semibold ${tier.text}`}>{tier.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI result card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-elevated overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-violet-600 p-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">AI Analysis Result</p>
                  <p className="text-white/60 text-xs mt-0.5">FashionHub — E-Commerce Platform</p>
                </div>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">llama-3.3-70b-versatile</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-5xl font-display font-extrabold text-charcoal">92</p>
                    <p className="text-sm text-muted">Lead Score</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-sm font-bold">
                      🔥 HOT LEAD
                    </span>
                    <p className="text-xs text-muted mt-1">Immediate Action Required</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-emerald-500"
                    style={{ width: '92%', transition: 'width 1s ease' }}
                  />
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">AI Reasoning</p>
                  <p className="text-sm text-charcoal italic">
                    "Strong e-commerce opportunity. Clear requirements with specific features listed, realistic budget range (₹1.5L), and 2-month timeline. Client shows purchase urgency. Recommend scheduling discovery call today."
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Extracted Requirements</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Authentication', 'Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Order Tracking', 'Admin Panel'].map((req) => (
                      <span key={req} className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 rounded-full px-2.5 py-1 font-medium border border-primary-100">
                        <CheckCircle2 size={10} /> {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-700">Recommended Action</p>
                    <p className="text-sm text-emerald-600 mt-0.5">Schedule a discovery call within 24 hours. Proposal auto-generated and ready to send.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-charcoal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-white mb-4">
            See the Full Pipeline in Action
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Submit a sample inquiry and watch the AI qualify, score, and generate a full proposal in under 60 seconds.
          </p>
          <Link to="/demo" className="inline-flex items-center gap-2 px-10 py-4 bg-primary-400 text-charcoal font-bold rounded-full hover:bg-primary-300 transition-all text-lg">
            <PlayCircle size={20} /> Try Live Demo
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
