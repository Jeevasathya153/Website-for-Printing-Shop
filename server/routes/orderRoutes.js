const express = require('express');
const router = express.Router();
const {
  createOrder,
  createGuestOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderStatus,
  deleteOrder,
  getOrdersByEmail,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/guest', createGuestOrder); // Guest checkout - no auth required
router.post('/by-email', getOrdersByEmail); // Get orders by email - no auth required
router.put('/:id/pay', updateOrderToPaid); // Allow public access for guest orders - MUST be before /:id route

// Protected routes
router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.get('/myorders', protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder);

router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;