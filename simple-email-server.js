const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config({ path: './email-service/.env' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Health check
app.get('/api/email/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Grocito Email Service',
        timestamp: new Date().toISOString()
    });
});

// Test email endpoint
app.post('/api/email/send-test', async (req, res) => {
    try {
        const { userEmail, userName } = req.body;
        
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: userEmail || process.env.SMTP_USER,
            subject: 'Test Email from Grocito',
            html: `
                <h2>🧪 Email Service Test</h2>
                <p>Hello ${userName || 'User'},</p>
                <p>This is a test email to verify that your email service is working correctly.</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Status:</strong> ✅ Email service is working!</p>
            `
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Test email sent:', info.messageId);
        
        res.json({
            success: true,
            message: 'Test email sent successfully',
            messageId: info.messageId
        });
    } catch (error) {
        console.error('❌ Error sending test email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Grocito Email Service running on port ${PORT}`);
    console.log(`📧 Email configured for: ${process.env.SMTP_USER}`);
    console.log(`🌍 Health check: http://localhost:${PORT}/api/email/health`);
});

module.exports = app;