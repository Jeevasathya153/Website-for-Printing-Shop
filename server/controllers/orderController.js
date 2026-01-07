const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order (Guest Checkout)
// @route   POST /api/orders/guest
// @access  Public
exports.createGuestOrder = async (req, res) => {
  try {
    const {
      customerInfo,
      orderItems,
      shippingAddress,
      courierService,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    // Validation
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    if (!customerInfo || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({ message: 'Customer information is required' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Create order
    const order = await Order.create({
      customerInfo,
      orderItems,
      shippingAddress,
      courierService,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 
                     paymentMethod === 'upi' ? 'UPI' : 'Online Payment',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      status: 'Pending',
    });

    // Send order confirmation email
    try {
      const itemsList = orderItems.map(item => 
        `<li>${item.name} - Qty: ${item.quantity || 1} - ₹${item.price}</li>`
      ).join('');

      const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Order Confirmation</h1>
          <p>Dear ${customerInfo.firstName} ${customerInfo.lastName},</p>
          <p>Thank you for your order!</p>
          
          <h2>Order Details:</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          
          <h3>Items Ordered:</h3>
          <ul>${itemsList}</ul>
          
          <h3>Delivery Address:</h3>
          <p>
            ${shippingAddress.address}${shippingAddress.apartment ? ', ' + shippingAddress.apartment : ''}<br>
            ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}
          </p>
          
          <h3>Order Summary:</h3>
          <p>Subtotal: ₹${itemsPrice.toFixed(2)}</p>
          <p>Shipping: ₹${shippingPrice.toFixed(2)}</p>
          <p>Tax: ₹${taxPrice.toFixed(2)}</p>
          <p><strong>Total: ₹${totalPrice.toFixed(2)}</strong></p>
          
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Courier Service:</strong> ${courierService}</p>
          
          <p>We will process your order shortly and keep you updated.</p>
          <p>For any queries, please contact us.</p>
          
          <p>Best regards,<br>Sri Senthil Digital Printing</p>
        </div>
      `;

      await sendEmail({
        email: customerInfo.email,
        subject: 'Order Confirmation - Sri Senthil Digital Printing',
        message,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the order if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id,
      order,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new order (Authenticated)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // Send order confirmation email
    try {
      const message = `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>Order ID: ${order._id}</p>
        <p>Total Amount: ₹${totalPrice}</p>
        <p>We will process your order shortly.</p>
      `;

      await sendEmail({
        email: req.user.email,
        subject: 'Order Confirmation - Sri Senthil Digital Printing',
        message,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product');

    if (order) {
      // Check if user is authorized to view this order
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }

      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Public (for guest orders)
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      
      // Update payment method if provided
      if (req.body.paymentMethod) {
        order.paymentMethod = req.body.paymentMethod;
      }
      
      // Update order status to Processing after successful payment
      if (order.status === 'Pending') {
        order.status = 'Processing';
      }

      const updatedOrder = await order.save();
      
      // Send payment confirmation email
      try {
        const sendEmail = require('../utils/sendEmail');
        const itemsList = order.orderItems.map(item => 
          `<li>${item.name} - Qty: ${item.quantity || 1} - ₹${item.price}</li>`
        ).join('');

        const message = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Payment Confirmed!</h1>
            <p>Dear ${order.customerInfo.firstName} ${order.customerInfo.lastName},</p>
            <p>Your payment has been successfully received.</p>
            
            <h2>Order Details:</h2>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Amount Paid:</strong> ₹${order.totalPrice.toFixed(2)}</p>
            <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h3>Items Ordered:</h3>
            <ul>${itemsList}</ul>
            
            <p>Your order is now being processed and will be delivered soon.</p>
            <p>Thank you for your business!</p>
            
            <p>Best regards,<br>Sri Senthil Digital Printing</p>
          </div>
        `;

        await sendEmail({
          email: order.customerInfo.email,
          subject: 'Payment Confirmation - Sri Senthil Digital Printing',
          message,
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
      }
      
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'email');

    if (order) {
      order.status = req.body.status || order.status;

      if (req.body.status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();

      // Send status update email
      try {
        // Determine email address (guest order or authenticated user)
        const customerEmail = order.customerInfo?.email || order.user?.email;
        const customerName = order.customerInfo 
          ? `${order.customerInfo.firstName} ${order.customerInfo.lastName}`
          : order.user?.name || 'Customer';

        if (customerEmail) {
          const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #4F46E5;">Order Status Update</h1>
              <p>Dear ${customerName},</p>
              <p>Your order status has been updated.</p>
              
              <h2>Order Details:</h2>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>New Status:</strong> ${order.status}</p>
              <p><strong>Updated On:</strong> ${new Date().toLocaleDateString()}</p>
              
              <p>Thank you for your business!</p>
              
              <p>Best regards,<br>Sri Senthil Digital Printing</p>
            </div>
          `;

          await sendEmail({
            email: customerEmail,
            subject: 'Order Status Update - Sri Senthil Digital Printing',
            message,
          });
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders by email (for guest users)
// @route   POST /api/orders/by-email
// @access  Public
exports.getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const orders = await Order.find({ 'customerInfo.email': email })
      .sort({ createdAt: -1 })
      .limit(10); // Limit to last 10 orders

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};