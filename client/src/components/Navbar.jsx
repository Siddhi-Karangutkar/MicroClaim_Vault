import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Settings, Shield } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-card rounded-none border-t-0 border-x-0 border-b border-slate-200 dark:border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-neon/10 rounded-xl flex items-center justify-center border border-neon/30 group-hover:bg-neon/20 transition-colors">
            <Shield className="w-5 h-5 text-neon" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">MicroClaim Vault</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
              isActive('/dashboard') ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:block">Vault</span>
          </Link>
          
          <Link 
            to="/upload" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
              isActive('/upload') ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:block">Upload</span>
          </Link>

          <Link 
            to="/settings" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
              isActive('/settings') ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:block">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
