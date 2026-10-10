import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Save, Store, Package, Calendar, Shield, Trash2, Plus } from 'lucide-react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function VerifyData() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [storeName, setStoreName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [receiptUrl, setReceiptUrl] = useState(null);
  
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!location.state?.extractedData) {
      navigate('/upload');
      return;
    }
    const data = location.state.extractedData;
    setStoreName(data.store_name || '');
    setPurchaseDate(data.purchase_date || '');
    setReceiptUrl(data.receipt_url || null);
    
    // Map extracted items or fallback to single item if the old format was returned
    if (data.items && Array.isArray(data.items)) {
      setItems(data.items.map((item, index) => ({ ...item, id: index, selected: true })));
    } else {
      setItems([{
        id: 0,
        brand: data.brand || '',
        product_name: data.product_name || '',
        price: data.price || '',
        warranty_months: data.warranty_months?.toString() || '0',
        selected: true
      }]);
    }
  }, [location, navigate]);

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const toggleItemSelection = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const removeRow = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addRow = () => {
    setItems([...items, { id: Date.now(), brand: '', product_name: '', price: '', warranty_months: '12', selected: true }]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const selectedItems = items.filter(i => i.selected);
    if (selectedItems.length === 0) {
      alert("Please select at least one item to save to your Vault.");
      return;
    }

    // Default to a test user if not logged in for development
    const userId = auth.currentUser ? auth.currentUser.uid : 'demo_user';
    
    setIsSaving(true);
    
    try {
      const itemsRef = collection(db, 'vaultItems');
      
      // Save each selected item as a separate document in Firestore
      const promises = selectedItems.map(item => {
        // Calculate expiration date
        const purchase = new Date(purchaseDate);
        const expirationDate = new Date(purchase);
        expirationDate.setMonth(expirationDate.getMonth() + parseInt(item.warranty_months));

        return addDoc(itemsRef, {
          userId,
          storeName,
          purchaseDate: purchase.toISOString(),
          receiptUrl,
          brand: item.brand,
          productName: item.product_name,
          price: item.price || '',
          warrantyMonths: parseInt(item.warranty_months),
          expirationDate: expirationDate.toISOString(),
          status: expirationDate > new Date() ? 'Active' : 'Expired',
          createdAt: serverTimestamp()
        });
      });

      await Promise.all(promises);
      
      setIsSaving(false);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      alert("Failed to save to database. Check if your Firebase config is correct.");
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full font-medium mb-4">
          <AlertTriangle className="w-5 h-5" /> Human Verification Required
        </div>
        <h1 className="text-3xl font-bold">Review Extracted Items</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Deselect items you don't want to track, and correct any mistakes.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Receipt Preview - Left Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="glass-card p-4 sticky top-24">
            <h3 className="font-semibold mb-4 text-center">Receipt Image</h3>
            <div className="aspect-[3/4] bg-black/10 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
              {receiptUrl ? (
                <img src={receiptUrl} alt="Receipt" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Form - Main Area */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Global Receipt Details */}
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 border-b border-slate-200 dark:border-white/10 pb-4">Receipt Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Store className="w-4 h-4" /> Store Name
                  </label>
                  <input 
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-4 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Purchase Date
                  </label>
                  <input 
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-4 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Extracted Items */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold px-2">Detected Items ({items.length})</h2>
              
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`glass-card p-6 relative transition-all duration-300 ${!item.selected ? 'opacity-50 grayscale scale-[0.98]' : 'border-l-4 border-l-neon shadow-lg'}`}
                >
                  <div className="absolute top-6 left-6 z-10">
                    <input 
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-5 h-5 accent-neon cursor-pointer"
                    />
                  </div>
                  
                  <div className="pl-10 grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Brand */}
                    <div className="md:col-span-3 space-y-2">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Brand</label>
                      <input 
                        type="text"
                        value={item.brand}
                        onChange={(e) => handleItemChange(item.id, 'brand', e.target.value)}
                        disabled={!item.selected}
                        className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-neon transition-colors"
                        required={item.selected}
                      />
                    </div>
                    
                    {/* Product */}
                    <div className="md:col-span-4 space-y-2">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Product</label>
                      <input 
                        type="text"
                        value={item.product_name}
                        onChange={(e) => handleItemChange(item.id, 'product_name', e.target.value)}
                        disabled={!item.selected}
                        className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-neon transition-colors font-medium"
                        required={item.selected}
                      />
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Price</label>
                      <input 
                        type="text"
                        value={item.price || ''}
                        onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                        disabled={!item.selected}
                        placeholder="$0.00"
                        className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-neon transition-colors"
                      />
                    </div>

                    {/* Warranty */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Warranty</label>
                      <select 
                        value={item.warranty_months}
                        onChange={(e) => handleItemChange(item.id, 'warranty_months', e.target.value)}
                        disabled={!item.selected}
                        className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-neon transition-colors appearance-none"
                      >
                        <option value="0">None</option>
                        <option value="3">3 Mo</option>
                        <option value="6">6 Mo</option>
                        <option value="12">1 Yr</option>
                        <option value="24">2 Yrs</option>
                        <option value="36">3 Yrs</option>
                        <option value="60">5 Yrs</option>
                      </select>
                    </div>

                    {/* Delete */}
                    <div className="md:col-span-1 flex items-end justify-center pb-1">
                      <button 
                        type="button" 
                        onClick={() => removeRow(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button 
                type="button"
                onClick={addRow}
                className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl text-slate-500 hover:text-neon hover:border-neon hover:bg-neon/5 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" /> Add Missing Item
              </button>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4 items-center justify-between sticky bottom-4 z-20">
              <div className="glass-card px-6 py-4 w-full flex items-center justify-between shadow-xl border-neon/50">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Saving <span className="text-neon font-bold text-lg">{items.filter(i => i.selected).length}</span> items to Vault
                </p>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 bg-neon text-slate-900 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,204,0.3)] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <><Save className="w-5 h-5" /> Save Selected</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
