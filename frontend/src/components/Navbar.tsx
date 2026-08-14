import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Product', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Features', href: '/features' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Demo', href: '/demo' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? 'bg-white/90 backdrop-blur-sm border-b border-gray-100' : 'bg-white border-b border-gray-100'
      }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-charcoal" />
            </div>
            <span className="font-display font-bold text-xl text-charcoal">
              Nexocube
            </span>
          </Link>

          {/* Desktop nav - Pill shape */}
          <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur border border-gray-100 shadow-sm rounded-full px-2 py-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href && !(link.label === 'Product' && location.pathname !== '/');
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${isActive
                      ? 'bg-primary-400 text-charcoal shadow-sm'
                      : 'text-muted hover:text-charcoal hover:bg-gray-100/50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-charcoal hover:text-primary-600 transition-colors"
            >
              Admin Login
            </Link>
            <Link to="/demo" className="btn-primary text-sm py-2 px-6">
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-3 py-2 text-sm font-medium text-charcoal hover:bg-gray-50 rounded-lg"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/login" className="btn-secondary text-center text-sm">
              Admin Login
            </Link>
            <Link to="/demo" className="btn-primary text-center text-sm">
              Try Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
