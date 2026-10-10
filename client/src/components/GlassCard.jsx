import { ShieldAlert, ShieldCheck, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GlassCard({ item, onEdit, onDelete }) {
  const { brand, productName, purchaseDate, warrantyMonths, status } = item;
  
  // Calculate expiry and progress
  const purchase = new Date(purchaseDate);
  const expiry = new Date(purchase);
  expiry.setMonth(expiry.getMonth() + warrantyMonths);
  
  const totalDuration = expiry.getTime() - purchase.getTime();
  const timeElapsed = Date.now() - purchase.getTime();
  let progress = Math.max(0, Math.min(100, (timeElapsed / totalDuration) * 100));
  
  // Days left calculation
  const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;
  if (isExpired) progress = 100;

  // Determine status color
  let statusColor = "text-neon";
  let bgProgress = "bg-neon";
  let statusText = `${daysLeft} days left`;
  let Icon = ShieldCheck;

  if (isExpired) {
    statusColor = "text-red-500";
    bgProgress = "bg-red-500";
    statusText = "Expired";
    Icon = ShieldAlert;
  } else if (daysLeft <= 30) {
    statusColor = "text-yellow-500";
    bgProgress = "bg-yellow-500";
    Icon = ShieldAlert;
  }

  return (
    <div className="glass-card p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
      
      {/* Background glow based on status */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none ${bgProgress}`}></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{brand}</p>
          <h3 className="text-xl font-bold mt-1 text-slate-900 dark:text-white leading-tight">{productName}</h3>
        </div>
        <div className={`flex flex-col items-end ${statusColor}`}>
          <Icon className="w-6 h-6 mb-1" />
          <span className="text-xs font-bold uppercase">{statusText}</span>
        </div>
      </div>

      <div className="mt-auto space-y-4 relative z-10">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Purchased: {purchase.toLocaleDateString()}</span>
          <span>Expires: {expiry.toLocaleDateString()}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden border border-slate-300 dark:border-white/10">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${bgProgress}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
          <span className={`text-sm font-medium ${isExpired ? 'text-red-500' : 'text-slate-500'}`}>
            Status: {status}
          </span>
          <div className="flex gap-4 items-center">
            {/* Action Buttons */}
            <button 
              onClick={(e) => { e.preventDefault(); onEdit(item); }}
              className="text-slate-400 hover:text-neon transition-colors"
              title="Edit Item"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); onDelete(item.id); }}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Delete Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <Link to={`/item/${item.id}`} className="text-sm font-medium hover:text-neon transition-colors flex items-center gap-1">
              View Details <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
