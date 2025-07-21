import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ deliveryPartner }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('deliveryPartnerToken');
    localStorage.removeItem('deliveryPartner');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h.01M15 9h.01M9 15h.01M15 15h.01" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">Grocito</span>
            </div>
            <div className="hidden md:block">
              <span className="text-sm text-gray-600 bg-orange-100 px-3 py-1 rounded-full">
                Delivery Partner
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 hidden sm:block">Online</span>
            </div>
            
            {/* Profile Section */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">
                  {deliveryPartner?.fullName || 'Delivery Partner'}
                </div>
                <div className="text-xs text-gray-500">
                  {deliveryPartner?.email}
                </div>
              </div>
              
              {/* Profile Avatar */}
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {deliveryPartner?.fullName?.charAt(0) || 'D'}
                </span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;