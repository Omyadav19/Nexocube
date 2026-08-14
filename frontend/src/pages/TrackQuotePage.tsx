import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leadsAPI } from '../lib/api';
import { Loader2, ArrowLeft, CheckCircle2, Clock, FileText, Trophy, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

function getStatusInfo(status: string) {
  switch (status) {
    case 'new':
      return {
        icon: <Clock className="w-12 h-12 text-blue-500" />,
        title: 'Quote Received',
        message: 'Thank you! We have successfully received your project details. Our team will review your quotation and get back to you via email shortly.',
        color: 'bg-blue-50 border-blue-100',
      };
    case 'qualified':
    case 'contacted':
      return {
        icon: <FileText className="w-12 h-12 text-violet-500" />,
        title: 'Under Review',
        message: 'Our team is currently reviewing your project requirements and quotation. We will send you a detailed proposal via email once the review is complete.',
        color: 'bg-violet-50 border-violet-100',
      };
    case 'proposal':
    case 'sent':
      return {
        icon: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
        title: 'Proposal Sent',
        message: 'Great news! We have reviewed your requirements and sent a detailed proposal to your email. Please check your inbox (and spam folder) for our proposal.',
        color: 'bg-emerald-50 border-emerald-100',
      };
    case 'won':
      return {
        icon: <Trophy className="w-12 h-12 text-amber-500" />,
        title: 'Project Confirmed!',
        message: 'Welcome aboard! Your project has been confirmed and our team is ready to start. We will be in touch with you very soon to kick things off.',
        color: 'bg-amber-50 border-amber-100',
      };
    case 'lost':
      return {
        icon: <XCircle className="w-12 h-12 text-gray-400" />,
        title: 'Quote Closed',
        message: 'This quote request has been closed. If you have any questions or would like to discuss further, please feel free to contact us.',
        color: 'bg-gray-50 border-gray-100',
      };
    default:
      return {
        icon: <Clock className="w-12 h-12 text-blue-500" />,
        title: 'Status Update',
        message: 'We have received your request and will be in touch soon.',
        color: 'bg-blue-50 border-blue-100',
      };
  }
}

export default function TrackQuotePage() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      leadsAPI.track(id)
        .then(res => setLead(res.data))
        .catch(err => {
          console.error(err);
          setError('Invalid tracking link or quote not found.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-soft max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Quote Not Found</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link to="/" className="btn-primary inline-flex justify-center w-full py-3">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(lead.status);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-20 pt-32">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-soft overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-gray-100">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal mb-1">
              Quote Status
            </h1>
            <p className="text-slate-500 text-sm">
              {lead.company ? <><strong className="text-charcoal">{lead.company}</strong> — </> : ''}{lead.service}
            </p>
          </div>

          {/* Status Card */}
          <div className="p-8 md:p-12">
            <div className={`rounded-2xl border p-8 text-center ${statusInfo.color}`}>
              <div className="flex justify-center mb-4">
                {statusInfo.icon}
              </div>
              <h2 className="text-xl font-bold text-charcoal mb-3">{statusInfo.title}</h2>
              <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
                {statusInfo.message}
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">Reference ID: {id}</p>
            </div>

            <div className="mt-8 text-center">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
