import { Link } from 'react-router-dom';
import { Shield, Zap, Bell, FileText, ChevronRight, Lock } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden animate-fade-in">
      
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow animation-delay-500"></div>

      {/* Navigation (Landing Specific) */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-neon/10 rounded-xl flex items-center justify-center border border-neon/30 group-hover:bg-neon/20 transition-all duration-300">
            <Shield className="w-5 h-5 text-neon" />
          </div>
          <span className="font-bold text-xl tracking-tight">MicroClaim Vault</span>
        </div>
        <div>
          <Link 
            to="/auth" 
            className="px-6 py-2.5 rounded-lg font-medium bg-slate-900 dark:bg-white text-white dark:text-dark hover:scale-105 active:scale-95 transition-transform inline-block shadow-lg shadow-neon/10"
          >
            Go to Vault
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center z-10 relative px-6">
        
        {/* Hero Section */}
        <section className="w-full max-w-4xl mx-auto text-center pt-20 pb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-sm font-medium mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse"></span>
            Automated Warranty Enforcement
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up animation-delay-100">
            Never Lose A <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-blue-500">Warranty Claim</span> Again.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            Upload your receipts, let our AI extract the warranty details, and we'll automatically generate legal claims and email manufacturers when your items break.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <Link 
              to="/auth" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-neon text-slate-900 hover:bg-[#00e6b8] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,204,0.3)]"
            >
              Get Started for Free <ChevronRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/learn-more"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full max-w-7xl mx-auto py-20 border-t border-slate-200 dark:border-white/10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Protect Your Purchases</h2>
            <p className="text-slate-500 dark:text-slate-400">Everything you need to manage receipts and enforce warranties.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Receipt Parsing</h3>
              <p className="text-slate-500 dark:text-slate-400">Just drag and drop your receipt. Our AI reads it, extracts the product details, and calculates the exact warranty period instantly.</p>
            </div>

            <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 border border-yellow-500/20 group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expiry Alerts</h3>
              <p className="text-slate-500 dark:text-slate-400">We monitor your vault 24/7. Get notified exactly 30 days before a warranty expires so you never miss a deadline.</p>
            </div>

            <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-neon/10 rounded-lg flex items-center justify-center mb-6 border border-neon/20 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-neon" />
              </div>
              <h3 className="text-xl font-bold mb-3">1-Click Legal Claims</h3>
              <p className="text-slate-500 dark:text-slate-400">Item broke? Click 'Claim' and we automatically generate a legally sound PDF document and email it to the manufacturer for you.</p>
            </div>

          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="w-full max-w-7xl mx-auto py-20 border-t border-slate-200 dark:border-white/10">
          <div className="glass-card p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Secure Digital Wallet</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                MicroClaim Vault is built on enterprise-grade security. All your receipt images are encrypted and securely stored in the cloud. We handle the paperwork, you enjoy peace of mind knowing your consumer rights are protected.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center"><Lock className="w-3 h-3 text-neon"/></div>
                  <span>End-to-End Encrypted Storage</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center"><Lock className="w-3 h-3 text-neon"/></div>
                  <span>Secure OAuth Authentication</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center"><Lock className="w-3 h-3 text-neon"/></div>
                  <span>Privacy-First AI Extraction</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full h-80 bg-slate-200/50 dark:bg-white/5 rounded-2xl border border-slate-300 dark:border-white/10 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-50"></div>
               <Shield className="w-32 h-32 text-slate-300 dark:text-white/10 animate-float" />
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-white/10 py-12 mt-12 z-10 relative bg-slate-100/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-neon" />
              <span className="font-bold text-lg">MicroClaim Vault</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm">
              Automating warranty enforcement for consumers. Save receipts, track expiry dates, and hold manufacturers accountable.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#features" className="hover:text-neon transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-neon transition-colors">How it works</a></li>
              <li><Link to="/auth" className="hover:text-neon transition-colors">Pricing (Free Tier)</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-neon transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-neon transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-neon transition-colors">Magnuson-Moss Act</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 dark:border-white/5 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} MicroClaim Vault. All rights reserved. Built with React & Tailwind.
        </div>
      </footer>
    </div>
  );
}
