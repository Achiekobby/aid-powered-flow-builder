import React, { useState, memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, 
  Trash2, 
  MessageSquare, 
  Plus, 
  X,
  Check,
  ArrowRight
} from 'lucide-react';

const MenuNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Menu');
  const [options, setOptions] = useState(data.options || []);
  const [showActions, setShowActions] = useState(false);

  const handleSave = () => {
    data.onEdit?.(data.id, { title, options });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(data.title || 'Menu');
    setOptions(data.options || []);
    setIsEditing(false);
  };

  const addOption = () => {
    const newKey = String(options.length + 1);
    setOptions([...options, { key: newKey, text: `Option ${newKey}` }]);
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`min-w-[280px] bg-white rounded-xl shadow-lg border-2 transition-all ${
        selected 
          ? 'border-blue-500 shadow-xl shadow-blue-500/20' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />

      {/* Header */}
      <div className="flex justify-between items-center p-4 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-2 py-1 text-sm text-white rounded border bg-white/20 placeholder-white/70 border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Menu title..."
              autoFocus
            />
          ) : (
            <h3 className="text-sm font-semibold">{title}</h3>
          )}
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {(showActions || isEditing) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-1"
            >
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="p-1 rounded transition-colors hover:bg-white/20"
                    title="Save changes"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1 rounded transition-colors hover:bg-white/20"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 rounded transition-colors hover:bg-white/20"
                    title="Edit menu"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => data.onDelete?.(data.id)}
                    className="p-1 rounded transition-colors hover:bg-red-500/50"
                    title="Delete menu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            {/* Options Editor */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Menu Options:</label>
                <button
                  onClick={addOption}
                  className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                >
                  <Plus className="mr-1 w-3 h-3" />
                  Add Option
                </button>
              </div>
              
              {options.map((option, index) => (
                <div key={index} className="flex relative items-center p-2 space-x-2 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={option.key}
                    onChange={(e) => updateOption(index, 'key', e.target.value)}
                    className="px-1 py-1 w-12 text-xs text-center rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Key"
                  />
                  <span className="text-gray-500">.</span>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    className="flex-1 px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Option text..."
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="p-1 text-red-500 rounded transition-colors hover:bg-red-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  
                  {/* Individual handle for each option (even in edit mode) */}
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`option-${option.key}`}
                    className="!absolute !right-[-6px] !top-1/2 !transform !-translate-y-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-full hover:bg-blue-600 transition-colors"
                    style={{ position: 'absolute' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex relative items-center p-2 space-x-2 bg-gray-50 rounded-lg border border-transparent transition-all group hover:bg-blue-50 hover:border-blue-200 hover:shadow-md">
                <span className="flex justify-center items-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded">
                  {option.key}
                </span>
                <span className="flex-1 text-sm text-gray-700">{option.text}</span>
                <div className="flex items-center pr-3">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                
                {/* Individual handle for each option */}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`option-${option.key}`}
                  className="!absolute !right-[-6px] !top-1/2 !transform !-translate-y-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-full hover:bg-blue-600 transition-colors"
                  style={{ position: 'absolute' }}
                />
              </div>
            ))}
            
            {options.length === 0 && (
              <div className="py-4 text-center text-gray-500">
                <MessageSquare className="mx-auto mb-2 w-8 h-8 opacity-50" />
                <p className="text-xs">No options yet</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-1 text-xs text-blue-600 hover:text-blue-700"
                >
                  Click to add options
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Type Badge */}
      <div className="absolute -top-2 -left-2">
        <div className="flex justify-center items-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full shadow-lg">
          M
        </div>
      </div>
    </motion.div>
  );
};

export default memo(MenuNode);