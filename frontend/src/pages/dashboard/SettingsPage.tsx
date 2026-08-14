import { useAuth } from '../../contexts/AuthContext';
import { Shield, Key, User, Mail } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal">Settings</h2>
        <p className="text-sm text-muted">Manage your account and application settings</p>
      </div>

      {/* Profile */}
      <div className="card">
        <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <User size={16} className="text-primary-600" /> Profile
        </h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{user?.name?.[0] || 'A'}</span>
          </div>
          <div>
            <p className="font-semibold text-charcoal">{user?.name || 'Admin'}</p>
            <p className="text-sm text-muted">{user?.email}</p>
            <span className="badge-primary mt-1 text-xs capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* API Config */}
      <div className="card">
        <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Key size={16} className="text-primary-600" /> API Configuration
        </h3>
        <div className="space-y-3 text-sm">
          {[
            { label: 'OpenAI API', status: 'Configure in .env', color: 'text-amber-600' },
            { label: 'Resend Email API', status: 'Configure in .env', color: 'text-amber-600' },
            { label: 'MongoDB Atlas', status: 'Connected', color: 'text-emerald-600' },
            { label: 'n8n Webhook', status: 'Configure N8N_WEBHOOK_URL', color: 'text-amber-600' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-charcoal font-medium">{item.label}</span>
              <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Shield size={16} className="text-primary-600" /> Security
        </h3>
        <div className="space-y-2 text-sm">
          {[
            '✅ Passwords hashed with bcrypt',
            '✅ JWT authentication (24h expiry)',
            '✅ Protected API endpoints',
            '✅ CORS configured for frontend only',
            '✅ No secrets exposed to client',
          ].map((item) => (
            <p key={item} className="text-charcoal">{item}</p>
          ))}
        </div>
      </div>

      {/* Environment */}
      <div className="card">
        <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Mail size={16} className="text-primary-600" /> Environment
        </h3>
        <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-1">
          <p>MONGODB_URI=mongodb+srv://...</p>
          <p>OPENAI_API_KEY=sk-...</p>
          <p>RESEND_API_KEY=re_...</p>
          <p>JWT_SECRET=your-secret</p>
          <p>FRONTEND_URL=http://localhost:5173</p>
        </div>
        <p className="text-xs text-muted mt-3">Copy from backend/.env.example and fill in your values.</p>
      </div>
    </div>
  );
}
