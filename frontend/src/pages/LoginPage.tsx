import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@proposalai.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg, #f0f4ff 0%, #fdf4ff 100%)' }}>
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/5 rounded-full" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl">ProposalAI</span>
          </div>

          <h2 className="font-display text-4xl font-extrabold mb-4 leading-tight">
            Your AI Sales Team,<br />Working 24/7
          </h2>
          <p className="text-primary-100 text-lg mb-10">
            Qualify leads, generate proposals, and close deals — automatically.
          </p>

          <div className="space-y-4">
            {[
              { val: '92/100', label: 'Average Lead Score Accuracy' },
              { val: '<30s', label: 'Proposal Generation Time' },
              { val: '10x', label: 'Faster Than Manual Process' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                <span className="font-display font-extrabold text-2xl text-white">{stat.val}</span>
                <span className="text-primary-100 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-primary-200 text-sm">
          © 2025 ProposalAI. AI Sales & Proposal Automation.
        </p>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-charcoal">Proposal<span className="text-primary-600">AI</span></span>
          </div>

          <h1 className="font-display text-3xl font-extrabold text-charcoal mb-2">Welcome back</h1>
          <p className="text-muted mb-8">Sign in to your admin dashboard</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4 mb-6">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="admin@proposalai.com"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </form>

          <p className="text-sm text-center text-muted mt-6">
            Demo Credentials: <strong>admin@proposalai.com</strong> / <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
