# Razorpay Payment Integration Implementation

## Overview
We've implemented a complete Razorpay payment integration for the Grocito application. This integration allows users to make online payments for their grocery orders using Razorpay's payment gateway.

## Backend Implementation

### 1. Payment Entity
- Created a `Payment` entity to store payment information in the database
- Includes fields for order ID, user ID, amount, currency, status, payment ID, and Razorpay order ID

### 2. Payment Repository
- Created a `PaymentRepository` interface to interact with the payment data in the database
- Includes methods to find payments by user ID, order ID, payment ID, and Razorpay order ID

### 3. Payment Service
- Implemented a `PaymentService` class to handle payment-related business logic
- Methods for creating Razorpay orders, verifying payments, updating order payment status, and retrieving payment details
- Includes HMAC-SHA256 signature verification for secure payment validation

### 4. Payment Controller
- Updated the existing `PaymentController` to expose REST endpoints for payment operations
- Endpoints for creating orders, verifying payments, getting payment details, and retrieving payment history

### 5. Configuration
- Added Razorpay API keys to `application.properties`
- Added Razorpay Java SDK dependency to `pom.xml`

## Frontend Implementation

### 1. Payment Service
- Created a `paymentService.js` to interact with the backend payment API
- Methods for creating orders, verifying payments, getting payment details, and retrieving payment history
- Includes fallback to mock data when backend is unavailable (for development)

### 2. Checkout Page
- Updated `EnhancedCheckoutPage.js` to integrate Razorpay payment flow
- Added Razorpay script loading and payment modal handling
- Implemented different flows for Cash on Delivery (COD) and online payments

### 3. Payment History Page
- Created a new `PaymentHistoryPage.js` component to display payment history
- Shows payment details including order ID, amount, status, payment ID, and date
- Includes status badges with appropriate colors for different payment statuses

### 4. Navigation
- Added a link to the payment history page in the Header component
- Added a link to the payment history page in the Orders page
- Updated App.js to include the new payment history route

## Payment Flow

1. User adds items to cart and proceeds to checkout
2. User selects payment method (COD or Online Payment)
3. User clicks "Place Order" button
4. If COD is selected:
   - Order is created with status "PLACED"
   - User is redirected to the orders page
5. If Online Payment is selected:
   - Order is created with status "PENDING_PAYMENT"
   - A Razorpay order is created
   - Razorpay payment modal is opened
   - User completes payment in the modal
   - Payment is verified with the backend
   - Order status is updated to "PLACED"
   - User is redirected to the orders page

## Security Features
- HMAC-SHA256 signature verification to prevent payment tampering
- Server-side validation of payment details
- Proper error handling and user feedback

## Database Updates
- New `payments` table to store payment information
- Updated `orders` table to include payment method and status

## Testing
The implementation can be tested using Razorpay's test mode with the provided test keys:
- Key ID: rzp_test_cSaPgCCDgkPbkb
- Key Secret: r0E6qxy4ZCoyr9qEa8uxgoGr

For testing, you can use Razorpay's test card numbers and UPI IDs as documented in their testing guide.