import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import VerifyAccountForm from '../../components/Auth/VerifyAccountForm';

const VerifyAccountPage = () => {
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

  return (
    <VerifyAccountForm onBackToLogin={handleBackToLogin} />
  );
};

export default VerifyAccountPage; 