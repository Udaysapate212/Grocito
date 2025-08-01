import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ProductsPage from './components/ProductsPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrdersPage from './components/OrdersPage';
import ServiceNotAvailable from './components/ServiceNotAvailable';
import ProtectedRoute from './components/ProtectedRoute';
// Debug components - Hidden for production
// import TestLogin from './components/TestLogin';
import Dashboard from './components/Dashboard';
// import DebugInfo from './components/DebugInfo';
import TestRedirect from './components/TestRedirect';
// import PaymentTest from './components/PaymentTest';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailed from './components/PaymentFailed';
import PaymentSuccessPage from './components/PaymentSuccessPage';
import PaymentFailedPage from './components/PaymentFailedPage';
import EmergencyCartManager from './components/EmergencyCartManager';
import SimpleWorkingCart from './components/SimpleWorkingCart';
import LocationTest from './components/LocationTest';
// import FlowTest from './components/FlowTest';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import test and debug scripts
import './testEnv';
import './debug-geocoding';

function App() {
  // Check environment variables when the app loads
  useEffect(() => {
    console.log('App mounted - Environment variables check:');
    console.log('REACT_APP_WEATHER_API_KEY:', process.env.REACT_APP_WEATHER_API_KEY ? 'Present' : 'Missing');
    console.log('NODE_ENV:', process.env.NODE_ENV);

    // Log all environment variables that start with REACT_APP_
    const reactEnvVars = Object.keys(process.env)
      .filter(key => key.startsWith('REACT_APP_'));

    console.log('All REACT_APP_ environment variables:', reactEnvVars);

    // Alert if the API key is missing
    if (!process.env.REACT_APP_WEATHER_API_KEY) {
      console.error('WARNING: OpenWeatherMap API key is missing!');
      console.error('Please check your .env file and make sure it contains REACT_APP_WEATHER_API_KEY');
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            fontSize: '14px',
            borderRadius: '8px',
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/products" element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test-redirect" element={<TestRedirect />} />
          <Route path="/payment-success" element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          } />
          <Route path="/payment-failed" element={
            <ProtectedRoute>
              <PaymentFailedPage />
            </ProtectedRoute>
          } />
          <Route path="/payment-success-legacy" element={<PaymentSuccess />} />
          <Route path="/payment-failed-legacy" element={<PaymentFailed />} />
          <Route path="/emergency-cart" element={<EmergencyCartManager />} />
          <Route path="/simple-cart" element={<SimpleWorkingCart />} />
          <Route path="/not-available" element={<ServiceNotAvailable />} />
          <Route path="/location-test" element={<LocationTest />} />
        </Routes>

        {/* Debug components - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <>
            {/* <TestLogin /> */}
            {/* <DebugInfo /> */}
            {/* <PaymentTest /> */}
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
