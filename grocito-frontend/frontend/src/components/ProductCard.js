import React from 'react';

const ProductCard = ({ 
  product, 
  cartQuantity, 
  onAddToCart, 
  isAddingToCart 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-w-1 aspect-h-1 bg-gray-200 relative">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300'}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300';
          }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            product.stock > 0 
              ? product.stock <= 5 
                ? 'text-orange-600' 
                : 'text-green-600'
              : 'text-red-600'
          }`}>
            {product.stock > 0 
              ? product.stock <= 5 
                ? `Only ${product.stock} left!` 
                : `${product.stock} in stock`
              : 'Out of stock'
            }
          </span>
          
          {cartQuantity > 0 ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-primary-600 font-medium">
                In cart: {cartQuantity}
              </span>
              <button
                onClick={() => onAddToCart(product.id)}
                disabled={product.stock === 0 || isAddingToCart}
                className="bg-primary-500 text-white px-3 py-1 rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-colors duration-200"
              >
                {isAddingToCart ? '...' : '+'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product.id)}
              disabled={product.stock === 0 || isAddingToCart}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200 transform hover:scale-105"
            >
              {isAddingToCart ? (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                'Add to Cart'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;