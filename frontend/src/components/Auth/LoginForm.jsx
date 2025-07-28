import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Shield, Zap, Globe } from 'lucide-react';
import { loginUser, clearError } from '../../store/slices/authSlice';
import ThreeBackground from './ThreeBackground';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Link } from 'react-router-dom';

const LoginForm = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
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
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4 leading-tight"
            >
              Build Powerful
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                USSD Applications
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-300 mb-8 leading-relaxed"
            >
              Create, deploy, and manage USSD applications for Ghana and across Africa. 
              No coding required - just drag, drop, and launch.
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
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Lightning Fast
                  </h3>
                  <p className="text-sm text-gray-300">
                    Build and deploy USSD applications in minutes, not days
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
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Enterprise Security
                  </h3>
                  <p className="text-sm text-gray-300">
                    Bank-grade security with end-to-end encryption
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-green-400 border border-white/20">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    Ghana & Africa Ready
                  </h3>
                  <p className="text-sm text-gray-300">
                    Optimized for African mobile networks and languages
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-6 py-8 bg-white">
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
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-600">
              Sign in to your USSD Builder account
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
              Welcome Back
            </h1>
            <p className="text-sm text-gray-600">
              Sign in to your USSD Builder account
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
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
                    placeholder="Enter your password"
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
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-500 bg-gray-50 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={onSwitchToForgotPassword}
                  className="text-sm text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  Forgot password?
                </button>
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
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-bold text-base transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="my-4"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to USSD Builder?</span>
                </div>
              </div>
            </motion.div>

            {/* Switch to Register */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              onClick={onSwitchToRegister}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-all duration-300 border border-gray-200 hover:border-gray-300 text-sm"
            >
              Create an account
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-4"
          >
            <p className="text-gray-500 text-xs">
              By signing in, you agree to our{' '}
              <Link to="#" className="text-green-600 hover:text-green-700 transition-colors duration-200">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-green-600 hover:text-green-700 transition-colors duration-200">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm; 