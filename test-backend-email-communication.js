// Test if backend can communicate with email service
const axios = require('axios');

const testBackendEmailCommunication = async () => {
  try {
    console.log('Testing backend to email service communication...');
    
    // Test 1: Check if email service is running
    console.log('1. Checking email service health...');
    const healthResponse = await axios.get('http://localhost:3001/api/email/health');
    console.log('✅ Email service is healthy:', healthResponse.data.status);
    
    // Test 2: Check if backend is running
    console.log('2. Checking backend health...');
    const backendResponse = await axios.get('http://localhost:8080/api/orders/all');
    console.log('✅ Backend is running, found', Array.isArray(backendResponse.data) ? backendResponse.data.length : 0, 'orders');
    
    // Test 3: Get the latest order details
    console.log('3. Getting latest order details...');
    const orders = backendResponse.data;
    if (orders && orders.length > 0) {
      const latestOrder = orders[orders.length - 1];
      console.log('Latest order:', {
        id: latestOrder.id,
        userEmail: latestOrder.user.email,
        status: latestOrder.status,
        totalAmount: latestOrder.totalAmount
      });
      
      // Test 4: Try to send email for this order manually
      console.log('4. Testing manual email sending for latest order...');
      
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
      console.log('Email response:', emailResponse.data);
      console.log(`📧 Check email: ${latestOrder.user.email}`);
      
    } else {
      console.log('No orders found to test with');
    }
    
  } catch (error) {
    console.error('❌ Error in communication test:', error.response?.data || error.message);
  }
};

testBackendEmailCommunication();