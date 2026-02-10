import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getOrdersByEmail } from "../api/orderApi";
import { useNotification } from "../context/NotificationContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orderError, setOrderError] = useState("");
  const { showNotification } = useNotification();
  const [previewImage, setPreviewImage] = useState(null);

  // Clear email and orders when component unmounts or page is closed
  useEffect(() => {
    // Handle page reload/close - clear any stored data
    const handleBeforeUnload = () => {
      // Clear any potential localStorage data
      localStorage.removeItem("userEmail");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function to clear state when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      setEmail("");
      setOrders([]);
      setShowOrderHistory(false);
    };
  }, []);

  const fetchOrders = async (userEmail) => {
    if (!userEmail || !userEmail.trim()) {
      setOrderError("Please enter a valid email address");
      return;
    }
    
    setLoadingOrders(true);
    setOrderError("");
    setShowOrderHistory(false);
    try {
      const fetchedOrders = await getOrdersByEmail(userEmail);
      setOrders(fetchedOrders);
      setShowOrderHistory(true);
      
      if (fetchedOrders.length === 0) {
        setOrderError("No orders found for this email address. Make sure you entered the correct email used during checkout.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrderError(error.message || "Failed to fetch orders. Please try again.");
      setOrders([]);
      setShowOrderHistory(false);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewOrders = (e) => {
    e.preventDefault();
    fetchOrders(email);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Printing': 'bg-purple-100 text-purple-800',
      'Shipped': 'bg-indigo-100 text-indigo-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart to see them here!</p>
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {/* Order History Section for Empty Cart */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Track Your Orders</h2>
            <p className="text-gray-600 mb-4">Enter your email to view your order history</p>
            
            <form onSubmit={handleViewOrders} className="flex gap-3 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={loadingOrders}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
              >
                {loadingOrders ? "Loading..." : "View Orders"}
              </button>
            </form>

            {orderError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {orderError}
              </div>
            )}

            {showOrderHistory && orders.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Recent Orders</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="border-t pt-3 mt-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Items: <span className="font-medium text-gray-900">{order.orderItems.length}</span></p>
                            <p className="text-gray-600">Payment: <span className="font-medium text-gray-900">{order.paymentMethod}</span></p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-600">Total Amount</p>
                            <p className="text-xl font-bold text-indigo-600">₹{order.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-gray-600 mb-2">Order Items:</p>
                          <div className="space-y-1">
                            {order.orderItems.slice(0, 3).map((item, idx) => (
                              <p key={idx} className="text-xs text-gray-700">
                                • {item.name} (Qty: {item.quantity}) - ₹{item.price}
                              </p>
                            ))}
                            {order.orderItems.length > 3 && (
                              <p className="text-xs text-gray-500 italic">+ {order.orderItems.length - 3} more items</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showOrderHistory && orders.length === 0 && !loadingOrders && (
              <div className="text-center py-8 text-gray-500">
                <p>No orders found for this email address.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {/* Order History Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Track Your Orders</h2>
          <p className="text-gray-600 mb-4">Enter your email to view your order history</p>
          
          <form onSubmit={handleViewOrders} className="flex gap-3 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loadingOrders}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            >
              {loadingOrders ? "Loading..." : "View Orders"}
            </button>
          </form>

          {orderError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {orderError}
            </div>
          )}

          {showOrderHistory && orders.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Recent Orders</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Items: <span className="font-medium text-gray-900">{order.orderItems.length}</span></p>
                          <p className="text-gray-600">Payment: <span className="font-medium text-gray-900">{order.paymentMethod}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">Total Amount</p>
                          <p className="text-xl font-bold text-indigo-600">₹{order.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-600 mb-2">Order Items:</p>
                        <div className="space-y-1">
                          {order.orderItems.slice(0, 3).map((item, idx) => (
                            <p key={idx} className="text-xs text-gray-700">
                              • {item.name} (Qty: {item.quantity}) - ₹{item.price}
                            </p>
                          ))}
                          {order.orderItems.length > 3 && (
                            <p className="text-xs text-gray-500 italic">+ {order.orderItems.length - 3} more items</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showOrderHistory && orders.length === 0 && !loadingOrders && (
            <div className="text-center py-8 text-gray-500">
              <p>No orders found for this email address.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-4 border-b last:border-b-0"
                >
                  <img
                    src={item.image || "https://placehold.co/100x100/e2e8f0/475569?text=Product"}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity ring-2 ring-transparent hover:ring-indigo-400"
                    onClick={() => setPreviewImage(item)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/100x100/e2e8f0/475569?text=Product";
                    }}
                    title="Click to preview"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                    <p className="text-indigo-600 font-bold mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6">
           

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹0.00</span>
                  <p className="text-xs text-gray-500">(Standard Shipping - Free)</p>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{(getCartTotal() * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span>₹{(getCartTotal() * 1.05).toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 text-right">Express Shipping (₹99) available at checkout</p>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => {
                  showNotification(
                    <div className="flex flex-col">
                      <div className="font-medium">Clear Cart</div>
                      <div className="text-sm">Are you sure you want to clear your cart?</div>
                      <div className="flex justify-end mt-2 space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            clearCart();
                            showNotification(
                              <div className="flex items-center">
                                <span className="mr-2">🗑️</span>
                                <span>Your cart has been cleared</span>
                              </div>,
                              'success'
                            );
                          }}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Yes, Clear
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Just close the notification
                            const notification = document.querySelector('.notification');
                            if (notification) {
                              notification.style.transform = 'translateX(100%)';
                              setTimeout(() => {
                                notification.remove();
                              }, 300);
                            }
                          }}
                          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>,
                    'warning',
                    10000 // Keep it open longer since it has buttons
                  );
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Clear Cart
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full mt-3 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6">
              <img
                src={previewImage.image || "https://placehold.co/600x600/e2e8f0/475569?text=Product"}
                alt={previewImage.name}
                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x600/e2e8f0/475569?text=Product";
                }}
              />
            </div>

            {/* Product Details */}
            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{previewImage.name}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-600 font-bold text-lg">₹{previewImage.price}</p>
                  <p className="text-gray-500 text-sm">Quantity: {previewImage.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm">Subtotal</p>
                  <p className="text-xl font-bold text-gray-800">₹{previewImage.price * previewImage.quantity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
