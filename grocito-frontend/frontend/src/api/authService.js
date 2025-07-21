import api from './config';
export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Registration failed');
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      console.log('AuthService: Making login request to /users/login');
      const response = await api.post('/users/login', { email, password });
      console.log('AuthService: Login response received:', response);
      
      const data = response.data;
      console.log('AuthService: Response data:', data);
      
      if (data.token) {
        console.log('AuthService: Token found, storing in localStorage');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || data));
        console.log('AuthService: User data stored:', data.user || data);
      } else {
        console.warn('AuthService: No token in response');
      }
      
      return data;
    } catch (error) {
      console.error('AuthService: Login error:', error);
      console.error('AuthService: Error response:', error.response);
      
      let errorMessage = 'Login failed';
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error - Backend server may not be running';
      } else {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('pincode');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  }
};