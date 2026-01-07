import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag, FaFileInvoiceDollar } from 'react-icons/fa';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: '',
    email: '',
    paymentMethod: '',
    totalAmount: 0,
    items: []
  });

  useEffect(() => {
    console.log('Location state:', location.state);
    
    // Get order details from location state
    let orderData = null;
    
    if (location.state) {
      orderData = {
        orderNumber: location.state.orderNumber || 'N/A',
        email: location.state.email || 'Not provided',
        paymentMethod: location.state.paymentMethod || 'Online Payment',
        totalAmount: location.state.totalAmount || 0,
        items: location.state.items || []
      };
    } else {
      // If no state is available, try to get from localStorage as fallback
      const savedOrder = localStorage.getItem('lastOrder');
      if (savedOrder) {
        try {
          orderData = JSON.parse(savedOrder);
          console.log('Loaded order from localStorage:', orderData);
        } catch (e) {
          console.error('Error parsing saved order:', e);
        }
      }
    }
    
    if (orderData) {
      console.log('Setting order details:', orderData);
      setOrderDetails(orderData);
    } else {
      console.error('No order data found in location state or localStorage');
      // Redirect to home if no order data is found
      navigate('/');
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <FaCheckCircle className="text-green-600 text-5xl" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully! 🎉</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for shopping with us! Your order has been received and is being processed.
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            {orderDetails.orderNumber && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                #{orderDetails.orderNumber}
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Status</span>
              <span className="font-medium text-green-600">Confirmed</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{orderDetails.paymentMethod || 'Online Payment'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-bold text-lg">
                ₹{orderDetails.totalAmount ? orderDetails.totalAmount.toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
          
          {orderDetails.items && orderDetails.items.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
              <ul className="space-y-2">
                {orderDetails.items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-700">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="font-medium">
                      ₹{item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md mb-6 text-left">
          <p className="text-blue-700">
            <span className="font-medium">What's next?</span> We'll send you shipping confirmation when your item(s) are on the way!
          </p>
          {orderDetails.email && orderDetails.email !== 'Not provided' && (
            <p className="mt-2 text-blue-700">
              A confirmation has been sent to <span className="font-medium">{orderDetails.email}</span>
            </p>
          )}
        </div>
        
        <div className="mt-8">
          <p className="text-gray-600 mb-4">What would you like to do next?</p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <FaHome className="mr-2" />
              Back to Home
            </button>
            <button
              onClick={() => navigate('/cart?trackOrder=true')}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FaFileInvoiceDollar className="mr-2" />
              Track Your Order
            </button>
          </div>
        </div>
        
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900">Need help?</h3>
          <p className="mt-2 text-sm text-gray-500">
            Contact our customer service at{' '}
            <a href="mailto:support@example.com" className="font-medium text-indigo-600 hover:text-indigo-500">
              support@srisenthildigitalprintings.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
