import React, { useState } from 'react';
import { Phone, Signal, Wifi, Battery, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PhonePreview = ({ currentMenu, projectName = "My USSD App" }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Sample menu data - this will come from props later
  const sampleMenu = {
    title: "Welcome to Customer Service",
    options: [
      { key: "1", text: "Customer Support", icon: "🎧" },
      { key: "2", text: "Billing Inquiries", icon: "💰" },
      { key: "3", text: "Account Management", icon: "👤" },
      { key: "0", text: "Exit", icon: "❌" }
    ]
  };

  const displayMenu = currentMenu || sampleMenu;

  const handleInput = (key) => {
    setInputValue(key);
    setIsTyping(true);
    
    // Simulate response delay
    setTimeout(() => {
      setIsTyping(false);
      setInputValue('');
    }, 1000);
  };

  return (
    <div className="flex flex-col h-3/5">
      <div className="flex items-center mb-6">
        <Phone className="mr-2 w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
      </div>
      
      <div className="flex flex-col flex-1 justify-center items-center">
        {/* Realistic Phone Mockup */}
        <div className="relative">
          {/* Phone Frame */}
          <div className="relative bg-gray-900 rounded-[2rem] p-2 shadow-2xl border-4 border-gray-800 w-64">
            {/* Phone Screen */}
            <div className="bg-black rounded-[1.5rem] overflow-hidden relative">
              
              {/* Status Bar */}
              <div className="flex justify-between items-center px-3 py-1.5 text-xs text-white bg-black">
                <div className="flex items-center space-x-1">
                  <Signal className="w-3 h-3" />
                  <span className="font-medium">MTN</span>
                </div>
                <div className="font-medium text-center">
                  12:34 PM
                </div>
                <div className="flex items-center space-x-1">
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-4 h-2" />
                </div>
              </div>

              {/* USSD Interface */}
              <div className="bg-gray-100 h-[320px] flex flex-col">
                
                {/* USSD Header */}
                <div className="flex justify-between items-center px-3 py-2 text-white bg-blue-600">
                  <div className="flex items-center">
                    <Volume2 className="mr-2 w-3 h-3" />
                    <span className="text-xs font-medium">USSD</span>
                  </div>
                  <span className="text-xs opacity-75">*123#</span>
                </div>

                {/* USSD Content */}
                <div className="overflow-y-auto flex-1 p-4 bg-white">
                  <AnimatePresence mode="wait">
                    {isTyping ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center items-center h-24"
                      >
                        <div className="flex items-center space-x-2 text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <span className="ml-2 text-xs">Processing...</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        {/* Menu Title */}
                        <div className="pb-2 text-center border-b border-gray-200">
                          <h3 className="text-sm font-semibold leading-tight text-gray-900">
                            {displayMenu.title || "Welcome!"}
                          </h3>
                        </div>

                        {/* Menu Options */}
                        <div className="space-y-2">
                          {displayMenu.options && displayMenu.options.length > 0 ? (
                            displayMenu.options.map((option, index) => (
                              <motion.div
                                key={option.key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center py-1 text-xs text-gray-800"
                              >
                                <span className="font-bold text-blue-600 mr-2 min-w-[16px] text-sm">
                                  {option.key}.
                                </span>
                                {option.icon && (
                                  <span className="mr-2 text-sm">{option.icon}</span>
                                )}
                                <span className="flex-1 leading-relaxed">{option.text}</span>
                              </motion.div>
                            ))
                          ) : (
                            <div className="py-4 text-center text-gray-500">
                              <div className="mb-2 text-2xl">📱</div>
                              <h4 className="mb-1 text-sm font-medium text-gray-700">Ready to Build</h4>
                              <p className="text-xs leading-relaxed">
                                Your USSD menu will appear here when you start building.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-600">Reply:</span>
                    <span className="text-xs text-gray-500">Send • Cancel</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter option..."
                      className="flex-1 px-2 py-1.5 min-w-0 text-xs bg-white rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                      maxLength="1"
                    />
                    <button
                      onClick={() => handleInput(inputValue)}
                      disabled={!inputValue || isTyping}
                      className="px-3 py-1.5 text-xs font-medium text-white whitespace-nowrap bg-blue-600 rounded shadow-lg transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Home Indicator (iPhone style) */}
            <div className="absolute bottom-1 left-1/2 w-20 h-1 bg-gray-600 rounded-full transform -translate-x-1/2"></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            Type a number to test navigation
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;