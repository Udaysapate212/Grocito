import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      console.log('ProtectedRoute - Auth check:', { isAuthenticated, currentUser });
      
      if (!isAuthenticated || !currentUser) {
        console.log('User not authenticated, redirecting to login');
        toast.warning('Please login to continue', {
          position: "bottom-right",
          autoClose: 3000,
        });
        navigate('/login', { replace: true });
        return;
      }
      
      setIsChecking(false);
    };

    // Small delay to ensure localStorage is ready
    setTimeout(checkAuth, 100);
  }, [navigate]);

  if (isChecking) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  return children;
};

export default ProtectedRoute;