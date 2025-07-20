import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';

const Header = ({ user, cartCount = 0, showCart = true, showOrders = true }) => {
  const navigate = useNavigate();
  const pincode = localStorage.getItem('pincode');

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Grocito</span>
            </button>
            {pincode && (
              <div className="text-sm text-gray-600">
                Delivering to: <span className="font-medium">{pincode}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {showCart && (
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="View Cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            )}
            
            {showOrders && (
              <button
                onClick={() => navigate('/orders')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Orders
              </button>
            )}
            
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 text-sm">
                Hello, {user?.fullName || user?.email?.split('@')[0] || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;