import api from './config';

export const orderService = {
  // Place order from cart
  placeOrderFromCart: async (userId, deliveryAddress, paymentMethod = 'COD', paymentInfo = null) => {
    try {
      const requestData = {
        userId,
        deliveryAddress,
        paymentMethod,
        ...(paymentInfo && { paymentInfo })
      };

      const response = await api.post('/orders/place-from-cart', requestData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to place order');
    }
  },

  // Place direct order
  placeOrder: async (orderData) => {
    try {
      const response = await api.post('/orders/place', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to place order');
    }
  },

  // Get user orders
  getUserOrders: async (userId) => {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch orders');
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Order not found');
    }
  },

  // Get order summary
  getOrderSummary: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/summary`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch order summary');
    }
  }
};