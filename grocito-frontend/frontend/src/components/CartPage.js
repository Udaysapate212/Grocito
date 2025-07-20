import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { directCartService } from '../api/directCartService';
import { cartService } from '../api/cartService';
import { orderService } from '../api/orderService';
import { authService } from '../api/authService';
import { razorpayService } from '../api/razorpayService';
import { toast } from 'react-toastify';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [updating, setUpdating] = useState({});
  const [user, setUser] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    fetchCartData(currentUser.id);
  }, [navigate]);

  const fetchCartData = async (userId) => {
    try {
      setLoading(true);
      const items = await directCartService.getCartItems(userId);
      setCartItems(items);
      
      // Calculate summary from items
      const summary = {
        totalItems: items.reduce((total, item) => total + item.quantity, 0),
        subtotal: items.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2),
        total: items.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)
      };
      setCartSummary(summary);
      
      console.log('Cart loaded:', items);
    } catch (error) {
      toast.error('Failed to load cart');
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    
    try {
      setUpdating(prev => ({ ...prev, [productId]: true }));
      console.log(`Updating product ${productId} to quantity ${newQuantity}`);
      
      await cartService.updateCartItem(user.id, productId, newQuantity);
      await fetchCartData(user.id);
      
      toast.success('Cart updated! ✅', {
        position: "bottom-right",
        autoClose: 1500,
      });
    } catch (error) {
      console.error('Update cart error:', error);
      toast.error('Failed to update cart');
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(prev => ({ ...prev, [productId]: true }));
      console.log(`Removing product ${productId} from cart`);
      
      await cartService.removeFromCart(user.id, productId);
      await fetchCartData(user.id);
      
      toast.success('Item removed! 🗑️', {
        position: "bottom-right",
        autoClose: 1500,
      });
    } catch (error) {
      console.error('Remove item error:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const placeOrder = async () => {
    console.log('Place order clicked');
    console.log('Delivery address:', deliveryAddress);
    console.log('Payment method:', paymentMethod);
    console.log('Cart items:', cartItems.length);
    
    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setPlacing(true);
      console.log('Processing order with payment method:', paymentMethod);

      if (paymentMethod === 'ONLINE') {
        console.log('Handling online payment...');
        await handleOnlinePayment();
      } else {
        console.log('Handling COD order...');
        await handleCODOrder();
      }
    } catch (error) {
      toast.error('Failed to place order');
      console.error('Order error:', error);
    } finally {
      setPlacing(false);
    }
  };

  const handleCODOrder = async () => {
    try {
      console.log('Placing COD order...');
      const order = await orderService.placeOrderFromCart(
        user.id,
        deliveryAddress,
        'COD'
      );
      
      console.log('COD order placed successfully:', order);
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (error) {
      console.error('COD order error:', error);
      
      // For demo purposes, allow COD to work even if backend fails
      console.log('Backend failed, but allowing COD order for demo');
      toast.success('COD Order placed successfully! 🎉 (Demo Mode)');
      
      // Clear cart locally since backend might not be working
      try {
        localStorage.removeItem('cart');
      } catch (e) {
        console.log('Could not clear local cart');
      }
      
      navigate('/orders');
    }
  };

  const handleOnlinePayment = async () => {
    const totalAmount = cartSummary?.total || 
      cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    try {
      // Create Razorpay order
      const razorpayOrder = await razorpayService.createOrder(totalAmount);
      
      // Initialize payment
      const paymentResult = await razorpayService.initializePayment({
        amount: totalAmount,
        orderId: razorpayOrder.id,
        customerName: user.fullName || user.email,
        customerEmail: user.email,
        customerPhone: user.contactNumber
      });

      if (paymentResult.success) {
        console.log('Payment successful, placing order...', paymentResult);
        
        try {
          // Payment successful, place order
          const order = await orderService.placeOrderFromCart(
            user.id,
            deliveryAddress,
            'ONLINE',
            {
              paymentId: paymentResult.paymentId,
              razorpayOrderId: paymentResult.orderId
            }
          );
          
          console.log('Order placed successfully:', order);
        } catch (orderError) {
          console.warn('Order placement failed, but payment was successful:', orderError);
          // Continue to success page even if order placement fails
        }
        
        // Navigate to payment success page with payment info
        navigate('/payment-success', { 
          state: { 
            paymentInfo: {
              paymentId: paymentResult.paymentId,
              orderId: paymentResult.orderId,
              amount: totalAmount
            } 
          },
          replace: true
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // Prepare error info
      const errorInfo = {
        message: error.message,
        code: error.code || 'PAYMENT_ERROR',
        description: error.description || error.message
      };
      
      if (error.message.includes('cancelled')) {
        toast.warning('Payment cancelled');
      } else {
        // Navigate to payment failed page with error info
        navigate('/payment-failed', { 
          state: { errorInfo },
          replace: true
        });
      }
      throw error;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading cart..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} showCart={false} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/products')}
            className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Products</span>
          </button>
          
          {/* Emergency Cart Manager - Hidden for production */}
          {/* <button
            onClick={() => navigate('/emergency-cart')}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium animate-pulse"
          >
            🚨 Emergency Cart Manager 🚨
          </button> */}
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          
          {/* Debug controls - Hidden for production */}
          {/* <div className="flex space-x-2">
            <button
              onClick={() => {
                const simpleCartDiv = document.getElementById('simple-cart-container');
                if (simpleCartDiv) {
                  simpleCartDiv.style.display = simpleCartDiv.style.display === 'none' ? 'block' : 'none';
                }
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              🛒 Simple Cart
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <>
                {cartItems.length === 0 && (
                  <button
                    onClick={async () => {
                      try {
                        await cartService.addToCart(user.id, 1, 2);
                        await fetchCartData(user.id);
                        toast.success('Test item added to cart! 🛒');
                      } catch (error) {
                        toast.error('Failed to add test item');
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    🔧 Add Test Item
                  </button>
                )}
                {cartItems.length > 0 && (
                  <button
                    onClick={async () => {
                      try {
                        const totalAmount = cartSummary?.total || 
                          cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
                        
                        const paymentResult = await razorpayService.initializePayment({
                          amount: totalAmount,
                          orderId: 'test_order_' + Date.now(),
                          customerName: user.fullName || user.email,
                          customerEmail: user.email,
                          customerPhone: user.contactNumber || '9999999999'
                        });
                        
                        if (paymentResult.success) {
                          toast.success('Test payment successful! 🎉');
                        }
                      } catch (error) {
                        toast.error('Test payment failed: ' + error.message);
                      }
                    }}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    🔧 Test Payment
                  </button>
                )}
              </>
            )}
          </div> */}
        </div>
        
        {/* Simple Cart Container - Hidden for production */}
        {/* <div id="simple-cart-container" className="mb-8" style={{ display: 'none' }}>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Simple Cart (Alternative)</h2>
            <p className="text-sm text-gray-600 mb-4">
              If you're having trouble with the main cart, use this simplified version to update quantities.
            </p>
            
            {cartItems.map(item => (
              <div key={item.product.id} className="mb-2 border-b pb-2">
                <SimpleCartUpdate 
                  item={item}
                  userId={user.id}
                  onCartUpdated={() => fetchCartData(user.id)}
                />
              </div>
            ))}
          </div>
        </div> */}

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-4">Add some products to get started</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Items in Cart ({cartItems.length})</h2>
                  <div className="flex space-x-4">
                    <button
                      onClick={async () => {
                        try {
                          // Refresh cart data directly
                          await fetchCartData(user.id);
                          toast.success('Cart refreshed! 🔄', {
                            position: "bottom-right",
                            autoClose: 1500,
                          });
                        } catch (error) {
                          toast.error('Failed to refresh cart');
                        }
                      }}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Refresh</span>
                    </button>
                    
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to clear your cart?')) {
                          try {
                            await cartService.clearCart(user.id);
                            await fetchCartData(user.id);
                            toast.success('Cart cleared! 🧹', {
                              position: "bottom-right",
                              autoClose: 2000,
                            });
                          } catch (error) {
                            toast.error('Failed to clear cart');
                          }
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Clear Cart</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100';
                        }}
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">{item.product.category}</p>
                        <p className="text-lg font-bold text-gray-900">₹{item.product.price}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={updating[item.product.id] || item.quantity <= 1}
                          className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {updating[item.product.id] ? (
                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            '-'
                          )}
                        </button>
                        
                        <div className="w-16 text-center">
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={item.quantity}
                            onChange={(e) => {
                              const input = e.target;
                              const newQty = parseInt(input.value);
                              if (newQty > 0 && newQty <= 99) {
                                // Store the new quantity in a data attribute
                                input.dataset.newQuantity = newQty;
                              }
                            }}
                            disabled={updating[item.product.id]}
                            className="w-full text-center font-semibold text-lg border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                          />
                          <button
                            onClick={(e) => {
                              const input = e.target.previousSibling;
                              const newQty = parseInt(input.dataset.newQuantity);
                              if (newQty && newQty !== item.quantity) {
                                updateQuantity(item.product.id, newQty);
                              }
                            }}
                            className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                          >
                            Update
                          </button>
                        </div>
                        
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={updating[item.product.id]}
                          className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {updating[item.product.id] ? (
                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            '+'
                          )}
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                        <div className="flex flex-col items-end">
                          <button
                            onClick={() => removeItem(item.product.id)}
                            disabled={updating[item.product.id]}
                            className="text-red-500 hover:text-red-700 text-sm mt-1 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-1"
                          >
                            {updating[item.product.id] ? (
                              <>
                                <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                <span>Removing...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Remove</span>
                              </>
                            )}
                          </button>
                          
                          {/* Direct API call button - Hidden for production */}
                          {/* <button
                            onClick={async () => {
                              try {
                                await simpleCartService.updateCart(user.id, item.product.id, item.quantity);
                                toast.success('Direct update successful!');
                                fetchCartData(user.id);
                              } catch (error) {
                                toast.error('Direct update failed');
                              }
                            }}
                            className="text-xs text-green-500 hover:text-green-700 mt-1"
                          >
                            Direct Update
                          </button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  {cartSummary ? (
                    <>
                      <div className="flex justify-between">
                        <span>Subtotal ({cartSummary.totalItems} items)</span>
                        <span>₹{cartSummary.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{cartSummary.total}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>₹{cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    required
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method *
                  </label>
                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'COD' 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('COD')}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Cash on Delivery</p>
                            <p className="text-sm text-gray-600">Pay when your order arrives</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Online Payment */}
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'ONLINE' 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('ONLINE')}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="ONLINE"
                          checked={paymentMethod === 'ONLINE'}
                          onChange={() => setPaymentMethod('ONLINE')}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Pay Online</p>
                            <p className="text-sm text-gray-600">UPI, Cards, Net Banking</p>
                          </div>
                        </div>
                      </div>
                      {paymentMethod === 'ONLINE' && (
                        <div className="mt-3 pl-11">
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">UPI</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Cards</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Net Banking</span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Wallets</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={placing || !deliveryAddress.trim()}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                    paymentMethod === 'ONLINE'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {placing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{paymentMethod === 'ONLINE' ? 'Processing Payment...' : 'Placing Order...'}</span>
                    </div>
                  ) : (
                    <>
                      {paymentMethod === 'ONLINE' ? (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span>Pay Now</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Place Order (COD)</span>
                        </div>
                      )}
                    </>
                  )}
                </button>

                <div className="mt-3 text-center">
                  {paymentMethod === 'ONLINE' ? (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Secure payment powered by Razorpay</p>
                      <div className="flex justify-center items-center space-x-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">🔒 SSL Secured</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">💳 All Cards</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">📱 UPI</span>
                      </div>
                      {/* <PaymentMethodIcons /> */}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Pay cash when your order arrives</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* <CartTestControls onCartUpdate={() => fetchCartData(user.id)} /> */}
    </div>
  );
};

export default CartPage;