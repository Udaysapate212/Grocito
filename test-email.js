// Simple test to check email service
const nodemailer = require('nodemailer');
require('dotenv').config({ path: './email-service/.env' });

console.log('Testing email configuration...');
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Test connection
transporter.verify()
    .then(() => {
        console.log('✅ Email server connection successful!');
        
        // Send test email
        const mailOptions = {
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: process.env.SMTP_USER,
            subject: 'Test Email from Grocito',
            html: `
                <h2>🧪 Email Service Test</h2>
                <p>This is a test email to verify that your email service is working correctly.</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Status:</strong> ✅ Email service is working!</p>
            `
        };
        
        return transporter.sendMail(mailOptions);
    })
    .then((info) => {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Check your email:', process.env.SMTP_USER);
    })
    .catch((error) => {
        console.error('❌ Email service error:', error.message);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Check if 2-Factor Authentication is enabled on Gmail');
        console.log('2. Verify the App Password is correct');
        console.log('3. Make sure "Less secure app access" is not needed (use App Password instead)');
    });