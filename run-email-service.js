// Simple script to run email service
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Grocito Email Service...');

const emailServicePath = path.join(__dirname, 'email-service');
console.log('Email service path:', emailServicePath);

const child = spawn('node', ['server.js'], {
    cwd: emailServicePath,
    stdio: 'inherit'
});

child.on('error', (error) => {
    console.error('Failed to start email service:', error);
});

child.on('close', (code) => {
    console.log(`Email service exited with code ${code}`);
});