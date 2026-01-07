const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with environment variables or test credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_R5uZgmenogCy4j',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET',
});

// Create a Razorpay order
const createOrder = async (amount, currency = 'INR', receipt) => {
  const options = {
    amount: Math.round(amount * 100), // Convert to paise
    currency,
    receipt: receipt || `order_${Date.now()}`,
    payment_capture: 1 // Auto capture payment
  };

  try {
    const response = await razorpay.orders.create(options);
    return {
      success: true,
      order: response
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return {
      success: false,
      error: error.error?.description || error.message || 'Failed to create Razorpay order'
    };
  }
};

// Verify payment signature
const verifyPayment = (orderId, paymentId, signature) => {
  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};

// Get Razorpay key for frontend
const getRazorpayKey = () => ({
  key: process.env.RAZORPAY_KEY_ID || 'rzp_test_R5uZgmenogCy4j'
});

module.exports = {
  razorpay,
  createOrder,
  verifyPayment,
  getRazorpayKey
};
