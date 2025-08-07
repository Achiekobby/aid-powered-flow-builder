import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Smartphone,
  Play,
  Square,
  ArrowLeft,
  Send,
  Wifi,
  Signal,
  Battery
} from 'lucide-react';

const SimplePhonePreview = ({ nodes, edges, isTestMode, onClose }) => {
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isEnded, setIsEnded] = useState(false);

  // Find the starting node (first menu node or node without incoming edges)
  const startingNode = useMemo(() => {
    const nodeWithoutIncoming = nodes.find(node => 
      !edges.some(edge => edge.target === node.id)
    );
    return nodeWithoutIncoming || nodes[0];
  }, [nodes, edges]);

  // Start testing
  const startTest = () => {
    if (startingNode) {
      setCurrentNodeId(startingNode.id);
      setSessionHistory([]);
      setIsEnded(false);
      setUserInput('');
    }
  };

  // Stop testing
  const stopTest = () => {
    setCurrentNodeId(null);
    setSessionHistory([]);
    setIsEnded(false);
    setUserInput('');
  };

  // Get current node
  const currentNode = nodes.find(node => node.id === currentNodeId);

  // Handle user input/selection
  const handleUserAction = (action) => {
    if (!currentNode) return;

    // Add to history
    const historyEntry = {
      nodeId: currentNodeId,
      nodeTitle: currentNode.data.title,
      userAction: action,
      timestamp: new Date().toLocaleTimeString()
    };
    setSessionHistory(prev => [...prev, historyEntry]);

    // Find next node based on action
    if (currentNode.type === 'menuNode') {
      // For menu nodes, find edge that matches the option
      const option = currentNode.data.options?.find(opt => opt.key === action);
      if (option) {
        const nextEdge = edges.find(edge => 
          edge.source === currentNodeId && 
          (edge.label?.includes(`Option ${action}`) || edge.label?.includes(action))
        );
        
        if (nextEdge) {
          const nextNode = nodes.find(node => node.id === nextEdge.target);
          if (nextNode) {
            if (nextNode.type === 'endNode') {
              setIsEnded(true);
            }
            setCurrentNodeId(nextNode.id);
          }
        }
      }
    } else if (currentNode.type === 'inputNode') {
      // For input nodes, proceed to next connected node
      const nextEdge = edges.find(edge => edge.source === currentNodeId);
      if (nextEdge) {
        const nextNode = nodes.find(node => node.id === nextEdge.target);
        if (nextNode) {
          if (nextNode.type === 'endNode') {
            setIsEnded(true);
          }
          setCurrentNodeId(nextNode.id);
        }
      }
    }

    setUserInput('');
  };

  // Go back in history
  const goBack = () => {
    if (sessionHistory.length > 0) {
      const previousEntry = sessionHistory[sessionHistory.length - 2];
      if (previousEntry) {
        setCurrentNodeId(previousEntry.nodeId);
        setSessionHistory(prev => prev.slice(0, -1));
        setIsEnded(false);
      } else {
        // Go back to start
        setCurrentNodeId(startingNode?.id || null);
        setSessionHistory([]);
        setIsEnded(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full phone-preview-container">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200/50 dark:border-slate-700/50">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Phone Preview
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Phone Simulator */}
      <div className="flex flex-1 justify-center items-center p-2">
        <div className="relative">
          {/* Phone Frame */}
          <div className="w-64 h-[480px] bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
            {/* Screen */}
            <div className="w-full h-full bg-black rounded-[1.5rem] overflow-hidden relative">
              {/* Status Bar */}
              <div className="flex justify-between items-center px-3 py-1 text-xs text-white bg-gray-800">
                <div className="flex items-center space-x-1">
                  <Signal className="w-2 h-2" />
                  <span className="text-xs">Carrier</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wifi className="w-2 h-2" />
                  <Battery className="w-2 h-2" />
                </div>
              </div>

              {/* USSD Interface */}
              <div className="flex flex-col h-[calc(100%-24px)] bg-white">
                {/* USSD Header */}
                <div className="flex justify-between items-center px-3 py-1 text-white bg-blue-600">
                  <span className="text-xs font-medium">USSD Service</span>
                  <span className="text-xs opacity-75">*123#</span>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-3">
                  <AnimatePresence mode="wait">
                    {!isTestMode || !currentNodeId ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-8 text-center"
                      >
                        <Smartphone className="mx-auto mb-3 w-8 h-8 text-gray-400" />
                        <p className="mb-3 text-xs text-gray-600">
                          {nodes.length === 0 
                            ? "Create some menus first!" 
                            : "Click 'Start Test' to try your flow"
                          }
                        </p>
                      </motion.div>
                    ) : isEnded ? (
                      <motion.div
                        key="ended"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="py-6 text-center">
                          <div className="flex justify-center items-center mx-auto mb-3 w-12 h-12 bg-green-100 rounded-full">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: 'spring' }}
                            >
                              ✅
                            </motion.div>
                          </div>
                          <h3 className="mb-2 text-sm font-semibold text-gray-900">
                            {currentNode?.data.title}
                          </h3>
                          <p className="text-xs leading-relaxed text-gray-600">
                            {currentNode?.data.message}
                          </p>
                        </div>
                        <div className="text-center">
                          <button
                            onClick={startTest}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Start Over
                          </button>
                        </div>
                      </motion.div>
                    ) : currentNode ? (
                      <motion.div
                        key={currentNodeId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div>
                          <h3 className="mb-2 text-sm font-semibold text-gray-900">
                            {currentNode.data.title}
                          </h3>
                          
                          {currentNode.type === 'menuNode' && (
                            <div className="space-y-1">
                              {currentNode.data.options?.map((option, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleUserAction(option.key)}
                                  className="p-2 w-full text-left rounded-lg border border-gray-200 transition-colors hover:bg-blue-50 hover:border-blue-300"
                                >
                                  <span className="mr-2 font-medium text-blue-600 text-xs">
                                    {option.key}.
                                  </span>
                                  <span className="text-xs text-gray-700">
                                    {option.text}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {currentNode.type === 'inputNode' && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-600">
                                {currentNode.data.placeholder}
                              </p>
                              <div className="flex space-x-1">
                                <input
                                  type={currentNode.data.inputType || 'text'}
                                  value={userInput}
                                  onChange={(e) => setUserInput(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && userInput.trim()) {
                                      handleUserAction(userInput.trim());
                                    }
                                  }}
                                  className="flex-1 px-2 py-1 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder={currentNode.data.placeholder}
                                />
                                <button
                                  onClick={() => userInput.trim() && handleUserAction(userInput.trim())}
                                  disabled={!userInput.trim()}
                                  className="px-2 py-1 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-8 text-center"
                      >
                        <p className="text-xs text-gray-600">No starting point found</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-3 py-1 text-center bg-gray-50 border-t">
                  <span className="text-xs text-gray-500">
                    {isTestMode && currentNodeId && !isEnded ? (
                      `Step ${sessionHistory.length + 1}`
                    ) : (
                      'USSD Session'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test History (if in test mode) */}
      {isTestMode && sessionHistory.length > 0 && (
        <div className="overflow-y-auto p-4 max-h-40 border-t border-gray-200/50 dark:border-slate-700/50">
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Session History:
          </h4>
          <div className="space-y-1">
            {sessionHistory.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                <span className="w-12 text-gray-500">{entry.timestamp}</span>
                <span className="font-medium">{entry.nodeTitle}</span>
                <span className="text-blue-600">→ {entry.userAction}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplePhonePreview;