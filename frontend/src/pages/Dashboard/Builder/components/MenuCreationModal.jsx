import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Phone, 
  Menu, 
  Terminal, 
  CheckCircle, 
  GitBranch, 
  Zap,
  Type,
  Hash,
  Mail,
  Calculator,
  Clock,
  Shield
} from 'lucide-react';

const MenuCreationModal = ({ isOpen, onClose, onCreate, position }) => {
  const [selectedType, setSelectedType] = useState('sub');
  const [menuData, setMenuData] = useState({
    title: '',
    type: 'sub',
    inputType: 'text',
    required: true,
    validation: [],
    condition: {
      variable: '',
      operator: 'equals',
      value: '',
    },
    apiEndpoint: '',
    timeout: 30,
  });

  const menuTypes = [
    {
      id: 'main',
      name: 'Main Menu',
      description: 'The entry point of your USSD application',
      icon: Phone,
      color: 'from-emerald-500 to-cyan-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      disabled: true, // Only one main menu allowed
    },
    {
      id: 'sub',
      name: 'Sub Menu',
      description: 'Regular menu with options for user selection',
      icon: Menu,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 'input',
      name: 'Input Menu',
      description: 'Collect user data like phone numbers, names, etc.',
      icon: Terminal,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      id: 'end',
      name: 'End Menu',
      description: 'Final message that terminates the session',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      id: 'conditional',
      name: 'Conditional Menu',
      description: 'Route users based on conditions and variables',
      icon: GitBranch,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      id: 'api',
      name: 'API Menu',
      description: 'Fetch data from external APIs and display results',
      icon: Zap,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
    },
  ];

  const inputTypes = [
    { id: 'text', name: 'Text', icon: Type, description: 'Any text input' },
    { id: 'number', name: 'Number', icon: Hash, description: 'Numeric input only' },
    { id: 'phone', name: 'Phone', icon: Phone, description: 'Phone number format' },
    { id: 'email', name: 'Email', icon: Mail, description: 'Email address format' },
    { id: 'amount', name: 'Amount', icon: Calculator, description: 'Currency amount' },
  ];

  const conditionOperators = [
    { id: 'equals', name: 'Equals', symbol: '=' },
    { id: 'not_equals', name: 'Not Equals', symbol: '≠' },
    { id: 'greater_than', name: 'Greater Than', symbol: '>' },
    { id: 'less_than', name: 'Less Than', symbol: '<' },
    { id: 'contains', name: 'Contains', symbol: '⊃' },
    { id: 'starts_with', name: 'Starts With', symbol: '⊢' },
  ];

  const handleCreate = () => {
    if (!menuData.title.trim()) return;

    const newMenu = {
      title: menuData.title.trim(),
      type: selectedType,
      position: position,
      options: selectedType === 'sub' || selectedType === 'main' ? [] : undefined,
      inputType: selectedType === 'input' ? menuData.inputType : undefined,
      required: selectedType === 'input' ? menuData.required : undefined,
      validation: selectedType === 'input' ? menuData.validation : undefined,
      condition: selectedType === 'conditional' ? menuData.condition : undefined,
      apiEndpoint: selectedType === 'api' ? menuData.apiEndpoint : undefined,
      timeout: selectedType === 'api' ? menuData.timeout : undefined,
      variableName: selectedType === 'input' ? `input_${Date.now()}` : undefined,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    onCreate(newMenu);
    
    // Reset form
    setMenuData({
      title: '',
      type: 'sub',
      inputType: 'text',
      required: true,
      validation: [],
      condition: { variable: '', operator: 'equals', value: '' },
      apiEndpoint: '',
      timeout: 30,
    });
    setSelectedType('sub');
  };

  const selectedMenuType = menuTypes.find(type => type.id === selectedType);

  if (!isOpen) return null;

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Create New Menu
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Choose a menu type and configure its properties
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Menu Type Selection */}
            <div className="overflow-y-auto p-6 w-1/2 border-r border-slate-200 dark:border-slate-700">
              <h3 className="mb-4 text-lg font-medium text-slate-900 dark:text-slate-100">
                Select Menu Type
              </h3>
              
              <div className="space-y-3">
                {menuTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selectedType === type.id;
                  
                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: type.disabled ? 1 : 1.02 }}
                      whileTap={{ scale: type.disabled ? 1 : 0.98 }}
                      onClick={() => !type.disabled && setSelectedType(type.id)}
                      disabled={type.disabled}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? `border-blue-500 ${type.bgColor} shadow-lg`
                          : type.disabled
                          ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 opacity-50 cursor-not-allowed'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color} flex-shrink-0`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1 font-medium text-slate-900 dark:text-slate-100">
                            {type.name}
                            {type.disabled && (
                              <span className="px-2 py-1 ml-2 text-xs rounded-full bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400">
                                ONE ONLY
                              </span>
                            )}
                          </h4>
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="mt-2 w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Configuration Panel */}
            <div className="overflow-y-auto p-6 w-1/2">
              <div className="flex items-center mb-6 space-x-3">
                {selectedMenuType && (
                  <>
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedMenuType.color}`}>
                      {React.createElement(selectedMenuType.icon, {
                        className: "w-5 h-5 text-white"
                      })}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                        {selectedMenuType.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Configure your menu properties
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-6">
                {/* Basic Configuration */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Menu Title *
                  </label>
                  <input
                    type="text"
                    value={menuData.title}
                    onChange={(e) => setMenuData({ ...menuData, title: e.target.value })}
                    placeholder="Enter menu title..."
                    className="px-4 py-3 w-full bg-white rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Input Menu Configuration */}
                {selectedType === 'input' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Input Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {inputTypes.map((inputType) => {
                          const IconComponent = inputType.icon;
                          const isSelected = menuData.inputType === inputType.id;
                          
                          return (
                            <button
                              key={inputType.id}
                              onClick={() => setMenuData({ ...menuData, inputType: inputType.id })}
                              className={`p-3 rounded-lg border text-left transition-colors ${
                                isSelected
                                  ? 'bg-purple-50 border-purple-500 dark:bg-purple-900/20'
                                  : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                              }`}
                            >
                              <div className="flex items-center mb-1 space-x-2">
                                <IconComponent className={`w-4 h-4 ${
                                  isSelected ? 'text-purple-600' : 'text-slate-500'
                                }`} />
                                <span className="text-sm font-medium">{inputType.name}</span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {inputType.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="required"
                        checked={menuData.required}
                        onChange={(e) => setMenuData({ ...menuData, required: e.target.checked })}
                        className="text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                      />
                      <label htmlFor="required" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                        Required field
                      </label>
                    </div>
                  </div>
                )}

                {/* Conditional Menu Configuration */}
                {selectedType === 'conditional' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Variable to Check
                      </label>
                      <input
                        type="text"
                        value={menuData.condition.variable}
                        onChange={(e) => setMenuData({
                          ...menuData,
                          condition: { ...menuData.condition, variable: e.target.value }
                        })}
                        placeholder="e.g., user_balance, account_type"
                        className="px-4 py-3 w-full bg-white rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          Operator
                        </label>
                        <select
                          value={menuData.condition.operator}
                          onChange={(e) => setMenuData({
                            ...menuData,
                            condition: { ...menuData.condition, operator: e.target.value }
                          })}
                          className="px-4 py-3 w-full bg-white rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                        >
                          {conditionOperators.map(op => (
                            <option key={op.id} value={op.id}>
                              {op.name} ({op.symbol})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          Value
                        </label>
                        <input
                          type="text"
                          value={menuData.condition.value}
                          onChange={(e) => setMenuData({
                            ...menuData,
                            condition: { ...menuData.condition, value: e.target.value }
                          })}
                          placeholder="Comparison value"
                          className="px-4 py-3 w-full bg-white rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* API Menu Configuration */}
                {selectedType === 'api' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        API Endpoint
                      </label>
                      <input
                        type="url"
                        value={menuData.apiEndpoint}
                        onChange={(e) => setMenuData({ ...menuData, apiEndpoint: e.target.value })}
                        placeholder="https://api.example.com/data"
                        className="px-4 py-3 w-full bg-white rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Timeout (seconds)
                      </label>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          min="5"
                          max="120"
                          value={menuData.timeout}
                          onChange={(e) => setMenuData({ ...menuData, timeout: parseInt(e.target.value) })}
                          className="px-4 py-3 w-full bg-white rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Features */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center mb-3 space-x-2">
                    <Shield className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Security & Validation
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center">
                      <div className="mr-2 w-2 h-2 bg-green-500 rounded-full" />
                      Input sanitization enabled
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 w-2 h-2 bg-green-500 rounded-full" />
                      Rate limiting protection
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 w-2 h-2 bg-green-500 rounded-full" />
                      Session management
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 bg-gradient-to-r border-t from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-4 justify-between items-start p-6 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span><strong>Position:</strong> x: {Math.round(position.x)}, y: {Math.round(position.y)}</span>
                </div>
              </div>
              
              <div className="flex justify-end items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors border border-slate-200 dark:border-slate-600 font-medium"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  disabled={!menuData.title.trim()}
                  className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium transition-all duration-200 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  Create Menu
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MenuCreationModal;