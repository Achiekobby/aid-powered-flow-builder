import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Signal, 
  Wifi, 
  Battery, 
  Volume2, 
  VolumeX,
  Play, 
  Square, 
  RotateCcw, 
  History,
  ArrowLeft
} from 'lucide-react';
import useUSSDBuilderStore, { selectCurrentMenu } from '../../../../store/ussdBuilderStore';

const EnhancedPhonePreview = () => {
  const [inputValue, setInputValue] = useState('');

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef(null);
  const contentRef = useRef(null);

  const {
    testing,
    menus,
    actions: {
      startTesting,
      stopTesting,
      processUserInput,
      addNotification,
    }
  } = useUSSDBuilderStore();

  // Get current menu using selector
  const currentMenu = useUSSDBuilderStore(selectCurrentMenu);

  // Smartphone configuration
  const currentDevice = {
    name: 'Smartphone',
    width: 320,
    height: 640,
    className: 'bg-gray-900 rounded-[2.5rem] p-2',
    screenClass: 'bg-black rounded-[2rem]',
  };

  // Sound effects
  const playSound = (type) => {
    if (!soundEnabled) return;
    
    // Create simple audio feedback
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'keypress':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        break;
      case 'navigation':
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        break;
      case 'error':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        break;
        default:
          break;
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // Handle user input
  const handleInput = (value) => {
    if (!currentMenu || !testing.isActive) return;

    playSound('keypress');
    setInputValue(value);
    
    // Add to session history
    const historyEntry = {
      timestamp: new Date(),
      menuTitle: currentMenu.title,
      userInput: value,
      menuType: currentMenu.type,
    };
    
    setSessionHistory(prev => [...prev, historyEntry]);

    // Process the input
    setTimeout(() => {
      processUserInput(value);
      setInputValue('');
      playSound('navigation');
      
      // Auto-scroll to bottom
      if (contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
    }, 500);
  };

  // Keyboard input handling
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleInput(inputValue.trim());
    }
  };

  // Start/stop testing
  const handleStartTesting = () => {
    const mainMenu = Object.values(menus).find(menu => menu.type === 'main');
    if (!mainMenu) {
      addNotification({
        type: 'error',
        message: 'No main menu found. Create a main menu first.',
      });
      return;
    }
    
    startTesting(mainMenu.id);
    setSessionHistory([]);
    playSound('navigation');
    
    addNotification({
      type: 'success',
      message: 'Testing session started',
    });
  };

  const handleStopTesting = () => {
    stopTesting();
    setInputValue('');
    playSound('navigation');
    
    addNotification({
      type: 'info',
      message: 'Testing session stopped',
    });
  };

  const handleRestart = () => {
    handleStopTesting();
    setTimeout(() => {
      handleStartTesting();
    }, 500);
  };

  // Menu rendering based on type
  const renderMenuContent = () => {
    if (!currentMenu) {
      return (
        <div className="flex flex-col justify-center items-center p-6 h-full text-center">
          <div className="mb-4 text-4xl">📱</div>
          <h3 className="mb-2 text-sm font-medium text-gray-700">
            Ready to Test
          </h3>
          <p className="mb-4 text-xs leading-relaxed text-gray-500">
            Start testing to see your USSD flow in action
          </p>
          <button
            onClick={handleStartTesting}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
          >
            Start Test
          </button>
        </div>
      );
    }

    if (currentMenu.type === 'input') {
      return (
        <div className="space-y-4">
          <div className="pb-2 text-center border-b border-gray-200">
            <h3 className="text-sm font-semibold leading-tight text-gray-900">
              {currentMenu.title}
            </h3>
          </div>
          
          <div className="p-3 bg-purple-50 rounded border border-purple-200">
            <div className="flex items-center mb-2 text-xs text-purple-700">
              <span className="font-medium">
                Please enter {currentMenu.inputType || 'text'}:
              </span>
            </div>
            {currentMenu.validation && currentMenu.validation.length > 0 && (
              <p className="text-xs text-purple-600 opacity-75">
                Validation rules apply
              </p>
            )}
          </div>
        </div>
      );
    }

    if (currentMenu.type === 'end') {
      return (
        <div className="space-y-4">
          <div className="pb-2 text-center border-b border-gray-200">
            <h3 className="text-sm font-semibold leading-tight text-gray-900">
              {currentMenu.title}
            </h3>
          </div>
          
          <div className="p-4 text-center bg-green-50 rounded border border-green-200">
            <div className="mb-2 text-2xl">✅</div>
            <p className="text-sm font-medium text-green-800">Session Complete</p>
            <p className="mt-1 text-xs text-green-600">Thank you for using our service</p>
          </div>
        </div>
      );
    }

    // Regular menu with options
    return (
      <div className="space-y-3">
        <div className="pb-2 text-center border-b border-gray-200">
          <h3 className="text-sm font-semibold leading-tight text-gray-900">
            {currentMenu.title}
          </h3>
        </div>

        <div className="space-y-2">
          {currentMenu.options && currentMenu.options.length > 0 ? (
            currentMenu.options.map((option, index) => (
              <motion.div
                key={option.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors ${
                  option.key === '0' 
                    ? 'bg-red-50 border border-red-200 hover:bg-red-100'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => handleInput(option.key)}
              >
                <div className="flex items-center space-x-2">
                  <span className={`font-bold min-w-[16px] ${
                    option.key === '0' ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {option.key}.
                  </span>
                  <span className={`${
                    option.key === '0' ? 'text-red-800' : 'text-gray-800'
                  }`}>
                    {option.text}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {option.targetId && menus[option.targetId] && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" title="Connected" />
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-4 text-center text-gray-500">
              <p className="text-xs">No options configured</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">


      {/* Controls */}
      <div className="flex justify-between items-center p-3 mb-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          {!testing.isActive ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartTesting}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700"
            >
              <Play className="mr-1 w-4 h-4" />
              Start Test
            </motion.button>
          ) : (
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStopTesting}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700"
              >
                <Square className="mr-1 w-4 h-4" />
                Stop
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
              >
                <RotateCcw className="mr-1 w-4 h-4" />
                Restart
              </motion.button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg transition-colors ${
              showHistory ? 'text-blue-600 bg-blue-100' : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="Session History"
          >
            <History className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              soundEnabled ? 'text-green-600 bg-green-100' : 'text-gray-500 hover:bg-gray-100'
            }`}
            title={`Sound ${soundEnabled ? 'On' : 'Off'}`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Phone Mockup */}
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="relative">
          <div 
            className={`relative shadow-2xl border-4 border-gray-800 ${currentDevice.className}`}
            style={{ 
              width: currentDevice.width, 
              height: currentDevice.height 
            }}
          >
            <div className={`${currentDevice.screenClass} overflow-hidden relative h-full`}>
              {/* Status Bar */}
              <div className="flex justify-between items-center px-3 py-2 text-xs text-white bg-black">
                <div className="flex items-center space-x-1">
                  <Signal className="w-3 h-3" />
                  <span className="font-medium">MTN</span>
                </div>
                <div className="font-medium">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center space-x-1">
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-4 h-2" />
                </div>
              </div>

              {/* USSD Interface */}
              <div className="flex flex-col bg-gray-100"
                   style={{ height: currentDevice.height - 80 }}>
                
                {/* USSD Header */}
                <div className="flex justify-between items-center px-3 py-2 text-white bg-blue-600">
                  <div className="flex items-center">
                    <Volume2 className="mr-2 w-3 h-3" />
                    <span className="text-xs font-medium">USSD</span>
                  </div>
                  <span className="text-xs opacity-75">*123#</span>
                  {testing.isActive && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  )}
                </div>

                {/* USSD Content */}
                <div 
                  ref={contentRef}
                  className="overflow-y-auto flex-1 p-4 bg-white"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentMenu?.id || 'empty'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderMenuContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Input Area */}
                {testing.isActive && currentMenu && currentMenu.type !== 'end' && (
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-600">
                        Reply:
                      </span>
                      <span className="text-xs text-gray-500">
                        Send • Cancel
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={currentMenu.type === 'input' ? `Enter ${currentMenu.inputType}...` : "Enter option..."}
                        className="flex-1 px-2 py-2 text-xs text-gray-900 bg-white rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                        maxLength={currentMenu.type === 'input' ? 50 : 1}
                        autoFocus
                      />
                      <button
                        onClick={() => handleInput(inputValue)}
                        disabled={!inputValue.trim()}
                        className="px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded shadow-lg transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Home Indicator (for modern phones) */}
            <div className="absolute bottom-1 left-1/2 w-20 h-1 bg-gray-600 rounded-full transform -translate-x-1/2" />
          </div>
        </div>

        {/* Testing Info */}
        {testing.isActive && (
          <div className="mt-4 text-center">
            <div className="flex justify-center items-center space-x-4 text-xs text-gray-600">
              <span>Step: {testing.currentStep}</span>
              <span>•</span>
              <span>Session: {testing.sessionHistory.length} interactions</span>
              <span>•</span>
              <span>Menu: {currentMenu?.type || 'none'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Session History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-4 bottom-4 top-20 z-50 w-80 bg-white rounded-xl border border-gray-200 shadow-2xl"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Session History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded-lg transition-colors hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 h-full">
              {sessionHistory.length === 0 ? (
                <div className="mt-8 text-center text-gray-500">
                  <History className="mx-auto mb-2 w-8 h-8 opacity-50" />
                  <p className="text-sm">No history yet</p>
                  <p className="mt-1 text-xs">Start testing to see interactions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessionHistory.map((entry, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {entry.menuTitle}
                        </span>
                        <span className="text-xs text-gray-500">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Input: <span className="px-1 font-mono bg-gray-200 rounded">{entry.userInput}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Type: {entry.menuType}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedPhonePreview;