// Mock Razorpay service that simulates the Razorpay API
class MockRazorpay {
  constructor() {
    this.orders = new Map();
    this.payments = new Map();
  }

  async createOrder(options) {
    const orderId = `order_${Math.random().toString(36).substr(2, 9)}`;
    const order = {
      id: orderId,
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt || `rcpt_${Date.now()}`,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
    };
    
    this.orders.set(orderId, order);
    return order;
  }

  async verifyPayment(paymentId, orderId, signature) {
    // In a real implementation, you would verify the signature
    // For mock purposes, we'll just check if the order exists
    if (!this.orders.has(orderId)) {
      throw new Error('Order not found');
    }

    const payment = {
      id: paymentId || `pay_${Math.random().toString(36).substr(2, 9)}`,
      order_id: orderId,
      amount: this.orders.get(orderId).amount,
      currency: this.orders.get(orderId).currency,
      status: 'captured',
      created_at: Math.floor(Date.now() / 1000),
    };

    this.payments.set(payment.id, payment);
    return payment;
  }
}

// Singleton instance
const mockRazorpay = new MockRazorpay();

module.exports = {
  mockRazorpay,
  createOrder: (options) => mockRazorpay.createOrder(options),
  verifyPayment: (paymentId, orderId, signature) => 
    mockRazorpay.verifyPayment(paymentId, orderId, signature)
};
