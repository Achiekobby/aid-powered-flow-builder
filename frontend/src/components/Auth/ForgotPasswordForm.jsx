import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { ArrowLeft, Sparkles, Mail, Lock, Send, CheckCircle, Clock } from 'lucide-react';
import { forgotPassword, verifyResetCode, clearError } from '../../store/slices/authSlice';
import ThreeBackground from './ThreeBackground';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Link } from 'react-router-dom';

const ForgotPasswordForm = ({ onBackToLogin, onSwitchToResetPassword }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      dispatch(clearError());
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    if (error) {
      dispatch(clearError());
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await dispatch(forgotPassword({ email })).unwrap();
        setStep('otp');
        setCountdown(60);
      } catch (error) {
        // Error handled by Redux
      }
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 4) {
      try {
        await dispatch(verifyResetCode({ email, otp: otpString })).unwrap();
        onSwitchToResetPassword(email, otpString);
      } catch (error) {
        // Error handled by Redux
      }
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setCountdown(60);
    } catch (error) {
      // Error handled by Redux
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp(['', '', '', '']);
    dispatch(clearError());
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
              <Lock className="w-6 h-6 text-white" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4 leading-tight"
            >
              Reset Your
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
              {step === 'email' 
                ? "Enter your email address and we'll send you a verification code to reset your password."
                : "We've sent a 4-digit verification code to your email. Enter it below to continue."
              }
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
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Secure Reset
                  </h3>
                  <p className="text-sm text-gray-300">
                    Your password reset is protected with email verification
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
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Quick Process
                  </h3>
                  <p className="text-sm text-gray-300">
                    Get back to your account in just a few minutes
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
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {step === 'email' ? 'Forgot Password' : 'Verify Code'}
            </h1>
            <p className="text-sm text-gray-600">
              {step === 'email' 
                ? 'Enter your email to reset password'
                : 'Enter the 4-digit code sent to your email'
              }
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
              {step === 'email' ? 'Forgot Password' : 'Verify Code'}
            </h1>
            <p className="text-sm text-gray-600">
              {step === 'email' 
                ? 'Enter your email to reset password'
                : 'Enter the 4-digit code sent to your email'
              }
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {step === 'email' ? (
              <form onSubmit={handleSendCode} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
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
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-bold text-base transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Send Reset Code</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                {/* OTP Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Verification Code
                  </label>
                  <div className="flex space-x-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-14 h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        placeholder="0"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Enter the 4-digit code from your email
                  </p>
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
                  disabled={isLoading || otp.join('').length !== 4}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-bold text-base transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                {/* Resend Code */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center"
                >
                  <p className="text-sm text-gray-600 mb-2">
                    Didn't receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isResending || countdown > 0}
                    className="text-sm text-green-600 hover:text-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </motion.div>

                {/* Back to Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-center"
                >
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700 transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Email
                  </button>
                </motion.div>
              </form>
            )}

            {/* Back to Login */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
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
            transition={{ duration: 0.6, delay: 0.7 }}
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

export default ForgotPasswordForm; 