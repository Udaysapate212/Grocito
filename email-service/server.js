const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:8080' // Java backend
    ],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many email requests from this IP, please try again later.'
});
app.use('/api/email', limiter);

// Create nodemailer transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Verify email configuration on startup
const verifyEmailConfig = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ Email server is ready to send emails');
        return true;
    } catch (error) {
        console.error('❌ Email server configuration error:', error.message);
        console.log('📧 Email service will run in simulation mode');
        return false;
    }
};

let emailConfigValid = false;

// Initialize email configuration
verifyEmailConfig().then(isValid => {
    emailConfigValid = isValid;
});

// Email templates
const generateOrderConfirmationHTML = (orderData, paymentInfo) => {
    const { order, user } = orderData;
    const paymentMethod = paymentInfo?.paymentMethod || 'COD';
    const paymentId = paymentInfo?.paymentId || null;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ${process.env.APP_NAME}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f9f9f9; padding: 30px 20px; }
        .order-card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #16a34a; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .order-card h2 { color: #16a34a; margin-top: 0; }
        .item-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
        .item-row:last-child { border-bottom: none; }
        .total-row { font-weight: bold; font-size: 1.1em; color: #16a34a; background: #f0fdf4; padding: 15px; border-radius: 6px; margin-top: 10px; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        .footer a { color: #22c55e; text-decoration: none; }
        .status-badge { background: #16a34a; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛍️ Order Confirmed!</h1>
          <p>Thank you for your order, ${user.fullName || user.name || 'Valued Customer'}!</p>
        </div>
        
        <div class="content">
          <div class="order-card">
            <h2>📦 Order Details</h2>
            <div class="item-row">
              <strong>Order ID:</strong>
              <span>#${order.id}</span>
            </div>
            <div class="item-row">
              <strong>Order Date:</strong>
              <span>${new Date(order.orderTime || Date.now()).toLocaleString()}</span>
            </div>
            <div class="item-row">
              <strong>Status:</strong>
              <span class="status-badge">${order.status || 'PLACED'}</span>
            </div>
            <div class="item-row">
              <strong>Payment Method:</strong>
              <span>${paymentMethod}</span>
            </div>
            ${paymentId ? `
            <div class="item-row">
              <strong>Payment ID:</strong>
              <span>${paymentId}</span>
            </div>
            ` : ''}
          </div>

          <div class="order-card">
            <h2>📍 Delivery Information</h2>
            <div class="item-row">
              <strong>Delivery Address:</strong>
              <span>${order.deliveryAddress || 'Address on file'}</span>
            </div>
            <div class="item-row">
              <strong>Pincode:</strong>
              <span>${order.pincode || user.pincode || 'N/A'}</span>
            </div>
            <div class="item-row">
              <strong>Estimated Delivery:</strong>
              <span>30-45 minutes</span>
            </div>
          </div>

          <div class="order-card">
            <h2>🛒 Order Summary</h2>
            ${order.items ? order.items.map(item => `
              <div class="item-row">
                <div>
                  <strong>${item.product?.name || item.name || 'Product'}</strong><br>
                  <small>Qty: ${item.quantity} × ₹${(item.price || item.product?.price || 0).toFixed(2)}</small>
                </div>
                <div>₹${((item.price || item.product?.price || 0) * item.quantity).toFixed(2)}</div>
              </div>
            `).join('') : `
              <div class="item-row">
                <div>Order items will be confirmed shortly</div>
                <div>-</div>
              </div>
            `}
            
            <div class="total-row">
              <div class="item-row" style="border: none; margin: 0;">
                <div>Total Amount:</div>
                <div>₹${(order.totalAmount || 0).toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div class="highlight">
            <h3>📋 What's Next?</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Your order is being processed by our team</li>
              <li>You'll receive SMS and email updates</li>
              <li>Expected delivery: 30-45 minutes</li>
              <li>Track your order status online anytime</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p><strong>Thank you for choosing ${process.env.APP_NAME}!</strong></p>
          <p>Need help? Contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a></p>
          <p>Visit us: <a href="${process.env.APP_URL}">${process.env.APP_URL}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generatePaymentReceiptHTML = (orderData, paymentInfo) => {
    const { order, user } = orderData;
    const { paymentId, paymentMethod, paidAmount } = paymentInfo;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Receipt - ${process.env.APP_NAME}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f9f9f9; padding: 30px 20px; }
        .receipt-card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .receipt-card h2 { color: #3b82f6; margin-top: 0; }
        .amount-highlight { background: #dbeafe; padding: 25px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid #3b82f6; }
        .amount-highlight h2 { color: #1d4ed8; margin: 0; font-size: 36px; }
        .item-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
        .item-row:last-child { border-bottom: none; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        .footer a { color: #60a5fa; text-decoration: none; }
        .success-badge { background: #16a34a; color: white; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💳 Payment Receipt</h1>
          <p>Payment Successful!</p>
        </div>
        
        <div class="content">
          <div class="amount-highlight">
            <h2>₹${(paidAmount || order.totalAmount || 0).toFixed(2)}</h2>
            <p style="margin: 5px 0 0 0; color: #1d4ed8; font-weight: bold;">Payment Successful</p>
          </div>

          <div class="receipt-card">
            <h2>💳 Payment Information</h2>
            <div class="item-row">
              <strong>Payment ID:</strong>
              <span>${paymentId || 'N/A'}</span>
            </div>
            <div class="item-row">
              <strong>Payment Method:</strong>
              <span>${paymentMethod || 'ONLINE'}</span>
            </div>
            <div class="item-row">
              <strong>Payment Date:</strong>
              <span>${new Date().toLocaleString()}</span>
            </div>
            <div class="item-row">
              <strong>Amount Paid:</strong>
              <span>₹${(paidAmount || order.totalAmount || 0).toFixed(2)}</span>
            </div>
            <div class="item-row">
              <strong>Status:</strong>
              <span class="success-badge">SUCCESS</span>
            </div>
          </div>

          <div class="receipt-card">
            <h2>📦 Order Information</h2>
            <div class="item-row">
              <strong>Order ID:</strong>
              <span>#${order.id}</span>
            </div>
            <div class="item-row">
              <strong>Customer:</strong>
              <span>${user.fullName || user.name || 'Customer'}</span>
            </div>
            <div class="item-row">
              <strong>Email:</strong>
              <span>${user.email}</span>
            </div>
            <div class="item-row">
              <strong>Order Total:</strong>
              <span>₹${(order.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>

          <div class="receipt-card">
            <h2>📋 Important Notes</h2>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This is your official payment receipt</li>
              <li>Keep this receipt for your records</li>
              <li>Your order is now confirmed and being processed</li>
              <li>You will receive order updates separately</li>
              <li>For any queries, contact our support team</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p><strong>Thank you for your payment!</strong></p>
          <p>Questions? Contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a></p>
          <p>Visit us: <a href="${process.env.APP_URL}">${process.env.APP_URL}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// API Routes

// Health check
app.get('/api/email/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Grocito Email Service',
        emailConfigValid,
        timestamp: new Date().toISOString()
    });
});

// Send order confirmation email
app.post('/api/email/send-order-confirmation', async (req, res) => {
    try {
        const { orderData, paymentInfo, userEmail } = req.body;

        console.log('📧 Sending order confirmation email to:', userEmail || orderData.user?.email);

        const emailHTML = generateOrderConfirmationHTML(orderData, paymentInfo);
        const subject = `Order Confirmation - ${process.env.APP_NAME} (Order #${orderData.order?.id || orderData.id})`;

        if (emailConfigValid) {
            const transporter = createTransporter();

            const mailOptions = {
                from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
                to: userEmail || orderData.user?.email,
                subject: subject,
                html: emailHTML
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Order confirmation email sent:', info.messageId);

            res.json({
                success: true,
                message: 'Order confirmation email sent successfully',
                messageId: info.messageId
            });
        } else {
            // Simulation mode
            console.log('📧 EMAIL SIMULATION - Order Confirmation');
            console.log('To:', userEmail || orderData.user?.email);
            console.log('Subject:', subject);
            console.log('Status: SIMULATED (Email config not available)');

            res.json({
                success: true,
                message: 'Order confirmation email simulated successfully',
                simulated: true
            });
        }
    } catch (error) {
        console.error('❌ Error sending order confirmation email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send payment receipt email
app.post('/api/email/send-payment-receipt', async (req, res) => {
    try {
        const { orderData, paymentInfo, userEmail } = req.body;

        console.log('📧 Sending payment receipt email to:', userEmail || orderData.user?.email);

        const emailHTML = generatePaymentReceiptHTML(orderData, paymentInfo);
        const subject = `Payment Receipt - ${process.env.APP_NAME} (Order #${orderData.order?.id || orderData.id})`;

        if (emailConfigValid) {
            const transporter = createTransporter();

            const mailOptions = {
                from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
                to: userEmail || orderData.user?.email,
                subject: subject,
                html: emailHTML
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Payment receipt email sent:', info.messageId);

            res.json({
                success: true,
                message: 'Payment receipt email sent successfully',
                messageId: info.messageId
            });
        } else {
            // Simulation mode
            console.log('📧 EMAIL SIMULATION - Payment Receipt');
            console.log('To:', userEmail || orderData.user?.email);
            console.log('Subject:', subject);
            console.log('Status: SIMULATED (Email config not available)');

            res.json({
                success: true,
                message: 'Payment receipt email simulated successfully',
                simulated: true
            });
        }
    } catch (error) {
        console.error('❌ Error sending payment receipt email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send test email
app.post('/api/email/send-test', async (req, res) => {
    try {
        const { userEmail, userName } = req.body;

        console.log('📧 Sending test email to:', userEmail);

        const testHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 20px; text-align: center; border-radius: 8px;">
          <h1>🧪 Test Email</h1>
          <p>This is a test email from ${process.env.APP_NAME}</p>
        </div>
        <div style="background: #f9f9f9; padding: 20px; margin-top: 0;">
          <p>Hello ${userName || 'User'},</p>
          <p>This is a test email to verify that the email service is working correctly.</p>
          <p><strong>Email service status:</strong> ${emailConfigValid ? '✅ Active' : '⚠️ Simulation Mode'}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <div style="background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
          <p>Best regards,<br>${process.env.APP_NAME} Team</p>
        </div>
      </div>
    `;

        const subject = `Test Email - ${process.env.APP_NAME}`;

        if (emailConfigValid) {
            const transporter = createTransporter();

            const mailOptions = {
                from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
                to: userEmail,
                subject: subject,
                html: testHTML
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Test email sent:', info.messageId);

            res.json({
                success: true,
                message: 'Test email sent successfully',
                messageId: info.messageId
            });
        } else {
            // Simulation mode
            console.log('📧 EMAIL SIMULATION - Test Email');
            console.log('To:', userEmail);
            console.log('Subject:', subject);
            console.log('Status: SIMULATED (Email config not available)');

            res.json({
                success: true,
                message: 'Test email simulated successfully',
                simulated: true
            });
        }
    } catch (error) {
        console.error('❌ Error sending test email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Grocito Email Service running on port ${PORT}`);
    console.log(`📧 Email config status: ${emailConfigValid ? '✅ Active' : '⚠️ Simulation Mode'}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;