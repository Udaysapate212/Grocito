import React from 'react';
import { authService } from '../../api/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  // Safety check for user data
  if (!currentUser) {
    console.error('AdminDashboard: No current user found');
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully', {
      position: "bottom-right",
      autoClose: 2000,
    });
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-admin-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-admin-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-admin-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-admin-900">Grocito Admin</h1>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-admin-900">
                  {currentUser?.fullName || 'Admin User'}
                </p>
                <p className="text-xs text-admin-500">
                  {currentUser?.email || 'admin@grocito.com'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-admin-100 hover:bg-admin-200 text-admin-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-admin-900 mb-2">
            Welcome back, {currentUser?.fullName || 'Admin User'}! 👨‍💼
          </h2>
          <p className="text-admin-600">
            Here's what's happening with your grocery delivery platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-admin-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-admin-600">Total Users</p>
                <p className="text-2xl font-bold text-admin-900">1,234</p>
              </div>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-admin-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-admin-600">Active Orders</p>
                <p className="text-2xl font-bold text-admin-900">89</p>
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-admin-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-admin-600">Total Products</p>
                <p className="text-2xl font-bold text-admin-900">567</p>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-admin-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-admin-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-admin-900">₹45,678</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-admin-200 mb-8">
          <h3 className="text-lg font-semibold text-admin-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/users')}
              className="flex items-center p-4 bg-admin-50 hover:bg-admin-100 rounded-lg transition-colors"
            >
              <svg className="w-8 h-8 text-admin-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <div className="text-left">
                <p className="font-medium text-admin-900">Manage Users</p>
                <p className="text-sm text-admin-600">View and manage all users</p>
              </div>
            </button>

            <button className="flex items-center p-4 bg-admin-50 hover:bg-admin-100 rounded-lg transition-colors">
              <svg className="w-8 h-8 text-admin-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <div className="text-left">
                <p className="font-medium text-admin-900">Manage Orders</p>
                <p className="text-sm text-admin-600">Track and update orders</p>
              </div>
            </button>

            <button className="flex items-center p-4 bg-admin-50 hover:bg-admin-100 rounded-lg transition-colors">
              <svg className="w-8 h-8 text-admin-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div className="text-left">
                <p className="font-medium text-admin-900">Manage Products</p>
                <p className="text-sm text-admin-600">Add and edit products</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-admin-200">
          <h3 className="text-lg font-semibold text-admin-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-admin-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-admin-900">New order #1234 received</p>
                <p className="text-xs text-admin-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-admin-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-admin-900">New user registered: john@example.com</p>
                <p className="text-xs text-admin-600">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-admin-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-admin-900">Product "Fresh Apples" low in stock</p>
                <p className="text-xs text-admin-600">10 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;