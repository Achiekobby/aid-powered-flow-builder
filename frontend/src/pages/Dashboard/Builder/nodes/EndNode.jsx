import React, { useState, memo } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit2, 
  Trash2, 
  CheckCircle, 
  X,
  Check,
  MessageCircle,
  Heart,
  Star,
  ThumbsUp,
  Smile,
  Wifi,
  Signal,
  Battery
} from 'lucide-react';

const endTypes = [
  { value: 'success', label: 'Success', icon: CheckCircle, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', textColor: 'text-green-700' },
  { value: 'thank-you', label: 'Thank You', icon: Heart, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
  { value: 'goodbye', label: 'Goodbye', icon: Smile, color: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
  { value: 'rating', label: 'Rating', icon: Star, color: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
  { value: 'feedback', label: 'Feedback', icon: ThumbsUp, color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
  { value: 'custom', label: 'Custom', icon: MessageCircle, color: 'from-gray-500 to-slate-500', bgColor: 'bg-gray-50', textColor: 'text-gray-700' },
];

const defaultMessages = {
  success: 'Success! Your request has been completed. Thank you for using our service!',
  'thank-you': 'Thank you for choosing our service! We appreciate your business and hope to serve you again soon.',
  goodbye: 'Goodbye! Have a wonderful day and thank you for using our service.',
  rating: 'Please rate your experience with us today. Your feedback helps us improve our service!',
  feedback: 'We value your feedback! Thank you for taking the time to share your thoughts with us.',
  custom: 'Thank you for using our service. Have a great day!',
};

const EndNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title || 'Thank You!');
  const [message, setMessage] = useState(data.message || defaultMessages.success);
  const [endType, setEndType] = useState(data.endType || 'success');
  const [showActions, setShowActions] = useState(false);

  const handleSave = () => {
    data.onEdit?.(data.id, { title, message, endType });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(data.title || 'Thank You!');
    setMessage(data.message || defaultMessages.success);
    setEndType(data.endType || 'success');
    setIsEditing(false);
  };

  const handleTypeChange = (newType) => {
    setEndType(newType);
    setMessage(defaultMessages[newType] || defaultMessages.custom);
    // Update title based on type
    const typeTitles = {
      success: 'Success!',
      'thank-you': 'Thank You!',
      goodbye: 'Goodbye!',
      rating: 'Rate Us',
      feedback: 'Feedback',
      custom: 'End Message',
    };
    setTitle(typeTitles[newType] || 'End Message');
  };

  const currentEndType = endTypes.find(type => type.value === endType) || endTypes[0];
  const IconComponent = currentEndType.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative transition-all ${selected ? 'z-20' : 'z-10'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Connection Handle - Only Input */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-500 border-2 border-white z-10"
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
            <div className="flex justify-between items-center px-2 py-0.5 text-white bg-red-600">
              <span className="text-xs font-medium">USSD Service</span>
              <span className="text-xs opacity-75">*123#</span>
            </div>

            {/* Content */}
            <div className="flex-1 p-2 overflow-y-auto">
              {isEditing ? (
                <div className="space-y-2">
                  {/* End Type Selector */}
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700">Type:</label>
                    <select
                      value={endType}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      {endTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700">Title:</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="End title..."
                    />
                  </div>

                  {/* Message Text */}
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700">Message:</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="w-full px-2 py-1 text-xs rounded border border-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="End message..."
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {message.length}/160 chars
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-1 pt-1">
                    <button
                      onClick={handleSave}
                      className="flex-1 px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Title */}
                  <h3 className="text-xs font-semibold text-gray-900">{title}</h3>
                  
                  {/* Message Preview */}
                  <div className={`p-2 ${currentEndType.bgColor} rounded border border-dashed border-opacity-50`}>
                    <div className="flex items-center mb-1 space-x-1">
                      <IconComponent className={`w-3 h-3 ${currentEndType.textColor}`} />
                      <span className={`text-xs font-medium ${currentEndType.textColor}`}>
                        {currentEndType.label}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-700">
                      {message.length > 80 ? `${message.substring(0, 80)}...` : message}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="p-1 text-xs text-gray-600 bg-orange-50 rounded">
                    <strong>🏁 Final Step:</strong> Session ends here
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
            className="absolute -top-2 -right-2 flex space-x-1 z-20"
          >
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              title="Edit end message"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => data.onDelete?.(data.id)}
              className="p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
              title="Delete end message"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Type Badge */}
      <div className="absolute -top-2 -left-2 z-20">
        <div className="flex justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full shadow-lg">
          E
        </div>
      </div>
    </motion.div>
  );
};

export default memo(EndNode);