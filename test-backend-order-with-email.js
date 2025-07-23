// Test backend order placement with automatic email sending
const axios = require('axios');

const testOrderPlacement = async () => {
  try {
    console.log('Testing backend order placement with automatic email...');
    
    // First, let's add some items to cart for user ID 24 (kshitijkumbhar007@gmail.com)
    const userId = 24;
    const deliveryAddress = "Test Address for Email";
    
    console.log('Step 1: Adding items to cart...');
    
    // Add Paneer to cart
    await axios.post('http://localhost:8080/api/cart/add', {
      userId: userId,
      productId: 7, // Paneer
      quantity: 1
    });
    
    // Add Butter to cart
    await axios.post('http://localhost:8080/api/cart/add', {
      userId: userId,
      productId: 8, // Butter
      quantity: 1
    });
    
    console.log('Step 2: Placing order from cart...');
    
    // Place order from cart (this should automatically send email)
    const orderResponse = await axios.post(
      `http://localhost:8080/api/orders/place-from-cart?userId=${userId}&deliveryAddress=${encodeURIComponent(deliveryAddress)}`
    );
    
    console.log('✅ Order placed successfully!');
    console.log('Order ID:', orderResponse.data.id);
    console.log('User Email:', orderResponse.data.user.email);
    console.log('Total Amount:', orderResponse.data.totalAmount);
    
    console.log('📧 If email service is working, an email should have been sent to:', orderResponse.data.user.email);
    console.log('Check the email service console for sending confirmation.');
    
  } catch (error) {
    console.error('❌ Error testing order placement:', error.response?.data || error.message);
  }
};

testOrderPlacement();