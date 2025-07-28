import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import LoginForm from '../../components/Auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSwitchToRegister = () => {
    navigate('/auth/register');
  };

  const handleSwitchToForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  return (
    <LoginForm
      onSwitchToRegister={handleSwitchToRegister}
      onSwitchToForgotPassword={handleSwitchToForgotPassword}
    />
  );
};

export default LoginPage; 