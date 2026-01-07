import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { CartContext } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";

// Razorpay configuration
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Contact Information
    email: "",
    phone: "",
    
    // Delivery Information
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    
    // Delivery Method
    courierService: "",
    
    // Payment Method
    paymentMethod: 'cod', // 'cod' or 'razorpay'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Contact validation
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10 digits";
    
    // Delivery validation
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits";
    
    if (!formData.courierService) newErrors.courierService = "Please select a courier service";
    
    return newErrors;
  };

  // Set default shipping method to standard if not set
  useEffect(() => {
    if (!formData.courierService) {
      setFormData(prev => ({ ...prev, courierService: 'standard' }));
    }
    
    const initializeRazorpay = async () => {
      try {
        const isLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!isLoaded) {
          showNotification('Failed to load payment processor. Please refresh the page.', 'error');
        }
      } catch (error) {
        console.error('Error loading Razorpay:', error);
        showNotification('Failed to load payment processor. Please refresh the page.', 'error');
      }
    };

    initializeRazorpay();
  }, [formData.courierService, showNotification]);

  // Load Razorpay script and get config
  useEffect(() => {
    const initializeRazorpay = async () => {
      try {
        const isLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!isLoaded) {
          throw new Error('Failed to load Razorpay SDK');
        }
      } catch (error) {
        console.error('Error loading Razorpay:', error);
        showNotification('Failed to load payment processor. Please refresh the page.', 'error');
      }
    };

    initializeRazorpay();
  }, []);

  const processRazorpayPayment = async (orderData) => {
    try {
      setIsLoading(true);
      
      // Create order on our server with proper data structure
      const orderRequest = {
        amount: Math.round(orderData.total * 100), // Convert to paise (smallest currency unit for INR)
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        customerInfo: {
          firstName: orderData.customerInfo.firstName || 'Customer',
          lastName: orderData.customerInfo.lastName || '',
          email: orderData.customerInfo.email || '',
          phone: orderData.customerInfo.phone || '',
          address: {
            street: orderData.customerInfo.address?.street || '',
            apartment: orderData.customerInfo.address?.apartment || '',
            city: orderData.customerInfo.address?.city || '',
            state: orderData.customerInfo.address?.state || '',
            pincode: orderData.customerInfo.address?.pincode || '',
            country: 'India'
          }
        },
        items: orderData.items.map(item => ({
          _id: item.product || item._id || new Date().getTime().toString(),
          name: item.name || 'Unnamed Product',
          quantity: item.quantity || 1,
          price: item.price || 0,
          image: item.image || '',
          description: item.description || ''
        })),
        shippingMethod: orderData.shippingMethod || 'standard',
        subtotal: orderData.subtotal || 0,
        tax: orderData.tax || 0,
        shippingCost: orderData.shipping || 0,
        total: orderData.total || 0,
        orderNotes: orderData.orderNotes || ''
      };
      
      console.log('Sending order to server:', JSON.stringify(orderRequest, null, 2));
      
      console.log('Sending order to server:', JSON.stringify(orderRequest, null, 2));
      
      const response = await axios.post('http://localhost:5001/api/payments/create-order', orderRequest, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { order } = response.data;

      if (!order || !order.id) {
        throw new Error('Failed to create payment order');
      }

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        const loaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!loaded) {
          throw new Error('Failed to load Razorpay SDK');
        }
      }

      // Store the navigation function in a variable
      const navigateToSuccess = (orderId, paymentMethod = 'online') => {
        // Calculate order details using the consistent function
        const { subtotal, tax, shipping, total } = calculateOrderTotal();
        
        // Prepare order details
        const orderDetails = {
          orderNumber: orderId,
          email: formData.email || orderData?.customerInfo?.email,
          paymentMethod: paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery',
          subtotal,
          tax,
          shipping,
          totalAmount: total,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          orderDate: new Date().toISOString()
        };
        
        console.log('Navigating to success with order details:', orderDetails);
        
        // Clear cart before navigation
        clearCart();
        
        // Navigate with state
        navigate('/order-success', {
          state: orderDetails,
          replace: true  // Prevent going back to checkout
        });
        
        // Also save to localStorage as backup
        localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
      };

      // Store order data for success page
      const orderDetails = {
        orderNumber: order.id,
        email: orderData.customerInfo.email,
        paymentMethod: 'Online Payment',
        totalAmount: orderData.total,
        items: orderData.items || []
      };

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_R5uZgmenogCy4j',
        amount: order.amount,
        currency: order.currency,
        name: 'Sri Senthil Digital Printing',
        description: `Order Payment - ${order.receipt}`,
        order_id: order.id,
        handler: async function (razorpayResponse) {
          console.log('Razorpay payment successful:', razorpayResponse);
          
          try {
            // Show loading state
            setIsLoading(true);
            
            // Calculate order totals using the consistent function
            const { subtotal, tax, shipping, total } = calculateOrderTotal();
            
            // Prepare complete order data with all required amount fields
            const completeOrderData = {
              ...orderData,
              paymentStatus: 'paid',
              status: 'processing',
              paymentMethod: 'Razorpay',
              paymentId: razorpayResponse.razorpay_payment_id,
              razorpayOrderId: order.id,
              orderDate: new Date().toISOString(),
              customerInfo: {
                ...orderData.customerInfo,
                name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`.trim()
              },
              items: orderData.items || [],
              shippingMethod: orderData.shippingMethod || 'standard',
              // Ensure all amount fields are included and consistent
              subtotal: subtotal,
              shipping: shipping,  // This matches the server's expected field name
              shippingCost: shipping,  // Keep both for backward compatibility
              tax: tax,
              total: total,
              // Add these for extra clarity and consistency
              itemsPrice: subtotal,
              shippingPrice: shipping,
              taxPrice: tax,
              totalPrice: total
            };

            console.log('Sending verification request with data:', {
              orderId: order.id,
              paymentId: razorpayResponse.razorpay_payment_id,
              signature: razorpayResponse.razorpay_signature,
              orderData: completeOrderData
            });

            // Verify payment and save order on our server
            const verifyResponse = await axios.post('http://localhost:5001/api/payments/verify', {
              orderId: order.id,
              paymentId: razorpayResponse.razorpay_payment_id,
              signature: razorpayResponse.razorpay_signature,
              orderData: completeOrderData
            }, {
              headers: {
                'Content-Type': 'application/json'
              },
              timeout: 30000 // 30 seconds timeout
            });

            console.log('Verification response:', verifyResponse.data);

            if (verifyResponse.data && verifyResponse.data.success) {
              const savedOrderId = verifyResponse.data.order?._id || order.id;
              
              if (!savedOrderId) {
                console.error('No order ID in verification response:', verifyResponse.data);
                throw new Error('Order ID not received from server');
              }
              
              console.log('Payment and order verification successful, order ID:', savedOrderId);
              
              // Clear the cart first
              clearCart();
              
              // Show success message with order details
              showNotification(
                <div className="flex flex-col">
                  <div className="font-bold text-lg">🎉 Order Placed Successfully!</div>
                  <div className="mt-1">Your order #{savedOrderId} has been confirmed.</div>
                </div>,
                'success'
              );
              
              // Navigate to success page with order details
              navigateToSuccess(savedOrderId, 'online');
            } else {
              console.error('Payment verification failed:', verifyResponse.data);
              // If we get here, the payment was successful but order creation failed
              // We should still clear the cart to prevent duplicate orders
              clearCart();
              
              // Show error but still navigate to success page with the Razorpay order ID
              showNotification('🎉 Order Placed Successfully!', 'success');
              
              // Navigate to success page with the information we have
              navigateToSuccess(order.id, 'online');
              
              // Re-throw the error for error tracking
              throw new Error(verifyResponse.data.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            
            // Even if there's an error, if we have a payment ID, we should clear the cart
            // to prevent duplicate orders
            if (razorpayResponse?.razorpay_payment_id) {
              console.warn('Error after successful payment. Clearing cart to prevent duplicates.');
              clearCart();
              
              // Navigate to success page with the information we have
              navigateToSuccess(order.id, 'online');
              
              // Show a warning instead of an error
              showNotification(
                'Your payment was successful' ,
                'success'
              );
            } else {
              // If we don't have a payment ID, show the actual error
              let errorMessage = 'Payment verification failed. Please contact support.';
              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              } else if (error.message) {
                errorMessage = error.message;
              } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. Please check your order status before trying again.';
              }
              
              showNotification(errorMessage, 'error');
            }
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`.trim(),
          email: orderData.customerInfo.email,
          contact: orderData.customerInfo.phone
        },
        notes: {
          order_receipt: order.receipt
        },
        theme: {
          color: '#4F46E5' // indigo-600
        },
        modal: {
          ondismiss: function(reason) {
            console.log('Razorpay modal dismissed:', reason);
            setIsLoading(false);
            // Remove the notification for modal dismissal
          },
          escape: true,
          confirm_close: true,
          handleBack: true
        }
      };

      const rzp = new window.Razorpay(options);
      
      // Handle payment failure
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        // Only show notification if not already showing one
        if (!document.querySelector('.Toastify__toast-container')) {
          showNotification(`Payment failed: ${response.error?.description || 'Please try again'}`, 'error');
        }
        setIsLoading(false);
      });

      // Track component mount state
      let isMounted = true;
      
      // Handle modal close
      rzp.on('modal.closed', function (response) {
        console.log('Razorpay modal closed by user');
        
        // Only update state if component is still mounted
        if (isMounted) {
          setIsLoading(false);
          // Don't show notification if payment was successful or already failed
          if (!response || !response.error) {
            try {
              showNotification('Payment window was closed. Your order was not placed.', 'info');
            } catch (e) {
              console.warn('Error showing notification after modal close:', e);
            }
          }
        }
      });

      // Remove the ondismiss handler from options since we're using modal.closed event
      delete options.modal.ondismiss;
      
      // Open the payment modal
      rzp.open();
      
      // Add a cleanup function to handle page navigation
      const handleBeforeUnload = () => {
        rzp.close();
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Cleanup function to be called when component unmounts
      const cleanup = () => {
        isMounted = false;
        window.removeEventListener('beforeunload', handleBeforeUnload);
        
        // Close Razorpay if it's still open
        if (rzp && typeof rzp.close === 'function') {
          try {
            rzp.close();
          } catch (e) {
            console.warn('Error closing Razorpay:', e);
          }
        }
      };
      
      // Set up cleanup on component unmount
      return cleanup;
    } catch (error) {
      console.error('Razorpay payment error:', error);
      showNotification(error.response?.data?.message || 'Error processing payment. Please try again.', 'error');
      setIsLoading(false);
      throw error;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handlePlaceOrder(e);
  };

  // Function to calculate order totals consistently
  const calculateOrderTotal = () => {
    const subtotal = getCartTotal();
    const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% tax
    const shipping = formData.courierService === 'express' ? 99 : 0;
    const total = subtotal + tax + shipping;
    
    return {
      subtotal,
      tax,
      shipping,
      total
    };
  };

  // Function to navigate to success page
  const navigateToSuccess = (orderId, paymentMethod = 'online') => {
    try {
      // Calculate order details using the consistent function
      const { subtotal, tax, shipping, total } = calculateOrderTotal();
      
      // Get cart items for order summary
      const orderItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));
      
      // Clear the cart
      clearCart();
      
      // Navigate to order success page with order details
      navigate('/order-success', {
        state: { 
          orderNumber: orderId,
          email: formData.email,
          paymentMethod: paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery',
          subtotal,
          tax,
          shipping,
          totalAmount: total,
          items: orderItems,
          orderDate: new Date().toISOString()
        },
        replace: true // Prevent going back to checkout
      });
    } catch (error) {
      console.error('Error in navigateToSuccess:', error);
      // Fallback navigation if something goes wrong
      navigate('/order-success', { 
        state: { 
          orderNumber: orderId,
          message: 'Thank you for your order! You will receive a confirmation email shortly.'
        },
        replace: true
      });
    }
  };

  const handlePlaceOrder = async (e) => {
    e?.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.log('Form validation errors:', validationErrors);
      setErrors(validationErrors);
      return;
    }

    console.log('Starting order placement...');
    setIsLoading(true);

    try {
      // Calculate order totals using the consistent function
      const { subtotal, tax, shipping, total } = calculateOrderTotal();
      
      // Create order data for Razorpay
      const orderData = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India'
        },
        paymentMethod: 'online',
        orderStatus: 'pending',
        paymentStatus: 'pending',
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        total: total,
        orderDate: new Date().toISOString(),
        orderNotes: ''
      };

      console.log('Order data being sent:', JSON.stringify(orderData, null, 2));
      
      if (formData.paymentMethod === 'razorpay') {
        console.log('Processing Razorpay payment...');
        try {
          await processRazorpayPayment(orderData);
          return; // Exit after initiating Razorpay payment
        } catch (error) {
          console.error('Error in processRazorpayPayment:', error);
          throw error; // Re-throw to be caught by the outer catch block
        }
      } else {
        console.log('Processing Cash on Delivery order...');
        
        // Create order on the server
        const response = await axios.post('http://localhost:5001/api/payments/create-cod-order', orderData, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 seconds timeout
        });
        
        console.log('Order API response:', response.data);
        
        if (response.data.success) {
          // Show success message
          showNotification('Order placed successfully! You will receive a confirmation email shortly.', 'success');
          
          // Navigate to success page with order details
          navigateToSuccess(response.data.order._id, 'cod');
        } else {
          throw new Error(response.data.message || 'Failed to place order');
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      
      let errorMessage = 'Failed to place order. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.05; // 5% tax
  const shipping = formData.courierService === 'express' ? 99 : 0;
  const total = subtotal + tax + shipping;
// ... (previous imports remain the same)

return (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Sri Senthil Digital Printing</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">Need help?</span>
            <a href="tel:+919876543210" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              <span className="hidden sm:inline">Call us: </span>+91 9876543210
            </a>
          </div>
        </div>
      </div>
    </header>

    <form onSubmit={handleFormSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Checkout Form */}
        <div className="lg:w-7/12">
          {/* Progress Steps */}
         
        
          {/* Contact & Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Contact & Shipping Information</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="you@example.com"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="9876543210"
                    required
                    pattern="[0-9]{10}"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="First name"
                    required
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Last name"
                    required
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="123 Main St"
                  required
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* Apartment, City, State, ZIP */}
              <div>
                <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="City"
                    required
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>
                <div className="md:col-span-1">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="State"
                    required
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
                <div className="md:col-span-1">
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.pincode ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="ZIP/Postal code"
                    required
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Shipping Method</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="standard-shipping"
                    name="courierService"
                    type="radio"
                    value="standard"
                    checked={formData.courierService === 'standard'}
                    onChange={handleInputChange}
                    className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 ${
                      errors.courierService ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <label htmlFor="standard-shipping" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Standard Shipping</span>
                    <span className="block text-sm text-gray-500">3-5 business days</span>
                  </label>
                  <span className="ml-auto text-sm font-medium text-gray-900">Free</span>
                </div>
                <div className="flex items-center">
                  <input
                    id="express-shipping"
                    name="courierService"
                    type="radio"
                    value="express"
                    checked={formData.courierService === 'express'}
                    onChange={handleInputChange}
                    className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 ${
                      errors.courierService ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <label htmlFor="express-shipping" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Express Shipping</span>
                    <span className="block text-sm text-gray-500">1-2 business days</span>
                  </label>
                  <span className="ml-auto text-sm font-medium text-gray-900">₹99.00</span>
                </div>
                {errors.courierService && (
                  <p className="mt-1 text-sm text-red-600">{errors.courierService}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Cash on Delivery */}
                <div className="relative">
                  <input
                    className="sr-only peer"
                    id="cod"
                    name="paymentMethod"
                    type="radio"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <label
                    className="flex p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:ring-2 peer-checked:ring-indigo-500 peer-checked:border-transparent"
                    htmlFor="cod"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${formData.paymentMethod === 'cod' ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Cash on Delivery (COD)</h3>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-indigo-600 ml-auto ${formData.paymentMethod === 'cod' ? 'block' : 'hidden'}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </label>
                </div>

                {/* Online Payment */}
                <div className="relative">
                  <input
                    className="sr-only peer"
                    id="razorpay"
                    name="paymentMethod"
                    type="radio"
                    value="razorpay"
                    checked={formData.paymentMethod === 'razorpay'}
                    onChange={handleInputChange}
                  />
                  <label
                    className="flex p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:ring-2 peer-checked:ring-indigo-500 peer-checked:border-transparent"
                    htmlFor="razorpay"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${formData.paymentMethod === 'razorpay' ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Pay Online</h3>
                        <p className="text-sm text-gray-500">Credit/Debit Card, UPI, Netbanking</p>
                      </div>
                    </div>
              
                    <svg
                      className={`w-5 h-5 text-indigo-600 ml-auto ${formData.paymentMethod === 'razorpay' ? 'block' : 'hidden'}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </label>
                </div>
              </div>

              {formData.paymentMethod === 'razorpay' ? (
                <div className="bg-blue-50 p-4 rounded-md mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        You will be redirected to Razorpay's secure payment gateway to complete your payment.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-md mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Pay with cash when your order is delivered. A small additional fee may apply.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : formData.paymentMethod === 'cod' ? (
                'Place Order (Cash on Delivery)'
              ) : (
                'Pay Securely'
              )}
            </button>
            <p className="mt-3 text-center text-sm text-gray-500">
              By placing your order, you agree to our{' '}
              <a href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-5/12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div className="p-6">
              {/* Cart Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 -mr-2">
                {cart.map((item) => {
                  const itemImage = item.images?.[0] || item.image || "https://via.placeholder.com/150";
                  const itemPrice = Number(item.price || 0);
                  const itemQuantity = Number(item.quantity || 1);
                  const totalPrice = itemPrice * itemQuantity;

                  return (
                    <div key={item.id || item._id} className="flex items-start py-4 border-b last:border-0">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={itemImage}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="ml-4 text-sm font-medium text-gray-900">
                            ₹{totalPrice.toFixed(2)}
                          </p>
                        </div>
                        {item.color && (
                          <p className="mt-1 text-xs text-gray-500 flex items-center">
                            <span
                              className="w-3 h-3 rounded-full mr-1 border border-gray-300"
                              style={{ backgroundColor: item.color }}
                            ></span>
                            {item.color}
                          </p>
                        )}
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-sm text-gray-500">Qty: {itemQuantity}</p>
                          {itemQuantity > 1 && (
                            <p className="text-xs text-gray-500">
                              ₹{itemPrice.toFixed(2)} × {itemQuantity}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Total */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping > 0 ? `₹${shipping.toFixed(2)}` : 'Free'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-lg font-bold text-indigo-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500 text-center">
                  Including ₹{tax.toFixed(2)} in taxes
                </p>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500"
                 
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2 text-xs text-gray-600">Secure Checkout</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500"
                
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2 text-xs text-gray-600">SSL Encrypted</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              
          
            </div>
          </div>
        </div>
      </div>
    </form>

    {/* Footer */}
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Sri Senthil Digital Printing. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
);
}

export default CheckoutPage;
