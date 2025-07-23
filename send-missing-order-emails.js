// Send emails for recent orders that didn't get emails
const axios = require('axios');

const sendMissingOrderEmails = async () => {
  try {
    console.log('📧 SENDING EMAILS FOR RECENT ORDERS');
    console.log('===================================');
    
    // Get all orders
    const ordersResponse = await axios.get('http://localhost:8080/api/orders/all');
    const orders = ordersResponse.data;
    
    // Get recent orders (last 10 orders)
    const recentOrders = orders.slice(-10);
    
    console.log(`Found ${recentOrders.length} recent orders to process...`);
    
    for (const order of recentOrders) {
      try {
        console.log(`\n📧 Processing Order #${order.id}...`);
        console.log(`   User: ${order.user.email}`);
        console.log(`   Amount: ₹${order.totalAmount}`);
        console.log(`   Status: ${order.status}`);
        
        // Prepare email data
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

        // Send email
        const emailResponse = await axios.post('http://localhost:3001/api/email/send-order-confirmation', emailRequest);
        
        if (emailResponse.data.success) {
          console.log(`   ✅ Email sent successfully! Message ID: ${emailResponse.data.messageId}`);
        } else {
          console.log(`   ❌ Email failed: ${emailResponse.data.error}`);
        }
        
        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (emailError) {
        console.log(`   ❌ Error sending email for order ${order.id}:`, emailError.message);
      }
    }
    
    console.log('\n✅ Finished processing recent orders!');
    console.log('\n📬 Check the following email addresses:');
    
    const uniqueEmails = [...new Set(recentOrders.map(order => order.user.email))];
    uniqueEmails.forEach(email => {
      console.log(`   📧 ${email}`);
    });
    
  } catch (error) {
    console.error('❌ Error processing orders:', error.message);
  }
};

sendMissingOrderEmails();