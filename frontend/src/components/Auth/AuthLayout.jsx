import React from "react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 border border-green-200 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-green-700 text-sm font-medium">
                USSD Builder 🇬🇭
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </div>

          {/* Auth Content */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            {children}
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2024 USSD Builder. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 