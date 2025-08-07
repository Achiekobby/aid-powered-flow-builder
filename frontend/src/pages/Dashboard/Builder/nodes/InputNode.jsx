import React, { useState, memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, 
  Trash2, 
  Hash, 
  X,
  Check,
  Type,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Wifi,
  Signal,
  Battery
} from 'lucide-react';

const inputTypes = [
  { value: 'text', label: 'Text', icon: Type, placeholder: 'Enter text...' },
  { value: 'number', label: 'Number', icon: Hash, placeholder: 'Enter number...' },
  { value: 'tel', label: 'Phone', icon: Phone, placeholder: 'Enter phone number...' },
  { value: 'email', label: 'Email', icon: Mail, placeholder: 'Enter email...' },
  { value: 'date', label: 'Date', icon: Calendar, placeholder: 'Select date...' },
  { value: 'amount', label: 'Amount', icon: DollarSign, placeholder: 'Enter amount...' },
];

const InputNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Get Input');
  const [inputType, setInputType] = useState(data.inputType || 'text');
  const [placeholder, setPlaceholder] = useState(data.placeholder || 'Enter your response...');
  const [required, setRequired] = useState(data.required || true);
  const [showActions, setShowActions] = useState(false);

  const handleSave = () => {
    data.onEdit?.(data.id, { title, inputType, placeholder, required });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(data.title || 'Get Input');
    setInputType(data.inputType || 'text');
    setPlaceholder(data.placeholder || 'Enter your response...');
    setRequired(data.required || true);
    setIsEditing(false);
  };

  const currentInputType = inputTypes.find(type => type.value === inputType) || inputTypes[0];
  const IconComponent = currentInputType.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative transition-all duration-300 ${
        selected 
          ? 'scale-105' 
          : 'hover:scale-102'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-white z-10"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white z-10"
      />

      {/* Phone Frame */}
      <div className="relative w-48 h-64 bg-gray-900 rounded-[1.5rem] p-1.5 shadow-2xl">
        {/* Phone Screen */}
        <div className="w-full h-full bg-black rounded-[1.2rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-2 py-0.5 text-xs text-white bg-gray-800">
            <div className="flex items-center space-x-0.5">
              <Signal className="w-1.5 h-1.5" />
              <span className="text-xs">Carrier</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <Wifi className="w-1.5 h-1.5" />
              <Battery className="w-1.5 h-1.5" />
            </div>
          </div>

          {/* USSD Interface */}
          <div className="flex flex-col h-[calc(100%-20px)] bg-white">
            {/* USSD Header */}
            <div className="flex justify-between items-center px-2 py-0.5 text-white bg-green-600">
              <span className="text-xs font-medium">USSD Service</span>
              <span className="text-xs opacity-75">*123#</span>
            </div>

            {/* Content */}
            <div className="flex-1 p-2 overflow-y-auto">
              {isEditing ? (
                <div className="space-y-2">
                  {/* Title Editor */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Input Title:
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Input title..."
                      autoFocus
                    />
                  </div>

                  {/* Input Type Selector */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Type:</label>
                    <select
                      value={inputType}
                      onChange={(e) => {
                        setInputType(e.target.value);
                        const type = inputTypes.find(t => t.value === e.target.value);
                        if (type) setPlaceholder(type.placeholder);
                      }}
                      className="w-full px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {inputTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Placeholder Text */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder:</label>
                    <input
                      type="text"
                      value={placeholder}
                      onChange={(e) => setPlaceholder(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="What users will see..."
                    />
                  </div>

                  {/* Required Toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="required"
                      checked={required}
                      onChange={(e) => setRequired(e.target.checked)}
                      className="w-3 h-3 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                    <label htmlFor="required" className="text-xs font-medium text-gray-700">
                      Required field
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-1 pt-1">
                    <button
                      onClick={handleSave}
                      className="flex-1 px-2 py-1 text-xs font-medium text-white bg-green-600 rounded transition-colors hover:bg-green-700"
                    >
                      <Check className="mr-1 w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded transition-colors hover:bg-gray-300"
                    >
                      <X className="mr-1 w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  
                  {/* Input Preview */}
                  <div className="p-2 bg-gray-50 rounded border-2 border-gray-300 border-dashed">
                    <div className="flex items-center mb-1 space-x-1">
                      <IconComponent className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-medium text-gray-700">{currentInputType.label}</span>
                      {required && (
                        <span className="text-xs font-medium text-red-500">*</span>
                      )}
                    </div>
                    <div className="text-xs italic text-gray-500">
                      "{placeholder}"
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-1 text-xs text-gray-600 bg-blue-50 rounded">
                    <strong>💡</strong> Users will enter information here
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-2 py-0.5 text-center bg-gray-50 border-t">
              <span className="text-xs text-gray-500">
                USSD Session
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Overlay */}
      <AnimatePresence>
        {showActions && !isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-2 -right-2 flex items-center space-x-1 z-20"
          >
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-full bg-green-500 text-white shadow-lg transition-colors hover:bg-green-600"
              title="Edit input"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => data.onDelete?.(data.id)}
              className="p-1 rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
              title="Delete input"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Type Badge */}
      <div className="absolute -top-2 -left-2 z-20">
        <div className="flex justify-center items-center w-6 h-6 text-xs font-bold text-white bg-green-500 rounded-full shadow-lg">
          I
        </div>
      </div>
    </motion.div>
  );
};

export default memo(InputNode);