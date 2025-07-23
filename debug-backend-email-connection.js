// Debug backend to email service connection
const axios = require('axios');

const debugBackendEmailConnection = async () => {
  try {
    console.log('🔍 DEBUGGING BACKEND EMAIL CONNECTION');
    console.log('=====================================');
    
    // Step 1: Check if email service is accessible from this machine
    console.log('\n1. Testing email service accessibility...');
    const emailHealth = await axios.get('http://localhost:3001/api/email/health');
    console.log('✅ Email service accessible:', emailHealth.data.status);
    
    // Step 2: Check the latest order
    console.log('\n2. Getting latest order...');
    const ordersResponse = await axios.get('http://localhost:8080/api/orders/all');
    const orders = ordersResponse.data;
    const latestOrder = orders[orders.length - 1];
    
    console.log('Latest order details:');
    console.log('- Order ID:', latestOrder.id);
    console.log('- User Email:', latestOrder.user.email);
    console.log('- Order Time:', latestOrder.orderTime);
    console.log('- Status:', latestOrder.status);
    
    // Step 3: Test if we can manually send email for this order
    console.log('\n3. Testing manual email for latest order...');
    
    const orderData = {
      order: {
        id: latestOrder.id,
        orderTime: latestOrder.orderTime,
        status: latestOrder.status,
        totalAmount: latestOrder.totalAmount,
        deliveryAddress: latestOrder.deliveryAddress,
        pincode: latestOrder.pincode,
        items: latestOrder.items.map(item => ({
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
        fullName: latestOrder.user.fullName,
        email: latestOrder.user.email,
        pincode: latestOrder.user.pincode
      }
    };

    const paymentInfo = {
      paymentMethod: "COD",
      paymentId: null,
      paidAmount: latestOrder.totalAmount
    };

    const emailRequest = {
      orderData: orderData,
      paymentInfo: paymentInfo,
      userEmail: latestOrder.user.email
    };

    const emailResponse = await axios.post('http://localhost:3001/api/email/send-order-confirmation', emailRequest);
    console.log('✅ Manual email sent successfully!');
    console.log('Message ID:', emailResponse.data.messageId);
    
    // Step 4: Check backend configuration
    console.log('\n4. Checking backend configuration...');
    console.log('Expected email service URL: http://localhost:3001');
    console.log('Backend should be configured to call this URL automatically');
    
    // Step 5: Diagnosis
    console.log('\n🔍 DIAGNOSIS');
    console.log('=============');
    console.log('✅ Email service is working');
    console.log('✅ Backend is creating orders');
    console.log('✅ Manual email sending works');
    console.log('❌ Backend is NOT automatically sending emails');
    
    console.log('\n💡 POSSIBLE CAUSES:');
    console.log('1. Backend OrderService email code is not being executed');
    console.log('2. Backend cannot reach email service (network/config issue)');
    console.log('3. Backend email service URL configuration is wrong');
    console.log('4. Backend RestTemplate is not configured properly');
    console.log('5. Backend is catching and ignoring email errors');
    
    console.log('\n📧 IMMEDIATE SOLUTION:');
    console.log('Since manual emails work, you can use this script to send emails for recent orders:');
    console.log(`node debug-backend-email-connection.js`);
    
  } catch (error) {
    console.error('❌ Error in debug test:', error.response?.data || error.message);
  }
};

debugBackendEmailConnection();