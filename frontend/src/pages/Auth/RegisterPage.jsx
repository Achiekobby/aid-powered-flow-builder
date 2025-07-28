import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import AnimatedSignupForm from '../../components/Auth/AnimatedSignupForm';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSwitchToLogin = () => {
    navigate('/auth/login');
  };

  return (
    <AnimatedSignupForm onSwitchToLogin={handleSwitchToLogin} />
  );
};

export default RegisterPage; 