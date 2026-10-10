import { useState, useEffect } from 'react';
import { Plus, Search, Filter, X, Save, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { db, auth } from '../services/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('All');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit and Delete States
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ brand: '', productName: '', warrantyMonths: 12 });
  const [isSaving, setIsSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    // Default to a test user if not logged in for development
    const userId = auth.currentUser ? auth.currentUser.uid : 'demo_user';
    
    const q = query(
      collection(db, 'vaultItems'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort locally to avoid needing a Firestore composite index
      fetchedItems.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      
      setItems(fetchedItems);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching vault items:", error);
      // If Firestore fails (e.g. missing config), just use an empty array
      setItems([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const triggerDelete = (id) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, 'vaultItems', itemToDelete));
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete item.");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setEditForm({
      brand: item.brand,
      productName: item.productName,
      warrantyMonths: item.warrantyMonths
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const itemRef = doc(db, 'vaultItems', editingItem);
      
      // We need to recalculate expiration date if warranty changed
      const originalItem = items.find(i => i.id === editingItem);
      const purchase = new Date(originalItem.purchaseDate);
      const expirationDate = new Date(purchase);
      expirationDate.setMonth(expirationDate.getMonth() + parseInt(editForm.warrantyMonths));

      await updateDoc(itemRef, {
        brand: editForm.brand,
        productName: editForm.productName,
        warrantyMonths: parseInt(editForm.warrantyMonths),
        expirationDate: expirationDate.toISOString(),
        status: expirationDate > new Date() ? 'Active' : 'Expired',
      });
      
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update item.");
    }
    setIsSaving(false);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMode === 'All' || item.status === filterMode;
    return matchesSearch && matchesFilter;
  });

  const toggleFilter = () => {
    if (filterMode === 'All') setFilterMode('Active');
    else if (filterMode === 'Active') setFilterMode('Expired');
    else setFilterMode('All');
  };

  const activeCount = items.filter(i => i.status === 'Active').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in">
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-t-2 border-b-2 border-neon rounded-full animate-spin"></div>
          
          {/* Inner opposite spinning ring */}
          <div className="absolute inset-2 border-l-2 border-r-2 border-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Pulsing core glow */}
          <div className="absolute inset-4 bg-neon/20 rounded-full animate-pulse blur-md"></div>
          
          {/* Center icon */}
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 border border-neon/50 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(0,255,204,0.3)]">
            <Shield className="w-6 h-6 text-neon" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold tracking-widest uppercase mb-1">Opening Vault</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse animation-delay-100"></div>
            <div className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse animation-delay-200"></div>
            <div className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse animation-delay-300"></div>
            <span className="text-sm text-neon font-medium ml-2">Syncing records</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up relative">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Vault</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Managing <strong className="text-neon">{activeCount} active</strong> warranties.
          </p>
        </div>
        <Link 
          to="/upload"
          className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-sm flex items-center justify-center gap-2 group"
        >
          <div className="w-6 h-6 rounded-full bg-neon flex items-center justify-center group-hover:rotate-90 transition-transform">
            <Plus className="w-4 h-4 text-slate-900" />
          </div>
          Add Receipt
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-neon transition-colors" />
          <input 
            type="text" 
            placeholder="Search by product or brand..."
            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={toggleFilter}
          className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border ${
            filterMode !== 'All' 
              ? 'bg-neon text-slate-900 border-neon shadow-[0_0_15px_rgba(0,255,204,0.3)]' 
              : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          <Filter className="w-5 h-5" /> 
          {filterMode === 'All' ? 'Filter' : filterMode}
        </button>
      </div>

      {/* Grid of Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <GlassCard 
              key={item.id} 
              item={item} 
              onDelete={triggerDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-300 dark:border-white/20">
          <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No items found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or add a new receipt.</p>
        </div>
      )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-8 w-full max-w-md animate-fade-in-up border border-neon/30 shadow-[0_0_30px_rgba(0,255,204,0.15)] relative">
            <button 
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Edit Item</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Brand</label>
                <input 
                  type="text" 
                  value={editForm.brand}
                  onChange={(e) => setEditForm({...editForm, brand: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-4 focus:outline-none focus:border-neon"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Product Name</label>
                <input 
                  type="text" 
                  value={editForm.productName}
                  onChange={(e) => setEditForm({...editForm, productName: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-4 focus:outline-none focus:border-neon font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Warranty Duration (Months)</label>
                <input 
                  type="number" 
                  value={editForm.warrantyMonths}
                  onChange={(e) => setEditForm({...editForm, warrantyMonths: e.target.value})}
                  className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg py-2.5 px-4 focus:outline-none focus:border-neon"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full mt-4 bg-neon text-slate-900 font-bold py-3 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                {isSaving ? "Saving..." : <><Save className="w-5 h-5" /> Update Item</>}
              </button>
            </form>
          </div>
        </div>
      )}      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-8 w-full max-w-sm animate-fade-in-up border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)] text-center relative z-[60]">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Delete Receipt?</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              This action cannot be undone. Are you absolutely sure you want to delete this item from your vault?
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
