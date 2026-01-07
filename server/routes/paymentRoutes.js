const express = require('express');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
  createCodOrder,
  getOrdersByEmail
} = require('../controllers/paymentController');

const router = express.Router();

// @route   GET /api/config/razorpay
// @desc    Get Razorpay key
// @access  Public
router.get('/config/razorpay', getRazorpayKey);

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Public
router.post('/create-order', createRazorpayOrder);

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment
// @access  Public
router.post('/verify', verifyRazorpayPayment);

// @route   POST /api/orders/create-cod-order
// @desc    Create a new Cash on Delivery order
// @access  Public
router.post('/create-cod-order', createCodOrder);

// @route   GET /api/payments/orders/customer/:email
// @desc    Get orders by customer email
// @access  Public
router.get('/orders/customer/:email', getOrdersByEmail);

module.exports = router;
