import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('deliveryPartnerToken');
  const deliveryPartner = localStorage.getItem('deliveryPartner');
  
  if (!token || !deliveryPartner) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;