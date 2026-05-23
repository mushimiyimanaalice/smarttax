// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Plus, Edit2, Trash2, Search, X, AlertCircle } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import api from '../services/api';

const Products = () => {
  const { t } = useTranslation();
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    taxRate: '18',
    category: '',
    description: '',
    sku: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    
    if (editingProduct) {
      result = await updateProduct(editingProduct._id, formData);
    } else {
      result = await addProduct(formData);
    }
    
    if (result.success) {
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', quantity: '', taxRate: '18', category: '', description: '', sku: '' });
    } else {
      alert(result.error || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      taxRate: product.taxRate,
      category: product.category || '',
      description: product.description || '',
      sku: product.sku || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockProducts = products.filter(p => p.quantity < 10 && p.quantity > 0);

  return (
    <div className="py-4 pb-24">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('products.title')}</h1>
          <p className="text-gray-600 text-sm mt-1">Manage your inventory</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', price: '', quantity: '', taxRate: '18', category: '', description: '', sku: '' });
            setShowModal(true);
          }}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Low Stock Alert</span>
          </div>
          <p className="text-xs text-yellow-700">
            {lowStockProducts.length} product(s) are running low on stock
          </p>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-green-600 font-medium"
            >
              Add your first product
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-green-600 font-bold mt-1">RWF {product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className={`text-sm ${product.quantity < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                      Stock: {product.quantity}
                    </p>
                    <p className="text-sm text-gray-600">Tax: {product.taxRate}%</p>
                  </div>
                  {product.category && (
                    <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-2xl animate-slide-up p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingProduct ? t('products.edit_product') : t('products.add_product')}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('products.name')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.price')}</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.quantity')}</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.tax_rate')}</label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({...formData, taxRate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.category')}</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                {editingProduct ? t('common.save') : t('common.save')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;