import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  AlertCircle, 
  Hash,
  Zap,
  Target,
  Users,
  Lightbulb,
  Settings
} from 'lucide-react';
import useUSSDBuilderStore from '../../../../store/ussdBuilderStore';

const OptionConnectionModal = ({ 
  isOpen, 
  onClose, 
  sourceMenu, 
  targetMenus, 
  onCreateConnection 
}) => {
  const [selectedConnections, setSelectedConnections] = useState({});
  const [showGuides, setShowGuides] = useState(false);
  
  const { actions: { addNotification } } = useUSSDBuilderStore();

  // UX Guide suggestions based on menu type and flow patterns
  const getUXSuggestions = (menu) => {
    const suggestions = [];
    
    if (menu.type === 'main') {
      suggestions.push({
        icon: Users,
        title: "Main Menu Best Practices",
        description: "Keep main menu options clear and limited (3-7 options max)",
        type: "best-practice"
      });
    }
    
    if (menu.options?.length > 6) {
      suggestions.push({
        icon: AlertCircle,
        title: "Too Many Options",
        description: "Consider grouping options or using sub-menus for better UX",
        type: "warning"
      });
    }
    
    if (menu.type === 'input') {
      suggestions.push({
        icon: Hash,
        title: "Input Validation",
        description: "Add validation rules to ensure data quality and proper routing",
        type: "enhancement"
      });
    }
    
    return suggestions;
  };

  // Smart routing suggestions
  const getSmartSuggestions = (option, availableMenus) => {
    const suggestions = [];
    const optionText = option.text.toLowerCase();
    
    // Pattern matching for common USSD flows
    if (optionText.includes('balance') || optionText.includes('account')) {
      const balanceMenus = availableMenus.filter(m => 
        m.title.toLowerCase().includes('balance') || 
        m.title.toLowerCase().includes('account')
      );
      if (balanceMenus.length > 0) {
        suggestions.push({
          menu: balanceMenus[0],
          confidence: 85,
          reason: "Matches account/balance flow pattern"
        });
      }
    }
    
    if (optionText.includes('transfer') || optionText.includes('send')) {
      const transferMenus = availableMenus.filter(m => 
        m.title.toLowerCase().includes('transfer') || 
        m.title.toLowerCase().includes('send')
      );
      if (transferMenus.length > 0) {
        suggestions.push({
          menu: transferMenus[0],
          confidence: 90,
          reason: "Matches transfer flow pattern"
        });
      }
    }
    
    if (optionText.includes('exit') || optionText.includes('quit')) {
      const endMenus = availableMenus.filter(m => m.type === 'end');
      if (endMenus.length > 0) {
        suggestions.push({
          menu: endMenus[0],
          confidence: 95,
          reason: "Exit option should lead to end menu"
        });
      }
    }
    
    return suggestions;
  };

  const handleOptionConnection = (optionKey, targetMenuId) => {
    setSelectedConnections(prev => ({
      ...prev,
      [optionKey]: targetMenuId
    }));
  };

  const handleCreateConnections = () => {
    Object.entries(selectedConnections).forEach(([optionKey, targetMenuId]) => {
      const option = sourceMenu.options.find(opt => opt.key === optionKey);
      if (option && targetMenuId) {
        onCreateConnection(sourceMenu.id, targetMenuId, optionKey, option.text);
      }
    });

    addNotification({
      type: 'success',
      message: `Created ${Object.keys(selectedConnections).length} option connections`,
    });

    onClose();
  };

  if (!isOpen || !sourceMenu) return null;

  const suggestions = getUXSuggestions(sourceMenu);
  const availableMenus = targetMenus.filter(menu => menu.id !== sourceMenu.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Smart Option Routing
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Connect "{sourceMenu.title}" options to target menus
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowGuides(!showGuides)}
                className={`p-2 rounded-lg transition-colors ${
                  showGuides ? 'text-blue-600 bg-blue-100' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title="Toggle UX Guides"
              >
                <Lightbulb className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Main Content */}
            <div className="overflow-y-auto flex-1 p-6">
              {/* Progress Steps */}
              <div className="flex justify-center items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
                    1
                  </div>
                  <div className="w-16 h-1 bg-slate-200" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-500">
                    2
                  </div>
                  <div className="w-16 h-1 bg-slate-200" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-500">
                    3
                  </div>
                </div>
              </div>

              {/* Source Menu Options */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Configure Option Routing
                </h3>
                <div className="space-y-4">
                  {sourceMenu.options?.map((option, index) => {
                    const smartSuggestions = getSmartSuggestions(option, availableMenus);
                    const selectedTarget = selectedConnections[option.key];
                    
                    return (
                      <motion.div
                        key={option.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                      >
                        {/* Option Header */}
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white ${
                              option.key === '0' ? 'bg-red-500' : 'bg-emerald-500'
                            }`}>
                              {option.key}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">
                                {option.text}
                              </p>
                              <p className="text-sm text-slate-500">
                                Route this option to a target menu
                              </p>
                            </div>
                          </div>
                          
                          {selectedTarget && (
                            <div className="flex items-center space-x-2 text-green-600">
                              <Check className="w-4 h-4" />
                              <span className="text-sm font-medium">Connected</span>
                            </div>
                          )}
                        </div>

                        {/* Smart Suggestions */}
                        {smartSuggestions.length > 0 && (
                          <div className="mb-3">
                            <p className="flex items-center mb-2 text-xs font-medium text-blue-600">
                              <Zap className="mr-1 w-3 h-3" />
                              Smart Suggestions
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {smartSuggestions.map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleOptionConnection(option.key, suggestion.menu.id)}
                                  className="flex items-center px-3 py-1 space-x-1 text-xs text-blue-700 bg-blue-100 rounded-full transition-colors hover:bg-blue-200"
                                >
                                  <span>{suggestion.menu.title}</span>
                                  <span className="text-blue-500">({suggestion.confidence}%)</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Target Menu Selection */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {availableMenus.map((menu) => (
                            <button
                              key={menu.id}
                              onClick={() => handleOptionConnection(option.key, menu.id)}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                selectedTarget === menu.id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {menu.title}
                                  </p>
                                  <p className="text-xs capitalize text-slate-500">
                                    {menu.type} Menu
                                  </p>
                                </div>
                                {selectedTarget === menu.id && (
                                  <Check className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* UX Guide Sidebar */}
            <AnimatePresence>
              {showGuides && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  className="overflow-y-auto p-6 w-80 border-l border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                >
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    <Lightbulb className="mr-2 w-5 h-5 text-yellow-500" />
                    UX Guidelines
                  </h3>
                  
                  <div className="space-y-4">
                    {suggestions.map((suggestion, index) => {
                      const IconComponent = suggestion.icon;
                      return (
                        <div key={index} className={`p-4 rounded-lg border ${
                          suggestion.type === 'warning' 
                            ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                            : suggestion.type === 'best-practice'
                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                            : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                        }`}>
                          <div className="flex items-start space-x-3">
                            <IconComponent className={`w-5 h-5 mt-0.5 ${
                              suggestion.type === 'warning' ? 'text-yellow-600' :
                              suggestion.type === 'best-practice' ? 'text-green-600' :
                              'text-blue-600'
                            }`} />
                            <div>
                              <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {suggestion.title}
                              </h4>
                              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                {suggestion.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Common USSD Patterns */}
                    <div className="mt-6">
                      <h4 className="mb-3 font-medium text-slate-900 dark:text-slate-100">
                        Common USSD Patterns
                      </h4>
                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          <span>Main Menu → Service Categories → Specific Actions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          <span>Input Collection → Validation → Confirmation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          <span>Transaction Flow → Review → Success/Error</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          <span>Always provide "Back" and "Exit" options</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 bg-gradient-to-r border-t from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-6">
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Settings className="w-4 h-4" />
                <span>{Object.keys(selectedConnections).length} connections configured</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors border border-slate-200 dark:border-slate-600 font-medium"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateConnections}
                  disabled={Object.keys(selectedConnections).length === 0}
                  className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Target className="w-4 h-4" />
                  <span>Create Connections</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OptionConnectionModal;