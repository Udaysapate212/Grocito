# Environment Setup Guide

This document explains how to set up the environment files for the Grocito application.

## 🔒 Security Notice

**IMPORTANT:** Environment files (`.env`, `application.properties`) contain sensitive information like:
- Database credentials
- Email passwords
- API keys
- Secret tokens

These files should **NEVER** be committed to version control. They are already added to `.gitignore`.

## 📋 Setup Instructions

### 1. Java Backend Configuration

1. Copy the example properties file:
   ```bash
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   ```

2. Edit `application.properties` with your actual credentials:
   - Database username and password
   - Email credentials (Gmail app password)
   - Razorpay API keys

### 2. Email Service Configuration

1. Copy the example environment file:
   ```bash
   cp email-service/.env.example email-service/.env
   ```

2. Edit `email-service/.env` with your actual credentials:
   - SMTP username (your Gmail address)
   - SMTP password (your Gmail app password)
   - From email and support email addresses

### 3. Gmail App Password Setup

For email functionality, you need to create an App Password in your Google account:

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select **Security**
3. Under "Signing in to Google," select **2-Step Verification** (must be enabled)
4. At the bottom of the page, select **App passwords**
5. Select "Mail" as the app and "Other" as the device
6. Copy the generated 16-character password
7. Use this password in your configuration files (not your regular Gmail password)

## 🚫 What NOT to Do

- ❌ **NEVER commit `.env` files to Git**
- ❌ **NEVER share your environment files**
- ❌ **NEVER use real credentials in example files**
- ❌ **NEVER store credentials in code or non-ignored files**

## ✅ Best Practices

- ✅ Always use `.env.example` files as templates
- ✅ Keep different credentials for development and production
- ✅ Regularly rotate passwords and API keys
- ✅ Use environment-specific configurations
- ✅ Verify `.gitignore` is working properly

## 🔄 Environment Files Location

- **Java Backend**: `src/main/resources/application.properties`
- **Email Service**: `email-service/.env`
- **Frontend**: `grocito-frontend/.env` (if needed)
- **Admin Frontend**: `grocito-frontend-admin/.env` (if needed)

## 🧪 Testing Configuration

After setting up your environment files, test that everything works:

1. Start the backend: `mvn spring-boot:run`
2. Start the email service: `cd email-service && npm start`
3. Start the frontend: `cd grocito-frontend/frontend && npm start`
4. Place a test order and verify email functionality