import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Package, Plus, Edit2, Trash2, Search, X, AlertCircle,
  Tag, Hash, List, Layers
} from 'lucide-react';
import { useProductStore } from '../store/productStore';

const accentBlue = '#003DA5';
const accentGreen = '#00A551';
const accentYellow = '#FAD201';

const inputStyle = {
  width: '100%',
  padding: '10px 12px 10px 38px',
  borderRadius: '12px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-input)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  minHeight: '44px',
  boxSizing: 'border-box',
};

const iconWrapperStyle = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#003DA5',
  width: '18px',
  height: '18px',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  marginBottom: '6px',
  color: 'var(--text-secondary)',
};

const fieldWrapperStyle = {
  position: 'relative',
  marginBottom: '14px',
};

const btnBase = {
  minHeight: '44px',
  borderRadius: '12px',
  fontWeight: 600,
  fontSize: '15px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'background 0.2s, transform 0.1s',
  border: 'none',
};

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
    sku: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = editingProduct
      ? await updateProduct(editingProduct._id, formData)
      : await addProduct(formData);
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
      sku: product.sku || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id);
      if (!result.success) alert(result.error);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', quantity: '', taxRate: '18', category: '', description: '', sku: '' });
    setShowModal(true);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const lowStockProducts = products.filter((p) => p.quantity < 10 && p.quantity > 0);

  return (
    <div style={{ padding: '16px 16px 96px', maxWidth: '768px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {t('products.title')}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage your inventory
          </p>
        </div>
        <button
          onClick={openAddModal}
          style={{
            ...btnBase,
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: `linear-gradient(135deg, ${accentBlue}, ${accentGreen})`,
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,61,165,0.3)',
          }}
        >
          <Plus size={22} />
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div
          style={{
            marginBottom: '16px',
            background: '#FFF9E6',
            border: `1px solid ${accentYellow}`,
            borderRadius: '16px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertCircle size={18} color="#D97706" />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#92400E', margin: 0 }}>
              Low Stock Alert
            </p>
            <p style={{ fontSize: '12px', color: '#B45309', margin: '2px 0 0' }}>
              {lowStockProducts.length} product(s) running low on stock
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <div style={iconWrapperStyle}>
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            ...inputStyle,
            paddingLeft: '40px',
            background: 'var(--bg-input)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        />
      </div>

      {/* Product Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: '#EEF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}
            >
              <Package size={28} color={accentBlue} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>No products found</p>
            <button
              onClick={openAddModal}
              style={{
                marginTop: '12px',
                color: accentGreen,
                fontWeight: 600,
                fontSize: '14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Add your first product
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Gradient accent stripe */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: `linear-gradient(180deg, ${accentBlue}, ${accentGreen})`,
                }}
              />
              <div style={{ padding: '16px 16px 16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: accentGreen, margin: '6px 0 0' }}>
                    RWF {Number(product.price).toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                    <span
                      style={{
                        fontSize: '13px',
                        color: product.quantity < 10 ? '#DC2626' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Hash size={13} />
                      Stock: {product.quantity}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={13} />
                      Tax: {product.taxRate}%
                    </span>
                  </div>
                  {product.category && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '8px',
                        background: '#EEF2FF',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        color: accentBlue,
                        fontWeight: 500,
                      }}
                    >
                      <List size={11} />
                      {product.category}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      ...btnBase,
                      width: '40px',
                      height: '40px',
                      background: '#EEF2FF',
                      color: accentBlue,
                      borderRadius: '12px',
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    style={{
                      ...btnBase,
                      width: '40px',
                      height: '40px',
                      background: '#FEE2E2',
                      color: '#DC2626',
                      borderRadius: '12px',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              width: '100%',
              maxWidth: '480px',
              borderRadius: '24px 24px 0 0',
              padding: '24px',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideUp 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {editingProduct ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Edit2 size={20} color={accentBlue} />
                    {t('products.edit_product')}
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={20} color={accentBlue} />
                    {t('products.add_product')}
                  </span>
                )}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div style={fieldWrapperStyle}>
                <label style={labelStyle}>{t('products.name')}</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrapperStyle}><Package size={16} /></div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div style={fieldWrapperStyle}>
                <label style={labelStyle}>{t('products.price')}</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrapperStyle}><Tag size={16} /></div>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Quantity */}
                <div style={{ ...fieldWrapperStyle, flex: 1 }}>
                  <label style={labelStyle}>{t('products.quantity')}</label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconWrapperStyle}><Hash size={16} /></div>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                {/* Tax Rate */}
                <div style={{ ...fieldWrapperStyle, flex: 1 }}>
                  <label style={labelStyle}>{t('products.tax_rate')}</label>
                  <div style={{ position: 'relative' }}>
                    <div style={iconWrapperStyle}><Layers size={16} /></div>
                    <input
                      type="number"
                      value={formData.taxRate}
                      onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                      style={inputStyle}
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div style={fieldWrapperStyle}>
                <label style={labelStyle}>{t('products.category')}</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrapperStyle}><List size={16} /></div>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={fieldWrapperStyle}>
                <label style={labelStyle}>{t('products.description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    ...inputStyle,
                    height: '80px',
                    resize: 'vertical',
                    padding: '10px 12px',
                  }}
                  rows={3}
                />
              </div>

              <button
                type="submit"
                style={{
                  ...btnBase,
                  width: '100%',
                  background: `linear-gradient(135deg, ${accentBlue}, ${accentGreen})`,
                  color: '#fff',
                  padding: '14px',
                  marginTop: '6px',
                  boxShadow: '0 4px 14px rgba(0,61,165,0.25)',
                }}
              >
                {editingProduct ? t('common.save') : t('common.save')}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        input:focus, textarea:focus {
          border-color: ${accentBlue} !important;
          box-shadow: 0 0 0 3px rgba(0,61,165,0.12) !important;
        }
      `}</style>
    </div>
  );
};

export default Products;
