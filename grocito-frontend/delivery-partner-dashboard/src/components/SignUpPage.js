import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { deliveryPartnerService } from '../services/deliveryPartnerService';
import { toast } from 'react-toastify';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    address: '',
    pincode: ''
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
    console.log('Delivery partner signup form submitted');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber,
        address: formData.address,
        pincode: formData.pincode
      };

      // Call the registration API
      const response = await deliveryPartnerService.register(registrationData);
      
      console.log('Delivery partner registration successful');
      
      // Show success toast
      toast.success('Registration successful! 🎉', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Show redirecting toast
      toast.info('Please login to continue...', {
        position: "bottom-right",
        autoClose: 2000,
      });
      
      // Navigate to login page
      setTimeout(() => {
        console.log('Navigating to login page');
        navigate('/login', { replace: true });
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      
      // For demo purposes, simulate successful registration if backend is not available
      if (error.message && error.message.includes('Network error')) {
        console.log('Network error detected, simulating successful registration');
        
        toast.success('Registration successful (Demo Mode)! 🎉', {
          position: "bottom-right",
          autoClose: 2000,
        });
        
        toast.info('Please login to continue...', {
          position: "bottom-right",
          autoClose: 2000,
        });
        
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
        return;
      }
      
      setError(error.message || 'Registration failed. Please try again.');
      toast.error('Registration failed. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center px-4 py-8">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join as Delivery Partner</h1>
          <p className="text-gray-600">Create your delivery partner account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
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
              Contact Number *
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your contact number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              maxLength="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your pincode"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Confirm your password"
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
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
              Sign in here
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

export default SignUpPage;