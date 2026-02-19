'use client';

import { useState } from 'react';

export default function OrderModal({ pizza, onClose, createOrderAction, checkCustomerWarningAction }) {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [items, setItems] = useState([]);

  if (!pizza) return null;

  const handleAddItem = () => {
    setItems([...items, { name: pizza.name, price: pizza.price, quantity: 1 }]);
  };

  const handlePlaceOrder = async () => {
    const orderDetails = {
      customerName,
      phoneNumber,
      paymentMethod,
      items: items.length > 0 ? items : [{ name: pizza.name, price: pizza.price, quantity: 1 }],
    };
    await createOrderAction(orderDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4">Order {pizza.name}</h2>
        <p className="mb-6">Price: ${pizza.price.toFixed(2)}</p>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <div>
            <label className="block mb-2">Payment Method:</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit Card"
                  checked={paymentMethod === 'Credit Card'}
                  onChange={() => setPaymentMethod('Credit Card')}
                  className="mr-2"
                />
                Credit Card
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash Onsite"
                  checked={paymentMethod === 'Cash Onsite'}
                  onChange={() => setPaymentMethod('Cash Onsite')}
                  className="mr-2"
                />
                Cash Onsite
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button onClick={handleAddItem} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Add Items
          </button>
          <button onClick={handlePlaceOrder} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
