import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { deliveryPartnerService } from '../services/deliveryPartnerService';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Delivery partner login form submitted with:', { email: formData.email, password: '***' });
    setLoading(true);
    setError('');

    try {
      // Call the login API
      const response = await deliveryPartnerService.login(formData.email, formData.password);
      
      // Store authentication data
      localStorage.setItem('deliveryPartnerToken', 'dp-token-' + Date.now());
      localStorage.setItem('deliveryPartner', JSON.stringify(response));
      
      console.log('Delivery partner login successful');
      
      // Show success toast
      toast.success('Login successful! 🎉', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Show redirecting toast
      toast.info('Going to dashboard...', {
        position: "bottom-right",
        autoClose: 1000,
      });
      
      // Navigate to dashboard
      setTimeout(() => {
        console.log('Navigating to dashboard');
        navigate('/dashboard', { replace: true });
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      
      // For demo purposes, allow login with any credentials if backend is not available
      if (error.message && error.message.includes('Network error')) {
        console.log('Network error detected, using demo mode');
        
        // Create a mock delivery partner object
        const mockPartner = {
          id: 1,
          fullName: formData.email.split('@')[0] || 'Demo Partner',
          email: formData.email,
          contactNumber: '123-456-7890',
          address: 'Demo Address',
          pincode: '110001',
          registeredDate: new Date().toISOString().split('T')[0],
          isActive: true
        };
        
        // Store mock data
        localStorage.setItem('deliveryPartnerToken', 'dp-token-' + Date.now());
        localStorage.setItem('deliveryPartner', JSON.stringify(mockPartner));
        
        toast.success('Login successful (Demo Mode)! 🎉', {
          position: "bottom-right",
          autoClose: 2000,
        });
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
        return;
      }
      
      setError(error.message || 'Login failed. Please try again.');
      toast.error('Login failed. Please check your credentials.', {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h.01M15 9h.01M9 15h.01M15 15h.01" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">Grocito</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Partner Login</h1>
          <p className="text-gray-600">Sign in to your delivery partner account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Account */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Account:</h3>
          <div className="text-xs text-gray-600">
            <div>Email: delivery@grocito.com</div>
            <div>Password: delivery123</div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-medium">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Back to Main Site */}
        <div className="mt-4 text-center">
          <a 
            href="http://localhost:3000" 
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Grocito Main Site
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;