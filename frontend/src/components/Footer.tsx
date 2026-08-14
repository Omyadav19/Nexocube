import { Link } from 'react-router-dom';
import { Zap, Mail, ArrowRight, ShieldCheck, Sparkles, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#0b0f19] text-white pt-20 pb-12 overflow-hidden border-t border-slate-800/80">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Col */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <Zap size={18} className="text-white fill-white/20" />
                </div>
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                  Nexo<span className="text-primary-400">cube</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                Next-generation autonomous AI sales workforce. Qualify inquiries, compute real-time quotes, and deliver executive-grade proposals in seconds.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All AI Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/features" className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-1.5">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-400 hover:text-primary-400 transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/integrations" className="text-slate-400 hover:text-primary-400 transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-1.5">
                  Live Demo
                  <span className="text-[10px] bg-primary-500/10 text-primary-400 border border-primary-500/20 px-1.5 py-0.5 rounded-full font-semibold">New</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Legal */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-6">Trust & Legal</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-slate-400 hover:text-primary-400 transition-colors">
                  Security Standards
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-1">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Connect & Direct Contact */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-6">Direct Inquiries</h4>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Have questions or need enterprise AI sales deployment?
              </p>
              <a 
                href="mailto:omryadav5@gmail.com" 
                className="group flex items-center justify-between px-3.5 py-2.5 bg-slate-800/90 hover:bg-primary-600/90 border border-slate-700/80 hover:border-primary-500 rounded-xl transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Mail size={15} className="text-primary-400 group-hover:text-white shrink-0 transition-colors" />
                  <span className="text-xs font-mono text-slate-200 group-hover:text-white truncate">omryadav5@gmail.com</span>
                </div>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </a>
              <Link 
                to="/demo" 
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-charcoal font-semibold text-xs rounded-xl shadow-md transition-all duration-200"
              >
                <Sparkles size={13} />
                Try Interactive Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-medium">
            © {new Date().getFullYear()} Nexocube Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck size={14} className="text-primary-400" />
              Enterprise AI & SOC-2 Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
