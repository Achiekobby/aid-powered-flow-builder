import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import ForgotPasswordForm from '../../components/Auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleBackToLogin = () => {
    navigate('/auth/login');
  };

  const handleSwitchToResetPassword = (email, otp) => {
    navigate('/auth/reset-password', { 
      state: { email, otp } 
    });
  };

  return (
    <ForgotPasswordForm 
      onBackToLogin={handleBackToLogin}
      onSwitchToResetPassword={handleSwitchToResetPassword}
    />
  );
};

export default ForgotPasswordPage; 