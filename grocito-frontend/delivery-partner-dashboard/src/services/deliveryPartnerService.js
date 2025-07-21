import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/delivery-partners';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const deliveryPartnerService = {
  // Register a new delivery partner
  register: async (deliveryPartnerData) => {
    try {
      console.log('Registering delivery partner:', deliveryPartnerData);
      const response = await api.post('/register', deliveryPartnerData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // Server responded with error status
        throw new Error(error.response.data || 'Registration failed');
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error. Please check your connection.');
      } else {
        // Something else happened
        throw new Error('Registration failed. Please try again.');
      }
    }
  },

  // Login delivery partner
  login: async (email, password) => {
    try {
      console.log('Logging in delivery partner:', email);
      const response = await api.post('/login', { email, password });
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          throw new Error('Invalid email or password');
        }
        throw new Error(error.response.data || 'Login failed');
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error. Please check your connection.');
      } else {
        // Something else happened
        throw new Error('Login failed. Please try again.');
      }
    }
  },

  // Get delivery partner profile
  getProfile: async (id) => {
    try {
      console.log('Fetching delivery partner profile:', id);
      const response = await api.get(`/${id}`);
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      if (error.response) {
        throw new Error(error.response.data || 'Failed to fetch profile');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to fetch profile. Please try again.');
      }
    }
  },

  // Update delivery partner profile
  updateProfile: async (id, profileData) => {
    try {
      console.log('Updating delivery partner profile:', id, profileData);
      const response = await api.put(`/${id}/profile`, profileData);
      console.log('Update profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      if (error.response) {
        throw new Error(error.response.data || 'Failed to update profile');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to update profile. Please try again.');
      }
    }
  },

  // Change password
  changePassword: async (id, oldPassword, newPassword) => {
    try {
      console.log('Changing password for delivery partner:', id);
      const response = await api.put(`/${id}/password`, {
        oldPassword,
        newPassword
      });
      console.log('Change password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      if (error.response) {
        throw new Error(error.response.data || 'Failed to change password');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to change password. Please try again.');
      }
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      console.log('Requesting password reset for:', email);
      const response = await api.post('/forgot-password', { email });
      console.log('Forgot password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response) {
        throw new Error(error.response.data || 'Failed to send reset email');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to send reset email. Please try again.');
      }
    }
  },
  
  // Get assigned orders
  getAssignedOrders: async (id) => {
    try {
      console.log('Fetching assigned orders for delivery partner:', id);
      const response = await api.get(`/${id}/orders`);
      console.log('Assigned orders response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get assigned orders error:', error);
      if (error.response) {
        throw new Error(error.response.data || 'Failed to fetch assigned orders');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to fetch assigned orders. Please try again.');
      }
    }
  },
  
  // Update order status
  updateOrderStatus: async (partnerId, orderId, status) => {
    try {
      console.log(`Updating order ${orderId} status to ${status} for delivery partner ${partnerId}`);
      const response = await api.put(`/${partnerId}/orders/${orderId}/status`, { status });
      console.log('Update order status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      if (error.response) {
        throw new Error(error.response.data || 'Failed to update order status');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Failed to update order status. Please try again.');
      }
    }
  }
};