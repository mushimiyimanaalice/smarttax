import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Trash2, CreditCard, Smartphone, DollarSign, Minus, X } from 'lucide-react';
import { useSalesStore } from '../store/salesStore';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { computeCartLine } from '../utils/tax';

const Sales = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { createSale } = useSalesStore();
  const { products, fetchProducts } = useProductStore();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const taxRate = product.taxRate || 18;
    const existingItem = cart.find(item => item.productId === product._id);
    if (existingItem) {
      const quantity = existingItem.quantity + 1;
      const line = computeCartLine(existingItem.price, quantity, taxRate);
      setCart(cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity, ...line }
          : item
      ));
    } else {
      const line = computeCartLine(product.price, 1, taxRate);
      setCart([...cart, {
        productId: product._id,
        name: product.name,
        price: product.price,
        taxRate,
        quantity: 1,
        ...line,
      }]);
    }
  };

  const updateQuantity = (index, delta) => {
    const newCart = [...cart];
    const item = newCart[index];
    const newQuantity = item.quantity + delta;
    
    if (newQuantity <= 0) {
      newCart.splice(index, 1);
    } else {
      const line = computeCartLine(item.price, newQuantity, item.taxRate);
      newCart[index] = { ...item, quantity: newQuantity, ...line };
    }
    
    setCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = cart.reduce((sum, item) => sum + item.taxAmount, 0);
    const total = cart.reduce((sum, item) => sum + item.total, 0);
    return { subtotal, tax, total };
  };

  const handleCheckout = async () => {
    const { subtotal, tax, total } = calculateTotals();
    
    const saleData = {
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      paymentMethod: selectedPayment,
      customerInfo,
      subtotal,
      taxAmount: tax,
      totalAmount: total
    };

    const result = await createSale(saleData);
    
    if (result.success) {
      setCart([]);
      setCustomerInfo({ name: '', phone: '', email: '' });
      setShowPaymentModal(false);
      alert(result.offline ? t('sales.saved_offline') : t('sales.sale_completed'));
    } else {
      alert(t('sales.error_processing'));
    }
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="pb-24">
      {/* Search Products */}
      <div className="sticky top-16 bg-gray-50 z-10 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('sales.search_products')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3 mb-32">
        {products
          .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(product => (
            <button
              key={product._id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-xl shadow-sm text-left border border-gray-100 hover:shadow-md transition active:scale-95"
            >
              <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
              <p className="text-green-600 font-bold mt-1">RWF {product.price.toLocaleString()}</p>
              <p className="text-xs text-gray-400">{t('sales.price_includes_vat')}</p>
              <p className="text-xs text-gray-500 mt-1">{t('products.stock')}: {product.quantity}</p>
            </button>
          ))}
      </div>

      {/* Cart Bottom Sheet */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg rounded-t-2xl animate-slide-up z-50">
          <div className="max-h-96 overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{t('sales.cart')} ({cart.length} items)</h3>
              <button onClick={() => setCart([])} className="text-red-500 text-sm">
                Clear All
              </button>
            </div>
            
            {cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between mb-3 pb-3 border-b">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">RWF {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(index, -1)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="ml-4 text-right">
                  <p className="font-semibold">RWF {item.total.toLocaleString()}</p>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 text-xs mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="space-y-2 mb-4 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('sales.subtotal')}</span>
                <span className="font-medium">RWF {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('sales.vat')}</span>
                <span className="font-medium">RWF {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>{t('sales.total')}</span>
                <span className="text-green-600">RWF {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              {t('sales.complete_sale')}
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-2xl animate-slide-up p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{t('sales.payment_method')}</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setSelectedPayment('cash')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition ${
                  selectedPayment === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="font-medium">{t('payment.cash')}</span>
              </button>
              <button
                onClick={() => setSelectedPayment('mobile_money')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition ${
                  selectedPayment === 'mobile_money' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <Smartphone className="w-6 h-6 text-blue-600" />
                <span className="font-medium">{t('payment.mobile_money')}</span>
              </button>
              <button
                onClick={() => setSelectedPayment('card')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition ${
                  selectedPayment === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <CreditCard className="w-6 h-6 text-purple-600" />
                <span className="font-medium">{t('payment.card')}</span>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('sales.customer_name')}</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter customer name"
              />
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
            >
              Confirm & Pay RWF {total.toLocaleString()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;