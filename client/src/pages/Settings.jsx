import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, User, Shield, Zap, X, Star } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProModal, setShowProModal] = useState(false);
  
  // Dummy user state for Phase 1
  const user = auth.currentUser || { email: 'user@example.com' };
  const itemCount = 2; // Dummy value

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account, appearance, and plan.</p>
        </div>

        <div className="space-y-6">
          
          {/* Appearance Section */}
          <section className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <div className="p-2 bg-neon/10 rounded-lg border border-neon/20"><Moon className="w-5 h-5 text-neon" /></div>
              Appearance
            </h2>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div>
                <p className="font-medium text-lg">Theme Mode</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark mode</p>
              </div>
              <button 
                onClick={toggleTheme}
                className="p-3 bg-slate-200 dark:bg-white/10 rounded-full hover:bg-slate-300 dark:hover:bg-white/20 transition-all hover:scale-110 active:scale-95 shadow-sm"
              >
                {theme === 'dark' ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-slate-700" />}
              </button>
            </div>
          </section>

          {/* Account Section */}
          <section className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <div className="p-2 bg-neon/10 rounded-lg border border-neon/20"><User className="w-5 h-5 text-neon" /></div>
              Account Details
            </h2>
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Email Address</p>
                <p className="font-medium text-lg">{user?.email}</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-red-500 hover:text-white hover:bg-red-500 font-medium transition-all group"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
              </button>
            </div>
          </section>

          {/* Plan Section */}
          <section className="glass-card p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-neon/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 relative z-10">
              <div className="p-2 bg-neon/10 rounded-lg border border-neon/20"><Shield className="w-5 h-5 text-neon" /></div>
              Storage Plan
            </h2>
            
            <div className="mb-8 p-4 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="font-bold text-lg block">Free Tier</span>
                  <span className="text-sm text-slate-500">Basic warranty tracking</span>
                </div>
                <span className="text-slate-600 dark:text-slate-300 font-medium">{itemCount} / 5 Slots Used</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-black/40 rounded-full h-3 overflow-hidden border border-slate-300 dark:border-white/10">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-neon h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${(itemCount / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <button 
              onClick={() => setShowProModal(true)}
              className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-dark rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] relative z-10 flex items-center justify-center gap-2"
            >
              Upgrade to Pro <Zap className="w-5 h-5 text-yellow-400" />
            </button>
          </section>

        </div>
      </div>

      {/* Pro Modal */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-8 w-full max-w-sm animate-fade-in-up border border-neon/30 shadow-[0_0_30px_rgba(0,255,204,0.15)] text-center relative z-[60]">
            <button 
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Premium is on the horizon!</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              We are putting the final touches on our Pro Plan. Soon you'll be able to enjoy unlimited vault storage and auto-send warranty claims to companies with a single click!
            </p>
            <button 
              onClick={() => setShowProModal(false)}
              className="w-full py-3 bg-neon text-slate-900 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(0,255,204,0.3)]"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
