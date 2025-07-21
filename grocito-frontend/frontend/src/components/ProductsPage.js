import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../api/productService';
import { cartService } from '../api/cartService';
import { authService } from '../api/authService';
import { toast } from 'react-toastify';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import SearchAndFilter from './SearchAndFilter';
import ProductCard from './ProductCard';
import QuickStartGuide from './QuickStartGuide';
import FloatingCartButton from './FloatingCartButton';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();
  const pincode = localStorage.getItem('pincode');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getProductsByPincode(pincode);
      setProducts(productsData);
      setFilteredProducts(productsData);

      // Extract unique categories
      const uniqueCategories = [...new Set(productsData.map(product => product.category))];
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      setError('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartData = async (userId) => {
    try {
      const cartData = await cartService.getCartItems(userId);
      setCartItems(cartData);
      setCartCount(cartData.reduce((total, item) => total + item.quantity, 0));
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    console.log('ProductsPage useEffect triggered');
    const currentUser = authService.getCurrentUser();
    console.log('Current user:', currentUser);
    console.log('Current pincode:', pincode);
    
    if (!currentUser) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }
    setUser(currentUser);

    if (!pincode) {
      console.log('No pincode found, redirecting to landing page');
      toast.info('Please select your delivery location first', {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate('/');
      return;
    }

    console.log('Fetching products and cart data');
    fetchProducts();
    fetchCartData(currentUser.id);

    // Show guide for first-time users
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (!hasSeenGuide) {
      setTimeout(() => setShowGuide(true), 1000); // Delay guide to let page load
    }
  }, [navigate, pincode]);

  // Filter products based on category and search
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  const addToCart = async (productId) => {
    try {
      setAddingToCart(prev => ({ ...prev, [productId]: true }));
      await cartService.addToCart(user.id, productId, 1);
      await fetchCartData(user.id);
      toast.success('Added to cart!', {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const getCartItemQuantity = (productId) => {
    const cartItem = cartItems.find(item => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenGuide', 'true');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50">
      <Header user={user} cartCount={cartCount} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-green-700">
              Fresh Groceries Delivered Fast
            </h1>
          </div>
          <p className="text-gray-700 text-lg">
            Choose from <span className="font-semibold text-green-600 bg-yellow-200 px-3 py-1 rounded-full">{products.length}</span> products available in your area
          </p>
        </div>

        <SearchAndFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          resultsCount={filteredProducts.length}
          totalCount={products.length}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-lg">🔍</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {products.length === 0 ? 'No products available' : 'No products found'}
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
              {products.length === 0
                ? "We're working to stock products in your area. Please check back soon!"
                : searchQuery || selectedCategory !== 'All'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No products match your criteria'
              }
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cartQuantity={getCartItemQuantity(product.id)}
                onAddToCart={addToCart}
                isAddingToCart={addingToCart[product.id]}
              />
            ))}
          </div>
        )}

        {/* Success Message */}
        {products.length > 0 && (
          <div className="mt-12 bg-white border-2 border-green-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-3">
              🎉 Welcome to Grocito!
            </h3>
            <p className="text-gray-700 mb-6 text-lg">
              You're all set! Browse products, add them to cart, and place your order for quick delivery to <span className="font-semibold bg-yellow-200 px-2 py-1 rounded-full text-green-700">{pincode}</span>.
            </p>
            <button
              onClick={() => setShowGuide(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-green-700 px-8 py-4 rounded-xl font-bold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Need help? View quick tour →
            </button>
          </div>
        )}
      </main>

      {showGuide && <QuickStartGuide onClose={handleCloseGuide} />}
      <FloatingCartButton cartCount={cartCount} />
    </div>
  );
};

export default ProductsPage;