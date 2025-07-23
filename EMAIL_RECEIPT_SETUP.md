# Email Receipt & Bill Functionality Setup

This document explains the email receipt and bill functionality that sends payment receipts and order confirmations to customers.

## 🚀 Features

- **Order Confirmation Emails**: Sent when orders are placed (COD or Online)
- **Payment Receipt Emails**: Sent when online payments are successfully verified
- **Professional HTML Templates**: Beautiful, responsive email templates
- **Automatic Integration**: Seamlessly integrated with payment verification flow
- **Fallback Support**: Graceful handling when email service is unavailable

## 📧 Email Service Architecture

### Components

1. **Node.js Email Service** (`email-service/`)
   - Dedicated microservice for email functionality
   - Runs on port 3001
   - Uses Nodemailer for SMTP
   - Professional HTML email templates

2. **Java Backend Integration**
   - Enhanced EmailService with HTTP client
   - Automatic email sending on payment success
   - RestTemplate configuration for service communication

3. **Email Templates**
   - Order confirmation with full order details
   - Payment receipt with transaction information
   - Responsive design for all devices

## 🛠️ Setup Instructions

### 1. Email Service Configuration

Create `.env` file in `email-service/` directory:

```env
# Email Service Configuration
PORT=3001
NODE_ENV=development

# SMTP Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Settings
FROM_NAME=Grocito
FROM_EMAIL=your-email@gmail.com
SUPPORT_EMAIL=support@grocito.com

# Application Settings
APP_NAME=Grocito
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### 2. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings > Security > App passwords
3. Generate an app password for "Mail"
4. Use this app password in `SMTP_PASS` (not your regular password)

### 3. Install Dependencies

```bash
cd email-service
npm install
```

### 4. Start Services

Use the provided startup script:
```bash
start-all.bat
```

Or start manually:
```bash
# Terminal 1: Start Java Backend
mvn spring-boot:run

# Terminal 2: Start Email Service
cd email-service
npm start

# Terminal 3: Start Frontend
cd grocito-frontend-admin
npm start
```

## 📋 Email Flow

### Order Confirmation Flow
1. Customer places order (COD or Online)
2. Order is saved to database
3. EmailService.sendOrderConfirmationEmail() is called
4. Email service generates HTML template
5. Email is sent via SMTP

### Payment Receipt Flow
1. Customer completes online payment
2. Payment verification succeeds
3. PaymentService.updateOrderPaymentStatus() is called
4. EmailService.sendPaymentReceiptEmail() is called
5. Receipt email is sent with payment details

## 🎨 Email Templates

### Order Confirmation Email
- Order details (ID, date, status)
- Delivery information
- Complete item breakdown
- Total amount
- Next steps information

### Payment Receipt Email
- Payment confirmation
- Transaction details (Payment ID, method, amount)
- Order information
- Important notes for customer

## 🔧 API Endpoints

### Email Service Endpoints

- `GET /api/email/health` - Health check
- `POST /api/email/send-order-confirmation` - Send order confirmation
- `POST /api/email/send-payment-receipt` - Send payment receipt
- `POST /api/email/send-test` - Send test email

### Request Format

```json
{
  "orderData": {
    "order": {
      "id": 123,
      "orderTime": "2024-01-01T10:00:00",
      "status": "PLACED",
      "totalAmount": 299.99,
      "deliveryAddress": "123 Main St",
      "pincode": "12345",
      "items": [
        {
          "name": "Product Name",
          "quantity": 2,
          "price": 149.99,
          "product": {
            "name": "Product Name",
            "price": 149.99
          }
        }
      ]
    },
    "user": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "pincode": "12345"
    }
  },
  "paymentInfo": {
    "paymentMethod": "ONLINE",
    "paymentId": "pay_xyz123",
    "paidAmount": 299.99
  },
  "userEmail": "john@example.com"
}
```

## 🚨 Error Handling

- Email failures don't break order/payment flow
- Graceful fallback to simulation mode
- Comprehensive logging for debugging
- Rate limiting to prevent abuse

## 🧪 Testing

### Test Email Functionality

```bash
# Test email service health
curl http://localhost:3001/api/email/health

# Send test email
curl -X POST http://localhost:3001/api/email/send-test \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "test@example.com", "userName": "Test User"}'
```

### Integration Testing

1. Place a COD order → Check for order confirmation email
2. Complete online payment → Check for both confirmation and receipt emails
3. Verify email templates render correctly
4. Test with invalid email addresses

## 📊 Monitoring

### Logs to Monitor

- Email service startup and configuration
- SMTP connection status
- Email sending success/failure
- Template rendering errors
- API request/response logs

### Key Metrics

- Email delivery success rate
- Response times
- Error rates by email type
- SMTP connection health

## 🔒 Security Considerations

- Rate limiting on email endpoints
- Input validation and sanitization
- Secure SMTP configuration
- Environment variable protection
- CORS configuration

## 🚀 Production Deployment

### Environment Variables

```env
NODE_ENV=production
SMTP_HOST=your-production-smtp-host
SMTP_USER=your-production-email
SMTP_PASS=your-production-password
FROM_EMAIL=noreply@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com
APP_URL=https://yourdomain.com
```

### Scaling Considerations

- Use email queue for high volume
- Consider dedicated email service (SendGrid, AWS SES)
- Implement retry mechanisms
- Monitor email delivery rates

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check SMTP credentials
   - Verify Gmail app password
   - Check firewall/network settings

2. **Template rendering issues**
   - Verify data structure matches expected format
   - Check for missing required fields

3. **Service communication errors**
   - Ensure email service is running on port 3001
   - Check network connectivity between services
   - Verify RestTemplate configuration

### Debug Commands

```bash
# Check email service status
curl http://localhost:3001/api/email/health

# View email service logs
cd email-service
npm start

# Test SMTP connection
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: { user: 'your-email', pass: 'your-app-password' }
});
transporter.verify().then(console.log).catch(console.error);
"
```

## 📝 Customization

### Email Templates

Templates are in `email-service/server.js`:
- `generateOrderConfirmationHTML()`
- `generatePaymentReceiptHTML()`

### Styling

Modify CSS in template functions:
- Colors and branding
- Layout and spacing
- Responsive design
- Company logos

### Content

Customize email content:
- Subject lines
- Message text
- Call-to-action buttons
- Footer information

---

## 🎯 Next Steps

1. Set up your email credentials
2. Test the functionality with sample orders
3. Customize templates to match your branding
4. Monitor email delivery in production
5. Consider implementing email analytics

For support, check the logs or contact the development team.