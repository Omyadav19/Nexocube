import { useState } from 'react';
import { Link } from 'react-router-dom';
import { leadsAPI } from '../lib/api';
import { ArrowLeft, Send, CheckCircle2, Loader2, Mail, Phone, MapPin, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SERVICES = [
  'Web Application',
  'Mobile App Development',
  'E-commerce Development',
  'SaaS Development',
  'API Development',
  'CRM Development',
  'UI/UX Design',
  'WordPress Development',
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

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    service: '', budget: '', timeline: '', description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.description || !form.service) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await leadsAPI.create(form);
      setTrackingId(res.data.id || res.data._id);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-20 pt-36">
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </div>

        {submitted ? (
          /* ── Success State ── */
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-display font-bold text-charcoal mb-3">
                Message Received!
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Thank you for reaching out! Our team will review your project details and contact you via email shortly with a detailed proposal.
              </p>
              {trackingId && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-xs text-muted mb-1">Your Tracking ID</p>
                  <p className="text-sm font-mono font-medium text-charcoal">{trackingId}</p>
                  <Link
                    to={`/status/${trackingId}`}
                    className="inline-flex items-center gap-1 text-xs text-primary-600 font-medium mt-2 hover:underline"
                  >
                    Track your quote status →
                  </Link>
                </div>
              )}
              <Link to="/" className="btn-primary inline-flex w-full justify-center py-3">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-12">
            {/* ── Left Info Panel ── */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl font-display font-bold text-charcoal mb-3">
                  Get in Touch
                </h1>
                <p className="text-slate-600 leading-relaxed">
                  Have a project in mind? Fill in the form and our team will review your requirements and reach out within 24 hours with a custom proposal.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">Email Us</p>
                    <p className="text-sm text-slate-500">hello@nexocube.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">Call Us</p>
                    <p className="text-sm text-slate-500">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">Location</p>
                    <p className="text-sm text-slate-500">Bengaluru, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">Response Time</p>
                    <p className="text-sm text-slate-500">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Form Panel ── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 md:p-10">
                <h2 className="text-xl font-display font-bold text-charcoal mb-6">
                  Send us a Message
                </h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="name" value={form.name} onChange={handleChange}
                        required placeholder="Arjun Patel"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange}
                        required placeholder="arjun@company.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Phone + Company */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Phone</label>
                      <input
                        name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Company</label>
                      <input
                        name="company" value={form.company} onChange={handleChange}
                        placeholder="Your Company"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">
                      Service Required <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="service" value={form.service} onChange={handleChange} required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent bg-white"
                    >
                      <option value="">Select a service…</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Budget + Timeline */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Budget Range</label>
                      <select
                        name="budget" value={form.budget} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent bg-white"
                      >
                        <option value="">Select budget…</option>
                        {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">Expected Timeline</label>
                      <input
                        name="timeline" value={form.timeline} onChange={handleChange}
                        placeholder="e.g. 3-6 months"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1.5">
                      Project Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description" value={form.description} onChange={handleChange}
                      required rows={4}
                      placeholder="Tell us about your project — what you want to build, key features, integrations needed, etc."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-muted mt-1">The more detail you provide, the better we can help!</p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    id="contact-submit-btn"
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
