import { Link } from 'react-router-dom';
import { Zap, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                <Zap size={16} className="text-charcoal" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Nexocube
              </span>
            </div>
            <p className="text-gray-400 mt-4 leading-relaxed max-w-sm">
              AI-powered sales automation that turns client inquiries into professional proposals — automatically.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Product</h4>
            <ul className="space-y-4">
              <li><Link to="/features" className="text-gray-400 hover:text-primary-400 transition-colors">Features</Link></li>
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-primary-400 transition-colors">How it Works</Link></li>
              <li><Link to="/integrations" className="text-gray-400 hover:text-primary-400 transition-colors">Integrations</Link></li>
              <li><Link to="/demo" className="text-gray-400 hover:text-primary-400 transition-colors">Live Demo</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/security" className="text-gray-400 hover:text-primary-400 transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Nexocube. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Mail size={14} />
              hello@nexocube.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
