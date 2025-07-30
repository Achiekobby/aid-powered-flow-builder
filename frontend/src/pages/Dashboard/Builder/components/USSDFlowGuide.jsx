import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lightbulb, 
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Users,
  Phone,
  Hash,
  Target,
  GitBranch,
  Zap,
  Clock,
  Shield,
  TrendingUp,
  BookOpen,
  Play,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const USSDFlowGuide = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('basics');
  const [expandedTip, setExpandedTip] = useState(null);

  const sections = {
    basics: {
      title: 'USSD Basics',
      icon: BookOpen,
      color: 'blue',
      tips: [
        {
          id: 'structure',
          title: 'USSD Flow Structure',
          icon: GitBranch,
          level: 'essential',
          description: 'Every USSD application follows a hierarchical structure',
          details: 'Start with a main menu, create logical categories, and ensure each path has a clear purpose. Keep the flow shallow (max 4-5 levels deep) to avoid user confusion.',
          example: 'Main Menu → Services → Account Services → Balance Inquiry'
        },
        {
          id: 'sessions',
          title: 'Session Management',
          icon: Clock,
          level: 'important',
          description: 'USSD sessions are time-limited and stateless',
          details: 'Plan for 180-second session timeouts. Keep critical information early in the flow. Always provide session extension options for complex transactions.',
          example: 'For money transfers, collect recipient details first, then amount and PIN'
        },
        {
          id: 'input-types',
          title: 'Input Types & Validation',
          icon: Hash,
          level: 'essential',
          description: 'Different inputs require different validation strategies',
          details: 'Use numeric inputs for amounts and PINs, text inputs for names, and phone number validation for recipients. Always validate on both client and server side.',
          example: 'PIN: 4-6 digits only, Amount: positive numbers with decimal validation'
        }
      ]
    },
    ux: {
      title: 'User Experience',
      icon: Users,
      color: 'green',
      tips: [
        {
          id: 'options',
          title: 'Menu Options Guidelines',
          icon: Target,
          level: 'essential',
          description: 'Optimal number and structure of menu options',
          details: 'Use 3-7 options per menu. Order by frequency of use. Always include "0" for previous menu and "00" for main menu. Use clear, concise labels.',
          example: '1. Balance\n2. Transfer\n3. Buy Airtime\n0. Back\n00. Main Menu'
        },
        {
          id: 'language',
          title: 'Clear Language',
          icon: Users,
          level: 'important',
          description: 'Use simple, action-oriented language',
          details: 'Write in active voice, use familiar terms, avoid technical jargon. Test with actual users. Consider local language preferences.',
          example: 'Good: "Enter amount"\nBad: "Please input the monetary value you wish to transfer"'
        },
        {
          id: 'feedback',
          title: 'User Feedback',
          icon: CheckCircle,
          level: 'essential',
          description: 'Always confirm user actions',
          details: 'Show progress indicators, confirm transactions before execution, provide clear success/error messages. Use loading indicators for delays.',
          example: 'Transfer $50 to John Doe (0701234567)?\n1. Confirm\n2. Cancel'
        }
      ]
    },
    patterns: {
      title: 'Common Patterns',
      icon: TrendingUp,
      color: 'purple',
      tips: [
        {
          id: 'authentication',
          title: 'Authentication Flow',
          icon: Shield,
          level: 'essential',
          description: 'Secure user authentication patterns',
          details: 'PIN entry should be the last step before sensitive operations. Implement account lockout after failed attempts. Consider step-up authentication for high-value transactions.',
          example: 'Select Service → Enter Details → Confirm → Enter PIN → Execute'
        },
        {
          id: 'transactions',
          title: 'Transaction Pattern',
          icon: ArrowRight,
          level: 'essential',
          description: 'Standard flow for financial transactions',
          details: 'Collect all required information first, show summary for confirmation, execute only after user confirms, provide transaction receipt with reference number.',
          example: 'Amount → Recipient → Review → PIN → Process → Receipt'
        },
        {
          id: 'error-handling',
          title: 'Error Handling',
          icon: AlertTriangle,
          level: 'important',
          description: 'Graceful error handling strategies',
          details: 'Provide clear error messages, offer recovery options, log errors for debugging. Always give users a way to retry or go back.',
          example: 'Invalid PIN. 2 attempts remaining.\n1. Try again\n2. Reset PIN\n0. Cancel'
        }
      ]
    },
    optimization: {
      title: 'Performance',
      icon: Zap,
      color: 'orange',
      tips: [
        {
          id: 'response-time',
          title: 'Response Time',
          icon: Clock,
          level: 'important',
          description: 'Keep response times under 3 seconds',
          details: 'Cache frequently accessed data, optimize database queries, use async processing for heavy operations. Show loading messages for delays over 2 seconds.',
          example: 'Processing your transaction...\nPlease wait.'
        },
        {
          id: 'menu-depth',
          title: 'Menu Depth',
          icon: GitBranch,
          level: 'essential',
          description: 'Limit menu depth to 4-5 levels maximum',
          details: 'Deep menus confuse users and increase session timeouts. Group related functions, use smart defaults, provide shortcuts for power users.',
          example: 'Main → Category → Service → Action (4 levels max)'
        },
        {
          id: 'data-usage',
          title: 'Data Efficiency',
          icon: TrendingUp,
          level: 'important',
          description: 'Minimize data usage for users',
          details: 'Keep messages concise, avoid unnecessary confirmations, batch operations when possible. Every character counts in USSD.',
          example: 'Use "Bal: $50.00" instead of "Your current account balance is $50.00"'
        }
      ]
    }
  };

  const currentSection = sections[activeSection];

  const getLevelColor = (level) => {
    switch (level) {
      case 'essential': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'important': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'helpful': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getSectionColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-indigo-500',
      green: 'from-green-500 to-emerald-500',
      purple: 'from-purple-500 to-violet-500',
      orange: 'from-orange-500 to-red-500',
    };
    return colors[color] || colors.blue;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  USSD Flow Builder Guide
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Best practices and patterns for building effective USSD applications
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Sidebar Navigation */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Topics
              </h3>
              
              <div className="space-y-2">
                {Object.entries(sections).map(([key, section]) => {
                  const IconComponent = section.icon;
                  const isActive = key === activeSection;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
                        isActive 
                          ? `bg-gradient-to-r ${getSectionColor(section.color)} text-white shadow-lg` 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{section.title}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                  Quick Tips
                </h4>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>Essential tips for core functionality</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span>Important for good user experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Helpful optimizations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-3 bg-gradient-to-r ${getSectionColor(currentSection.color)} rounded-lg`}>
                    <currentSection.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {currentSection.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {currentSection.tips.length} best practices
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {currentSection.tips.map((tip) => {
                    const IconComponent = tip.icon;
                    const isExpanded = expandedTip === tip.id;
                    
                    return (
                      <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                          className="w-full p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${getSectionColor(currentSection.color)}`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                    {tip.title}
                                  </h3>
                                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                                    {tip.description}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(tip.level)}`}>
                                    {tip.level}
                                  </span>
                                  <motion.div
                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-slate-200 dark:border-slate-700"
                            >
                              <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
                                <div className="mb-4">
                                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                                    Details
                                  </h4>
                                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {tip.details}
                                  </p>
                                </div>
                                
                                {tip.example && (
                                  <div>
                                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 flex items-center">
                                      <Play className="w-4 h-4 mr-1" />
                                      Example
                                    </h4>
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                      {tip.example}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <Lightbulb className="w-4 h-4" />
              <span>
                Following these guidelines will help you build user-friendly USSD applications
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default USSDFlowGuide;