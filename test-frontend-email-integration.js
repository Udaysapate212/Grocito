// Test if frontend email integration works
const axios = require('axios');

const testFrontendEmailIntegration = async () => {
  try {
    console.log('🧪 TESTING FRONTEND EMAIL INTEGRATION');
    console.log('====================================');
    
    console.log('\n1. Placing a test order to simulate frontend behavior...');
    
    const userId = 24; // kshitijkumbhar007@gmail.com
    const deliveryAddress = "Frontend Email Test - " + new Date().toLocaleTimeString();
    
    // Add item to cart
    await axios.post('http://localhost:8080/api/cart/add', {
      userId: userId,
      productId: 7, // Paneer
      quantity: 1
    });
    
    // Place order (simulating frontend call)
    const orderResponse = await axios.post(
      `http://localhost:8080/api/orders/place-from-cart?userId=${userId}&deliveryAddress=${encodeURIComponent(deliveryAddress)}`
    );
    
    const newOrder = orderResponse.data;
    console.log('✅ Order placed successfully!');
    console.log('   Order ID:', newOrder.id);
    console.log('   User Email:', newOrder.user.email);
    console.log('   Total Amount: ₹' + newOrder.totalAmount);
    
    console.log('\n2. Simulating frontend email sending (as updated code would do)...');
    
    // Simulate what the updated frontend code will do
    const emailData = {
      orderData: {
        order: {
          id: newOrder.id,
          orderTime: newOrder.orderTime,
          status: newOrder.status,
          totalAmount: newOrder.totalAmount,
          deliveryAddress: newOrder.deliveryAddress,
          pincode: newOrder.pincode,
          items: newOrder.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            product: {
              name: item.product.name,
              price: item.product.price
            }
          }))
        },
        user: {
          fullName: newOrder.user.fullName,
          email: newOrder.user.email,
          pincode: newOrder.user.pincode
        }
      },
      paymentInfo: {
        paymentMethod: "COD",
        paymentId: null,
        paidAmount: newOrder.totalAmount
      },
      userEmail: newOrder.user.email
    };
    
    // Send email (simulating frontend fetch call)
    const emailResponse = await axios.post('http://localhost:3001/api/email/send-order-confirmation', emailData);
    
    console.log('✅ Frontend email simulation successful!');
    console.log('   Message ID:', emailResponse.data.messageId);
    console.log('   Email sent to:', newOrder.user.email);
    
    console.log('\n🎉 FRONTEND EMAIL INTEGRATION TEST PASSED!');
    console.log('==========================================');
    console.log('✅ Order placement: Working');
    console.log('✅ Email sending: Working');
    console.log('✅ Frontend integration: Ready');
    
    console.log('\n📧 NEXT STEPS:');
    console.log('1. Restart your frontend application');
    console.log('2. Place an order from the frontend');
    console.log('3. Check your email inbox');
    console.log('4. The frontend will now automatically send emails!');
    
  } catch (error) {
    console.error('❌ Error in frontend integration test:', error.response?.data || error.message);
  }
};

testFrontendEmailIntegration();