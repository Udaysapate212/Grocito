import React from 'react';
import { useNavigate } from 'react-router-dom';

const FloatingCartButton = ({ cartCount = 0, show = true }) => {
  const navigate = useNavigate();

  if (!show || cartCount === 0) return null;

  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40"
      title="View Cart"
    >
      <div className="relative">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      </div>
    </button>
  );
};

export default FloatingCartButton;