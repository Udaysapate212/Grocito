// Test email for the latest order
const axios = require('axios');

const sendEmailForOrder = async (orderId) => {
  try {
    // Get order details from backend
    console.log(`Fetching order details for order ID: ${orderId}`);
    const orderResponse = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
    const order = orderResponse.data;
    
    console.log('Order details:', {
      id: order.id,
      user: order.user.email,
      totalAmount: order.totalAmount,
      items: order.items.length
    });

    // Prepare order data for email service
    const orderData = {
      order: {
        id: order.id,
        orderTime: order.orderTime,
        status: order.status,
        totalAmount: order.totalAmount,
        deliveryAddress: order.deliveryAddress,
        pincode: order.pincode,
        items: order.items.map(item => ({
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
        fullName: order.user.fullName,
        email: order.user.email,
        pincode: order.user.pincode
      }
    };

    const paymentInfo = {
      paymentMethod: "COD",
      paymentId: null,
      paidAmount: order.totalAmount
    };

    const emailRequest = {
      orderData: orderData,
      paymentInfo: paymentInfo,
      userEmail: order.user.email
    };

    console.log(`Sending order confirmation email to: ${order.user.email}`);

    // Send email using the email service
    const emailResponse = await axios.post('http://localhost:3001/api/email/send-order-confirmation', emailRequest);
    
    console.log('✅ Order confirmation email sent successfully!');
    console.log('Email response:', emailResponse.data);
    console.log(`📧 Check email: ${order.user.email}`);
    
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error.response?.data || error.message);
  }
};

// Test with the latest order (ID 15)
sendEmailForOrder(15);