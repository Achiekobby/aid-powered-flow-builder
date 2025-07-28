import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { ArrowLeft, Sparkles, Lock, Eye, EyeOff, CheckCircle, Shield } from 'lucide-react';
import { resetPassword, clearError } from '../../store/slices/authSlice';
import ThreeBackground from './ThreeBackground';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Link } from 'react-router-dom';

const ResetPasswordForm = ({ email, otp, onBackToLogin }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one lowercase letter');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one uppercase letter');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one number');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one special character');
    }

    setPasswordStrength({ score, feedback });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    dispatch(resetPassword({
      email,
      otp,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    }));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'text-red-500';
    if (passwordStrength.score <= 3) return 'text-yellow-500';
    if (passwordStrength.score <= 4) return 'text-blue-500';
    return 'text-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Left Side - Content */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* 3D Background */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ThreeBackground />
          </Canvas>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-lg"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl mb-6 shadow-2xl"
            >
              <Shield className="w-6 h-6 text-white" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4 leading-tight"
            >
              Set New
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Password
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-300 mb-8 leading-relaxed"
            >
              Create a strong, secure password for your account. 
              Make sure it's unique and not used elsewhere.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-green-400 border border-white/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Secure & Strong
                  </h3>
                  <p className="text-sm text-gray-300">
                    Create a password that's hard to guess
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-green-400 border border-white/20">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Instant Access
                  </h3>
                  <p className="text-sm text-gray-300">
                    Get back to your account immediately
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-6 py-8 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-lg py-8"
        >
          {/* Mobile Logo (only visible on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:hidden text-center mb-6"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl mb-4 shadow-2xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Set New Password
            </h1>
            <p className="text-sm text-gray-600">
              Create a strong password for your account
            </p>
          </motion.div>

          {/* Desktop Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:block mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Set New Password
            </h1>
            <p className="text-sm text-gray-600">
              Create a strong password for your account
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 w-8 rounded-full ${
                              level <= passwordStrength.score
                                ? getPasswordStrengthColor().replace('text-', 'bg-')
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-medium ${getPasswordStrengthColor()}`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {passwordStrength.feedback.join(', ')}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-200'
                    }`}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    {formData.password === formData.confirmPassword ? (
                      <div className="flex items-center text-xs text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Passwords match
                      </div>
                    ) : (
                      <div className="text-xs text-red-600">
                        Passwords do not match
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || formData.password !== formData.confirmPassword || formData.password.length < 8}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-bold text-base transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Back to Login */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <button
                type="button"
                onClick={onBackToLogin}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </button>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-6"
          >
            <p className="text-gray-500 text-xs">
              Need help? Contact our{' '}
              <Link to="#" className="text-green-600 hover:text-green-700 transition-colors duration-200">
                Support Team
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordForm; 