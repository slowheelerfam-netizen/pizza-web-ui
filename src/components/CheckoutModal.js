
'use client';

import { useState } from 'react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  cartTotal,
  createOrderAction,
  onOrderPlaced,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PAY_AT_REGISTER');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!isOpen) {
    return null;
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('customerName', name);
    formData.append('customerPhone', phoneNumber);
    formData.append('items', JSON.stringify(cart));
    formData.append('totalPrice', cartTotal);
    formData.append('paymentMethod', paymentMethod);
    formData.append('source', 'Online');
    formData.append('isWalkIn', 'false');

    try {
      await createOrderAction(null, formData);
      onOrderPlaced();
      onClose();
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error state in UI
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center">
      <div className="bg-slate-800 text-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-slate-400">
                  {item.size}, {item.crust}
                </p>
              </div>
              <p className="font-semibold">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-700 mt-6 pt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border-slate-700 rounded-md p-2 mt-1"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-900 border-slate-700 rounded-md p-2 mt-1"
                placeholder="(555) 555-5555"
              />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-4 mt-6">Payment Method</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="PAY_AT_REGISTER"
                checked={paymentMethod === 'PAY_AT_REGISTER'}
                onChange={() => setPaymentMethod('PAY_AT_REGISTER')}
                className="form-radio h-5 w-5 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-white">Pay Cash at Register</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="credit"
                checked={paymentMethod === 'credit'}
                onChange={() => setPaymentMethod('credit')}
                className="form-radio h-5 w-5 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-white">Credit Card</span>
            </label>
            {paymentMethod === 'credit' && (
              <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-400">Card Number</label>
                  <input type="text" className="w-full bg-slate-900 border-slate-700 rounded-md p-2 mt-1" placeholder="DO NOT ENTER INFORMATION HERE > PRESS PLACE ORDER" />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-400">Expiration Date</label>
                    <input type="text" className="w-full bg-slate-900 border-slate-700 rounded-md p-2 mt-1" placeholder="" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-400">CVV</label>
                    <input type="text" className="w-full bg-slate-900 border-slate-700 rounded-md p-2 mt-1" placeholder="" />
                  </div>
                </div>
              </div>
            )}
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="google"
                checked={paymentMethod === 'google'}
                onChange={() => setPaymentMethod('google')}
                className="form-radio h-5 w-5 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-white">Google Pay</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="apple"
                checked={paymentMethod === 'apple'}
                onChange={() => setPaymentMethod('apple')}
                className="form-radio h-5 w-5 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-white">Apple Pay</span>
            </label>
          </div>
          <div className="flex justify-between font-bold text-xl mt-6">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-indigo-700 transition-colors disabled:bg-slate-600"
          >
            {isProcessing ? 'Placing Order...' : 'Place Order'}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-transparent text-slate-400 font-bold py-3 rounded-lg mt-2 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
