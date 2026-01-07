// Backend API base URL
const API_BASE_URL = "http://localhost:5001/api";

// Guest checkout - no authentication required
export async function createGuestOrder(orderData) {
  try {
    console.log("🔵 [API] Creating guest order with data:", JSON.stringify(orderData, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/orders/guest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("❌ [API] Failed to parse response as JSON:", responseText);
      throw new Error(`Invalid server response: ${responseText.substring(0, 100)}`);
    }
    
    console.log(`🔵 [API] Response status: ${response.status} ${response.statusText}`);
    console.log('🔵 [API] Response data:', responseData);
    
    if (!response.ok) {
      const errorMessage = responseData.message || 
                         responseData.error ||
                         response.statusText ||
                         'Order creation failed';
      
      const error = new Error(errorMessage);
      error.response = response;
      error.status = response.status;
      error.data = responseData;
      
      console.error('❌ [API] Server error:', {
        status: response.status,
        statusText: response.statusText,
        message: errorMessage,
        data: responseData
      });
      
      throw error;
    }
    
    console.log("✅ [API] Order created successfully");
    return responseData;
    
  } catch (error) {
    console.error("❌ [API] Error in createGuestOrder:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.data
      } : 'No response'
    });
    
    // Enhance error message for common issues
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to the server. Please check your internet connection and make sure the backend server is running.');
    }
    
    if (error.response?.status === 400) {
      throw new Error(error.data?.message || 'Invalid request. Please check your order details and try again.');
    }
    
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later or contact support if the problem persists.');
    }
    
    throw error;
  }
}

export async function createOrder(orderData) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Order creation failed");
  }
  return response.json();
}

export async function getUserOrders() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch orders");
  }
  return response.json();
}

export async function getOrderById(orderId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch order");
  }
  return response.json();
}

export async function getOrdersByEmail(email) {
  try {
    console.log(`🔵 [API] Fetching orders for email: ${email}`);
    const response = await fetch(`${API_BASE_URL}/payments/orders/customer/${encodeURIComponent(email)}`);
    
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('❌ [API] Failed to parse response as JSON:', responseText);
      throw new Error('Invalid server response');
    }
    
    if (!response.ok) {
      console.error('❌ [API] Failed to fetch orders:', responseData);
      throw new Error(responseData.message || 'Failed to fetch orders');
    }
    
    console.log(`✅ [API] Successfully fetched ${responseData.orders?.length || 0} orders`);
    return responseData.orders || [];
  } catch (error) {
    console.error('❌ [API] Error in getOrdersByEmail:', error);
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      throw new Error("Cannot connect to server. Please make sure the backend server is running on http://localhost:5002");
    }
    throw error;
  }
}

export async function updateOrderPayment(orderId, paymentData) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update payment");
  }
  return response.json();
}
