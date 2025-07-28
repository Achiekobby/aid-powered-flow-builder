import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../store/slices/authSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl"
          : "bg-white/10 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className={`text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}
          >
            USSD Builder
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors duration-300 hover:text-green-500 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/#features"
              className={`font-medium transition-colors duration-300 hover:text-green-500 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className={`font-medium transition-colors duration-300 hover:text-green-500 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/#contact"
              className={`font-medium transition-colors duration-300 hover:text-green-500 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span
                  className={`font-medium transition-colors duration-300 ${
                    isScrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  Welcome, {user?.firstName}!
                </span>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-gray-100"
                  style={{
                    color: isScrolled ? "#374151" : "#ffffff",
                  }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-gray-100"
                  style={{
                    color: isScrolled ? "#374151" : "#ffffff",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:bg-gray-100 ${
                    isScrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  Sign In
                </Link>
                <button
                  onClick={handleGetStarted}
                  className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                    isScrolled
                      ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
                      : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                  }`}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden transition-all duration-300 ${
              isScrolled
                ? "bg-white/95 backdrop-blur-xl border-t border-gray-200"
                : "bg-white/10 backdrop-blur-sm"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/#features"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/#pricing"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/#contact"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Welcome, {user?.firstName}!
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <button
                      onClick={() => {
                        handleGetStarted();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 