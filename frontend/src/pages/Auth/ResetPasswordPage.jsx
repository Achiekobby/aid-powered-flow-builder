import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import ResetPasswordForm from '../../components/Auth/ResetPasswordForm';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Get email and otp from navigation state
  const { email, otp } = location.state || {};

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Redirect if no email or otp provided
    if (!email || !otp) {
      navigate('/auth/forgot-password');
    }
  }, [isAuthenticated, navigate, email, otp]);

  const handleBackToLogin = () => {
    navigate('/auth/login');
  };

  // Don't render if no email or otp
  if (!email || !otp) {
    return null;
  }

  return (
    <ResetPasswordForm 
      email={email}
      otp={otp}
      onBackToLogin={handleBackToLogin}
    />
  );
};

export default ResetPasswordPage; 