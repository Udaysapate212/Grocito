import api from './config';

export const cartService = {
  // Add item to cart
  addToCart: async (userId, productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', {
        userId,
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to add item to cart');
    }
  },

  // Get cart items for user
  getCartItems: async (userId) => {
    try {
      const response = await api.get(`/cart/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch cart items');
    }
  },

  // Get cart summary with product details
  getCartSummary: async (userId) => {
    try {
      const response = await api.get(`/cart/${userId}/summary`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch cart summary');
    }
  },

  // Get cart total
  getCartTotal: async (userId) => {
    try {
      const response = await api.get(`/cart/${userId}/total`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to calculate cart total');
    }
  },

  // Validate cart items
  validateCartItems: async (userId) => {
    try {
      const response = await api.get(`/cart/${userId}/validate`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to validate cart');
    }
  },

  // Update cart item quantity
  updateCartItem: async (userId, productId, quantity) => {
    try {
      const response = await api.put('/cart/update', {
        userId,
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to update cart item');
    }
  },

  // Remove item from cart
  removeFromCart: async (userId, productId) => {
    try {
      const response = await api.delete('/cart/remove', {
        data: { userId, productId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to remove item from cart');
    }
  },

  // Clear entire cart
  clearCart: async (userId) => {
    try {
      const response = await api.delete(`/cart/${userId}/clear`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to clear cart');
    }
  }
};