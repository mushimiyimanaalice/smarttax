import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Package, AlertTriangle, Search, Plus, Minus } from 'lucide-react';

const Inventory = () => {
  const { user } = useAuthStore();
  const { products, fetchProducts, isLoading } = useProductStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = filtered.filter((p) => p.quantity < 10);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-theme-primary">Inventory</h1>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800"><strong>{lowStock.length}</strong> product(s) low on stock</p>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-theme rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((product) => (
          <div key={product._id} className={`bg-theme-card rounded-xl border p-4 ${product.quantity < 10 ? 'border-amber-200 bg-amber-50/50' : 'border-theme'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-theme-primary">{product.name}</h3>
                {product.sku && <p className="text-xs text-slate-400">SKU: {product.sku}</p>}
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                product.quantity === 0 ? 'bg-red-100 text-red-700' :
                product.quantity < 10 ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {product.quantity} {product.unit || 'pcs'}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>RWF {product.price?.toLocaleString()}</span>
              <span>{product.category || 'General'}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No products in inventory</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
