// Test order confirmation email
const axios = require('axios');

const orderData = {
  order: {
    id: 14,
    orderTime: "2025-07-23T03:22:17.694662",
    status: "PLACED",
    totalAmount: 140.0,
    deliveryAddress: "nehru bhavan ,dehli",
    pincode: "110001",
    items: [
      {
        name: "Paneer",
        quantity: 1,
        price: 90.0,
        product: {
          name: "Paneer",
          price: 90.0
        }
      },
      {
        name: "Butter", 
        quantity: 1,
        price: 50.0,
        product: {
          name: "Butter",
          price: 50.0
        }
      }
    ]
  },
  user: {
    fullName: "kshitij",
    email: "kshitijkumbhar007@gmail.com",
    pincode: "110001"
  }
};

const paymentInfo = {
  paymentMethod: "COD",
  paymentId: null,
  paidAmount: 140.0
};

const emailRequest = {
  orderData: orderData,
  paymentInfo: paymentInfo,
  userEmail: "kshitijkumbhar007@gmail.com"
};

console.log('Sending order confirmation email...');

axios.post('http://localhost:3001/api/email/send-order-confirmation', emailRequest)
  .then(response => {
    console.log('✅ Order confirmation email sent successfully!');
    console.log('Response:', response.data);
    console.log('Check email: kshitijkumbhar007@gmail.com');
  })
  .catch(error => {
    console.error('❌ Error sending order confirmation email:', error.response?.data || error.message);
  });