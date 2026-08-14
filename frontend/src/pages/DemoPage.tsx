import { useState } from 'react';
import { Send, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { leadsAPI } from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SERVICES = [
  'E-commerce Development',
  'Web Application',
  'Mobile App Development',
  'CRM Development',
  'AI Automation',
  'SaaS Development',
  'WordPress Development',
  'API Development',
  'UI/UX Design',
  'Other',
];

const BUDGETS = [
  'Under ₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000–₹2,50,000',
  '₹2,50,000–₹5,00,000',
  '₹5,00,000–₹10,00,000',
  'Above ₹10,00,000',
];

const TIMELINES = [
  'ASAP (1-2 weeks)',
  '1 month',
  '1-2 months',
  '2-3 months',
  '3-6 months',
  'Flexible',
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  description: string;
  budget: string;
  timeline: string;
}

export default function DemoPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    name: 'Rahul Sharma',
    email: 'rahul@fashionhub.in',
    phone: '+91 98765 43210',
    company: 'FashionHub',
    service: 'E-commerce Development',
    description:
      'We are launching an online clothing store and need a modern e-commerce website with customer registration, product management, shopping cart, online payments and order tracking. We would like to launch within two months.',
    budget: '₹1,00,000–₹2,50,000',
    timeline: '1-2 months',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await leadsAPI.create(form);
      // Redirect to the live tracker
      navigate(`/status/${response.data.id}`);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d: any) => d.msg).join(', '));
      } else {
        setError(detail || 'Failed to submit. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-sm font-semibold text-primary-600 border border-primary-100 shadow-soft mb-6">
              <Zap size={14} />
              Live Demo — Real AI Processing
            </div>
            <h1 className="font-display text-4xl font-extrabold text-charcoal mb-4">
              Submit a Client Inquiry
            </h1>
            <p className="text-lg text-muted">
              Fill in the form below. Our AI will analyze, score, and generate a proposal in real time.
              Pre-filled with the FashionHub demo data.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-6 py-12">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="label">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Rahul Sharma" required />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="rahul@company.com" required />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="label">Company Name</label>
                <input name="company" value={form.company} onChange={handleChange} className="input" placeholder="FashionHub" />
              </div>
            </div>

            <div>
              <label className="label">Service Required *</label>
              <select name="service" value={form.service} onChange={handleChange} className="input" required>
                <option value="">Select a service</option>
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Project Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="input min-h-[140px] resize-none"
                placeholder="Describe your project in detail — features needed, current situation, goals..."
                required
                minLength={10}
              />
              <p className="text-xs text-muted mt-1">More detail = better AI analysis. Minimum 10 characters.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="label">Budget Range</label>
                <select name="budget" value={form.budget} onChange={handleChange} className="input">
                  <option value="">Select budget range</option>
                  {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Timeline</label>
                <select name="timeline" value={form.timeline} onChange={handleChange} className="input">
                  <option value="">Select timeline</option>
                  {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-4 text-base disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting to AI...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Inquiry — Trigger AI Analysis
                </>
              )}
            </button>

            <p className="text-xs text-muted text-center">
              This triggers a real FastAPI endpoint → MongoDB → OpenAI pipeline.
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
