const mongoose = require('mongoose');
const { razorpay, createOrder, verifyPayment } = require('../utils/razorpay');
const Order = require('../models/Order');

// @desc    Create Razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Public
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    const result = await createOrder(amount, currency, receipt);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to create Razorpay order'
      });
    }

    res.status(200).json({
      success: true,
      order: result.order
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Verify Razorpay payment and create order
// @route   POST /api/payments/verify
// @access  Public
exports.verifyRazorpayPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { orderId, paymentId, signature, orderData } = req.body;
    
    console.log('Starting payment verification for order:', orderId);
    console.log('Received payment ID:', paymentId);
    console.log('Order data received:', JSON.stringify(orderData, null, 2));

    if (!orderId || !paymentId || !signature) {
      console.error('Missing required payment verification data');
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification data',
        missingFields: {
          orderId: !orderId,
          paymentId: !paymentId,
          signature: !signature
        }
      });
    }

    // Verify the payment signature
    console.log('Verifying payment signature...');
    const isSignatureValid = verifyPayment(orderId, paymentId, signature);

    if (!isSignatureValid) {
      console.error('Invalid payment signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
        signatureValid: false
      });
    }
    
    console.log('Payment signature verified successfully');

    console.log('Received order data:', JSON.stringify(orderData, null, 2));
    
    // Extract customer info with proper fallbacks
    console.log('Extracting customer info from order data...');
    
    // First, normalize the customer info structure
    const customerInfo = orderData.customerInfo || orderData.customerDetails || {};
    const address = customerInfo.address || orderData.shippingAddress || {};
    
    // Extract order details with defaults
    const subtotal = orderData.subtotal || orderData.itemsPrice || 0;
    const tax = orderData.tax || orderData.taxPrice || 0;
    const shippingCost = orderData.shippingCost || orderData.shippingPrice || 0;
    const total = orderData.total || orderData.totalPrice || 0;
    
    const customerEmail = customerInfo.email || orderData.email || 'no-email@example.com';
    const customerPhone = customerInfo.phone || orderData.phone || '';
    
    // Handle customer name extraction
    let firstName = 'Customer';
    let lastName = '';
    
    if (customerInfo.firstName || customerInfo.lastName) {
      firstName = customerInfo.firstName || '';
      lastName = customerInfo.lastName || '';
    } else if (customerInfo.name) {
      const nameParts = customerInfo.name.split(' ');
      firstName = nameParts[0] || 'Customer';
      lastName = nameParts.slice(1).join(' ');
    } else if (orderData.customerName) {
      const nameParts = orderData.customerName.split(' ');
      firstName = nameParts[0] || 'Customer';
      lastName = nameParts.slice(1).join(' ');
    }
    
    console.log('Processed customer name:', { firstName, lastName });

    // Prepare order items with proper defaults
    console.log('Preparing order items...');
    
    const orderItems = (orderData.items || orderData.orderItems || []).map((item, index) => {
      const orderItem = {
        id: item.id || item._id || new mongoose.Types.ObjectId().toString(),
        product: item.product || item.id || new mongoose.Types.ObjectId(),
        name: item.name || `Product ${index + 1}`,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        image: item.image || '',
        description: item.description || '',
        customData: item.customData || {}
      };
      
      console.log(`Order item ${index + 1}:`, JSON.stringify(orderItem, null, 2));
      return orderItem;
    });

    // Prepare shipping address with proper fallbacks and required fields
    console.log('Preparing shipping address...');
    
    // Ensure we have a valid address object
    const shippingAddress = {
      address: (address && (address.street || address.address)) || 'Not specified',
      apartment: (address && address.apartment) || '',
      city: (address && address.city) || 'Not specified',
      state: (address && address.state) || 'Not specified',
      pincode: (address && (address.pincode || address.zipCode)) || '000000',
      country: (address && address.country) || 'India'
    };
    
    console.log('Processed shipping address:', shippingAddress);
    
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date();
    
    // Prepare order data similar to createCodOrder
    const newOrder = new Order({
      orderNumber,
      customerInfo: {
        email: customerEmail,
        phone: customerPhone,
        firstName: firstName,
        lastName: lastName
      },
      orderItems,
      shippingAddress,
      courierService: orderData.shippingMethod || orderData.courierService || 'standard',
      paymentMethod: 'Online Payment',
      itemsPrice: Number(subtotal) || 0,
      taxPrice: Number(tax) || 0,
      shippingPrice: Number(shippingCost) || 0,
      totalPrice: Number(total) || 0,
      isPaid: true,
      paidAt: now,
      paymentResult: {
        id: paymentId,
        status: 'completed',
        update_time: now.toISOString(),
        email_address: customerEmail,
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature
      },
      paymentStatus: 'paid',
      status: 'Processing',
      orderDate: now,
      createdAt: now,
      updatedAt: now
    });

    console.log('Saving order to database...');
    const savedOrder = await newOrder.save({ session });
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    console.log('Order created successfully:', {
      orderId: savedOrder._id,
      orderNumber: savedOrder.orderNumber,
      status: savedOrder.status,
      paymentStatus: savedOrder.paymentStatus,
      total: savedOrder.totalPrice
    });
    
    return res.status(201).json({
      success: true,
      message: 'Payment verified and order created successfully',
      order: {
        _id: savedOrder._id,
        orderNumber: savedOrder.orderNumber,
        status: savedOrder.status,
        paymentStatus: savedOrder.paymentStatus,
        totalPrice: savedOrder.totalPrice,
        orderDate: savedOrder.orderDate
      }
    });
    
  } catch (error) {
    console.error('Error in verifyRazorpayPayment:', error);
    
    // Try to abort transaction if it exists
    if (session && session.inTransaction) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error aborting transaction:', abortError);
      }
    }
    
    // End the session if it exists
    if (session) {
      try {
        session.endSession();
      } catch (sessionError) {
        console.error('Error ending session:', sessionError);
      }
    }
    
    // Log detailed error information
    const errorResponse = {
      success: false,
      message: 'Failed to process payment and create order',
      error: error.message
    };
    
    // Add more details in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = {
        name: error.name,
        code: error.code,
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
        stack: error.stack
      };
    }
    
    console.error('Error response:', errorResponse);
    
    // Log the error to a file or error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Add your error logging logic here
    }
    
    return res.status(500).json(errorResponse);
  }
};

// @desc    Get Razorpay key
// @route   GET /api/config/razorpay
// @access  Public
exports.getRazorpayKey = (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID
  });
};

// @desc    Get orders by email
// @route   GET /api/orders/customer/:email
// @access  Public
exports.getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const orders = await Order.find({ 'customerInfo.email': email })
      .sort({ orderDate: -1 }); // Sort by most recent first

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get orders by email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// @desc    Create Cash on Delivery order
// @route   POST /api/orders/create-cod-order
// @access  Public
exports.createCodOrder = async (req, res) => {
  try {
    const orderData = req.body;
    console.log('Received order data:', JSON.stringify(orderData, null, 2));

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create payment result for COD
    const paymentResult = {
      id: `cod-${Date.now()}`,
      status: 'pending',
      update_time: new Date().toISOString(),
      email_address: orderData.customerInfo.email,
      payment_method: 'Cash on Delivery'
    };

    // Map the incoming data to match the Mongoose schema
    const newOrder = new Order({
      orderNumber,
      customerInfo: {
        email: orderData.customerInfo.email,
        phone: orderData.customerInfo.phone || '0000000000',
        firstName: orderData.customerInfo.firstName || 'Customer',
        lastName: orderData.customerInfo.lastName || ''
      },
      orderItems: orderData.items.map((item, index) => ({
        id: item.id || `item-${Date.now()}-${index}`,
        name: item.name || `Product ${index + 1}`,
        quantity: item.quantity || 1,
        price: item.price || 0,
        image: item.image || '',
        description: item.description || '',
        customData: item.customData || {}
      })),
      shippingAddress: {
        address: orderData.customerInfo.address || orderData.customerInfo.street || 'Not provided',
        apartment: orderData.customerInfo.apartment || '',
        city: orderData.customerInfo.city || 'Not provided',
        state: orderData.customerInfo.state || 'Not provided',
        pincode: orderData.customerInfo.pincode || '000000',
        country: orderData.customerInfo.country || 'India'
      },
      courierService: orderData.shippingMethod || 'standard',
      paymentMethod: 'Cash on Delivery',
      paymentResult: paymentResult,
      itemsPrice: orderData.subtotal || 0,
      taxPrice: orderData.tax || 0,
      shippingPrice: orderData.shipping || 0,
      totalPrice: orderData.total || 0,
      isPaid: false,
      paidAt: null,
      paymentStatus: 'pending',
      status: 'Processing',
      orderDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save the order to database
    const savedOrder = await newOrder.save();
    
    // You might want to send an order confirmation email here

    // Return success response with order details
    res.status(201).json({
      success: true,
      message: 'Cash on Delivery order created successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Create COD order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Cash on Delivery order',
      error: error.message
    });
  }
};
