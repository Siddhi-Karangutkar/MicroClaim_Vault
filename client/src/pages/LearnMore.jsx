import { Link } from 'react-router-dom';
import { Shield, Zap, Bell, FileText, ChevronRight, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function LearnMore() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden animate-fade-in pb-20">
      
      {/* Background glowing effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      
      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10 relative">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Home</span>
        </Link>
        <Link 
          to="/auth" 
          className="px-6 py-2.5 rounded-lg font-medium bg-neon text-slate-900 hover:scale-105 active:scale-95 transition-transform inline-block shadow-lg shadow-neon/20"
        >
          Open Vault
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center z-10 relative px-6 mt-12 max-w-4xl mx-auto w-full">
        
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            How <span className="text-neon">MicroClaim Vault</span> Works
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            A simple breakdown of how we automatically protect your purchases and consumer rights.
          </p>
        </div>

        {/* Step-by-step detailed guide */}
        <div className="space-y-12 animate-fade-in-up animation-delay-200">
          
          {/* Step 1 */}
          <div className="glass-card p-8 flex flex-col md:flex-row gap-8 items-center border-l-4 border-l-blue-500">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-blue-500">1</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Upload & Smart Scanning</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Whenever you purchase a product, simply take a photo of the receipt and drop it into your Vault. 
                Our smart scanning technology instantly reads the image and figures out exactly what you bought and when.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-neon"/> Identifies the Store and Brand</li>
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-neon"/> Finds the exact Purchase Date</li>
                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-neon"/> Guesses the likely Warranty Period based on industry standards</li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card p-8 flex flex-col md:flex-row gap-8 items-center border-l-4 border-l-yellow-500">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-yellow-500">2</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Human Verification & Vaulting</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Technology is smart, but we put you in control. Before anything is permanently saved, you are presented with a simple verification form. 
                You can easily correct any typos, adjust the warranty period, or flag the item if it doesn't have a warranty.
                Once confirmed, the receipt is securely encrypted and locked away in your personal cloud vault.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card p-8 flex flex-col md:flex-row gap-8 items-center border-l-4 border-l-purple-500">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-purple-500">3</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">24/7 Expiry Monitoring</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                You no longer need to remember when a warranty ends. MicroClaim Vault keeps track of everything for you. 
                When our system detects that an item is exactly <strong>30 days away from its warranty expiration</strong>, it automatically sends an alert to your email inbox, giving you time to use it before it's too late.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-card p-8 flex flex-col md:flex-row gap-8 items-center border-l-4 border-l-neon">
            <div className="w-16 h-16 bg-neon/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-neon">4</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">1-Click Warranty Enforcement</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                If your item breaks, this is where the magic happens. Navigate to your vault and click "Claim". 
                The system will automatically generate a formal, legally-sound demand letter. 
                It then attaches your original receipt to the document, drafts an email, and sends it directly to the manufacturer's support team on your behalf.
              </p>
            </div>
          </div>

        </div>
        
        <div className="mt-16 text-center animate-fade-in-up animation-delay-400">
          <Link 
            to="/auth" 
            className="px-8 py-4 rounded-xl font-semibold bg-white text-slate-900 hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            Create Your Free Vault <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

      </main>
    </div>
  );
}
