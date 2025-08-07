import React, { useCallback, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Plus,
  Save,
  Play,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Hash,
  MessageSquare,
  Star,
  Lightbulb,
  HelpCircle,
  Zap,
  Undo2,
  Redo2
} from 'lucide-react';

// Custom Node Components
import MenuNode from './nodes/MenuNode';
import InputNode from './nodes/InputNode';
import EndNode from './nodes/EndNode';

// Simple Phone Preview
import SimplePhonePreview from './SimplePhonePreview';

// Tutorial Component
import QuickTutorial from './QuickTutorial';

const nodeTypes = {
  menuNode: MenuNode,
  inputNode: InputNode,
  endNode: EndNode,
};

const SimpleUSSDBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showPhonePreview, setShowPhonePreview] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);
  
  // Undo functionality
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Save current state to history
  const saveToHistory = useCallback((newNodes, newEdges) => {
    const currentState = { nodes: newNodes, edges: newEdges };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    
    // Keep only last 20 states to prevent memory issues
    if (newHistory.length > 20) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Initialize history with empty state
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory([], []);
    }
  }, []); // Only run once on mount

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Suppress ResizeObserver warnings (common with React Flow)
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes && args[0].includes('ResizeObserver loop completed')) {
        return; // Suppress ResizeObserver warnings
      }
      originalConsoleError.apply(console, args);
    };

    // Handle ResizeObserver errors more gracefully
    const handleResizeObserverError = (e) => {
      if (e.message && e.message.includes('ResizeObserver')) {
        e.preventDefault();
        return false;
      }
    };

    // Handle unhandled promise rejections related to ResizeObserver
    const handleUnhandledRejection = (e) => {
      if (e.reason && e.reason.message && e.reason.message.includes('ResizeObserver')) {
        e.preventDefault();
        return false;
      }
    };

    // Debounced resize handler to prevent ResizeObserver loops
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Trigger a small delay to prevent rapid ResizeObserver calls
        window.dispatchEvent(new Event('resize'));
      }, 100);
    };

    window.addEventListener('error', handleResizeObserverError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('resize', handleResize);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleResizeObserverError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        saveToHistory(nodes, newEdges);
        return newEdges;
      });
    },
    [setEdges, nodes, saveToHistory]
  );

  // Update node data
  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) => {
      const newNodes = nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      );
      saveToHistory(newNodes, edges);
      return newNodes;
    });
  }, [setNodes, edges, saveToHistory]);

  // Delete node
  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => {
      const newNodes = nds.filter((node) => node.id !== nodeId);
      setEdges((eds) => {
        const newEdges = eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
        // Save to history after both operations complete
        setTimeout(() => saveToHistory(newNodes, newEdges), 0);
        return newEdges;
      });
      return newNodes;
    });
  }, [setNodes, setEdges, saveToHistory]);

  // Add new menu node
  const addMenuNode = useCallback(() => {
    const newNode = {
      id: `menu-${Date.now()}`,
      type: 'menuNode',
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
      data: {
        title: 'New Menu',
        options: [
          { key: '1', text: 'Option 1' },
          { key: '0', text: 'Back' }
        ],
        onEdit: updateNodeData,
        onDelete: deleteNode,
      },
    };
    setNodes((nds) => {
      const newNodes = [...nds, newNode];
      saveToHistory(newNodes, edges);
      return newNodes;
    });
  }, [setNodes, updateNodeData, deleteNode, edges, saveToHistory]);

  // Add input node
  const addInputNode = useCallback(() => {
    const newNode = {
      id: `input-${Date.now()}`,
      type: 'inputNode',
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
      data: {
        title: 'Get User Input',
        inputType: 'text',
        placeholder: 'Enter your response...',
        onEdit: updateNodeData,
        onDelete: deleteNode,
      },
    };
    setNodes((nds) => {
      const newNodes = [...nds, newNode];
      saveToHistory(newNodes, edges);
      return newNodes;
    });
  }, [setNodes, updateNodeData, deleteNode, edges, saveToHistory]);

  // Add end node
  const addEndNode = useCallback(() => {
    const newNode = {
      id: `end-${Date.now()}`,
      type: 'endNode',
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
      data: {
        title: 'Thank You!',
        message: 'Your session has ended. Have a great day!',
        onEdit: updateNodeData,
        onDelete: deleteNode,
      },
    };
    setNodes((nds) => {
      const newNodes = [...nds, newNode];
      saveToHistory(newNodes, edges);
      return newNodes;
    });
  }, [setNodes, updateNodeData, deleteNode, edges, saveToHistory]);

  // Create a simple starter flow
  const createStarterFlow = useCallback(() => {
    const mainMenu = {
      id: 'main-menu',
      type: 'menuNode',
      position: { x: 100, y: 100 },
      data: {
        title: 'Main Menu',
        options: [
          { key: '1', text: 'Check Balance' },
          { key: '2', text: 'Send Money' },
          { key: '3', text: 'Buy Airtime' },
          { key: '0', text: 'Exit' }
        ],
        onEdit: (nodeId, data) => updateNodeData(nodeId, data),
        onDelete: (nodeId) => deleteNode(nodeId),
      },
    };

    const balanceMenu = {
      id: 'balance-menu',
      type: 'endNode',
      position: { x: 400, y: 50 },
      data: {
        title: 'Your Balance',
        message: 'Your account balance is $150.00. Thank you for using our service!',
        onEdit: (nodeId, data) => updateNodeData(nodeId, data),
        onDelete: (nodeId) => deleteNode(nodeId),
      },
    };

    const sendMoneyInput = {
      id: 'send-money-input',
      type: 'inputNode',
      position: { x: 400, y: 150 },
      data: {
        title: 'Enter Amount',
        inputType: 'number',
        placeholder: 'Enter amount to send...',
        onEdit: (nodeId, data) => updateNodeData(nodeId, data),
        onDelete: (nodeId) => deleteNode(nodeId),
      },
    };

    const airtimeInput = {
      id: 'airtime-input',
      type: 'inputNode',
      position: { x: 400, y: 250 },
      data: {
        title: 'Phone Number',
        inputType: 'tel',
        placeholder: 'Enter phone number...',
        onEdit: (nodeId, data) => updateNodeData(nodeId, data),
        onDelete: (nodeId) => deleteNode(nodeId),
      },
    };

    const exitMenu = {
      id: 'exit-menu',
      type: 'endNode',
      position: { x: 400, y: 350 },
      data: {
        title: 'Goodbye!',
        message: 'Thank you for using our service. Have a great day!',
        onEdit: (nodeId, data) => updateNodeData(nodeId, data),
        onDelete: (nodeId) => deleteNode(nodeId),
      },
    };

    setNodes([mainMenu, balanceMenu, sendMoneyInput, airtimeInput, exitMenu]);
    
    const newEdges = [
      { 
        id: 'main-balance', 
        source: 'main-menu', 
        sourceHandle: 'option-1',
        target: 'balance-menu', 
        label: 'Check Balance', 
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 }
      },
      { 
        id: 'main-send', 
        source: 'main-menu', 
        sourceHandle: 'option-2',
        target: 'send-money-input', 
        label: 'Send Money', 
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 }
      },
      { 
        id: 'main-airtime', 
        source: 'main-menu', 
        sourceHandle: 'option-3',
        target: 'airtime-input', 
        label: 'Buy Airtime', 
        animated: true,
        style: { stroke: '#f59e0b', strokeWidth: 2 }
      },
      { 
        id: 'main-exit', 
        source: 'main-menu', 
        sourceHandle: 'option-0',
        target: 'exit-menu', 
        label: 'Exit', 
        animated: true,
        style: { stroke: '#ef4444', strokeWidth: 2 }
      },
    ];
    
    setEdges(newEdges);
    saveToHistory([mainMenu, balanceMenu, sendMoneyInput, airtimeInput, exitMenu], newEdges);
    setShowTutorial(false);
  }, [setNodes, setEdges, updateNodeData, deleteNode, saveToHistory]);

  // Save flow
  const saveFlow = useCallback(() => {
    const flowData = { nodes, edges };
    localStorage.setItem('ussd-flow', JSON.stringify(flowData));
    // Show success message
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-50 px-6 py-3 text-white bg-green-500 rounded-lg shadow-lg';
    notification.textContent = '✅ Flow saved successfully!';
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  }, [nodes, edges]);

  // Test flow
  const testFlow = useCallback(() => {
    setIsTestMode(!isTestMode);
    setShowPhonePreview(true);
  }, [isTestMode]);

  // Calculate flow stats
  const flowStats = useMemo(() => {
    return {
      totalMenus: nodes.length,
      totalConnections: edges.length,
      menuTypes: {
        menus: nodes.filter(n => n.type === 'menuNode').length,
        inputs: nodes.filter(n => n.type === 'inputNode').length,
        endings: nodes.filter(n => n.type === 'endNode').length,
      }
    };
  }, [nodes, edges]);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Full Screen React Flow Canvas */}
      <div className="absolute inset-0 z-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
          defaultEdgeOptions={{
            animated: true,
            style: { strokeWidth: 2, stroke: '#3b82f6' },
          }}
          connectionLineStyle={{ strokeWidth: 2, stroke: '#3b82f6' }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          selectNodesOnDrag={false}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnScroll={false}
          preventScrolling={true}
          fitViewOptions={{
            padding: 0.2,
            includeHiddenNodes: false,
            minZoom: 0.1,
            maxZoom: 2,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          nodeOrigin={[0.5, 0.5]}
          nodesFocusable={true}
          autoConnect={false}
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
        >
          <Background color="#e2e8f0" gap={20} />
          
          {/* Simple Controls */}
          <Controls className="rounded-lg border shadow-lg backdrop-blur bg-white/80 border-gray-200/50" />
        </ReactFlow>
      </div>

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 border-b backdrop-blur-lg bg-white/80 border-gray-200/50 dark:bg-slate-800/80 dark:border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Easy USSD Builder
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Build phone menus without coding! 
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Flow Stats */}
          <div className="hidden items-center px-4 py-2 space-x-4 rounded-lg border md:flex bg-white/70 border-gray-200/50 dark:bg-slate-700/70 dark:border-slate-600/50">
            <div className="flex items-center space-x-1 text-sm">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{flowStats.totalMenus}</span>
              <span className="text-gray-500 dark:text-gray-400">menus</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <ArrowRight className="w-4 h-4 text-green-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{flowStats.totalConnections}</span>
              <span className="text-gray-500 dark:text-gray-400">connections</span>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => setShowTutorial(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
          >
            <HelpCircle className="mr-1 w-4 h-4" />
            Help
          </button>
          
          {/* Undo/Redo Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                historyIndex <= 0
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                historyIndex >= history.length - 1
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={saveFlow}
            className="flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-lg transition-colors hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
          >
            <Save className="mr-1 w-4 h-4" />
            Save
          </button>
          
          <button
            onClick={testFlow}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isTestMode 
                ? 'text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300' 
                : 'text-purple-600 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300'
            }`}
          >
            {isTestMode ? <CheckCircle className="mr-1 w-4 h-4" /> : <Play className="mr-1 w-4 h-4" />}
            {isTestMode ? 'Stop Test' : 'Test'}
          </button>

          <button
            onClick={() => setShowPhonePreview(!showPhonePreview)}
            className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg transition-colors hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
          >
            <Smartphone className="mr-1 w-4 h-4" />
            Preview
          </button>
        </div>
      </div>

      {/* Add Node Panel Overlay */}
      <div className="absolute top-20 left-4 z-10">
        <div className="flex flex-wrap gap-4 p-4 rounded-xl border shadow-xl backdrop-blur-lg bg-white/90 border-gray-200/50 dark:bg-slate-800/90 dark:border-slate-700/50">
          {/* Add Menu Button - Phone Screen Style */}
          <button
            onClick={addMenuNode}
            className="group relative flex flex-col items-center justify-center w-20 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1rem] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-blue-600 hover:to-indigo-700 phone-screen-button"
          >
            {/* Phone Frame */}
            <div className="absolute inset-1 bg-black rounded-[0.8rem] flex flex-col">
              {/* Status Bar */}
              <div className="flex justify-between items-center px-2 py-1">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full status-dot"></div>
                  <div className="w-1 h-1 bg-white rounded-full status-dot"></div>
                  <div className="w-1 h-1 bg-white rounded-full status-dot"></div>
                </div>
                <div className="w-3 h-1 bg-white rounded-sm"></div>
              </div>
              
              {/* Screen Content */}
              <div className="flex-1 flex flex-col items-center justify-center p-2">
                <MessageSquare className="w-4 h-4 text-white mb-1" />
                <div className="text-center">
                  <div className="w-6 h-1 bg-white rounded mb-1"></div>
                  <div className="w-4 h-1 bg-white/70 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Label */}
            <span className="absolute -bottom-6 text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
              Menu
            </span>
          </button>

          {/* Add Input Button - Phone Screen Style */}
          <button
            onClick={addInputNode}
            className="group relative flex flex-col items-center justify-center w-20 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-[1rem] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-green-600 hover:to-emerald-700 phone-screen-button"
          >
            {/* Phone Frame */}
            <div className="absolute inset-1 bg-black rounded-[0.8rem] flex flex-col">
              {/* Status Bar */}
              <div className="flex justify-between items-center px-2 py-1">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full status-dot"></div>
                  <div className="w-1 h-1 bg-white rounded-full status-dot"></div>
                  <div className="w-1 h-1 bg-white rounded-full status-dot"></div>
                </div>
                <div className="w-3 h-1 bg-white rounded-sm"></div>
              </div>
              
              {/* Screen Content */}
              <div className="flex-1 flex flex-col items-center justify-center p-2">
                <Hash className="w-4 h-4 text-white mb-1" />
                <div className="text-center">
                  <div className="w-5 h-1 bg-white rounded mb-1"></div>
                  <div className="w-3 h-1 bg-white/70 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Label */}
            <span className="absolute -bottom-6 text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 transition-colors">
              Input
            </span>
          </button>

          {/* Add End Button - Phone Screen Style */}
          <button
            onClick={addEndNode}
            className="group relative flex flex-col items-center justify-center w-20 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-[1rem] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-red-600 hover:to-pink-700 phone-screen-button"
          >
            {/* Phone Frame */}
            <div className="absolute inset-1 bg-black rounded-[0.8rem] flex flex-col">
              {/* Status Bar */}
              <div className="flex justify-between items-center px-2 py-1">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full status-dot"></div>
                  <div className="w-1 h-1 bg-white rounded-full status-dot"></div>
                  <div className="w-1 h-1 bg-white rounded-full status-dot"></div>
                </div>
                <div className="w-3 h-1 bg-white rounded-sm"></div>
              </div>
              
              {/* Screen Content */}
              <div className="flex-1 flex flex-col items-center justify-center p-2">
                <CheckCircle className="w-4 h-4 text-white mb-1" />
                <div className="text-center">
                  <div className="w-6 h-1 bg-white rounded mb-1"></div>
                  <div className="w-4 h-1 bg-white/70 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Label */}
            <span className="absolute -bottom-6 text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-red-600 transition-colors">
              End
            </span>
          </button>
        </div>
      </div>

      {/* Quick Start Panel Overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 max-w-md rounded-2xl border shadow-2xl backdrop-blur-lg bg-white/90 border-gray-200/50 dark:bg-slate-800/90 dark:border-slate-700/50"
          >
            <div className="flex justify-center mb-6">
              <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome! 👋
            </h2>
            
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Create your phone menu system in minutes. No coding required!
            </p>
            
            <div className="space-y-4">
              <button
                onClick={createStarterFlow}
                className="flex justify-center items-center px-4 py-3 w-full text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-xl"
              >
                <Star className="mr-2 w-4 h-4" />
                Create Sample Flow
              </button>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={addMenuNode}
                  className="group relative flex flex-col items-center justify-center w-16 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[0.8rem] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-blue-600 hover:to-indigo-700 phone-screen-button"
                >
                  {/* Phone Frame */}
                  <div className="absolute inset-1 bg-black rounded-[0.6rem] flex flex-col">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-1 py-0.5">
                      <div className="flex space-x-0.5">
                        <div className="w-0.5 h-0.5 bg-white rounded-full status-dot"></div>
                        <div className="w-0.5 h-0.5 bg-white rounded-full status-dot"></div>
                        <div className="w-0.5 h-0.5 bg-white rounded-full status-dot"></div>
                      </div>
                      <div className="w-2 h-0.5 bg-white rounded-sm"></div>
                    </div>
                    
                    {/* Screen Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-1">
                      <MessageSquare className="w-3 h-3 text-white mb-0.5" />
                      <div className="text-center">
                        <div className="w-4 h-0.5 bg-white rounded mb-0.5"></div>
                        <div className="w-3 h-0.5 bg-white/70 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <span className="absolute -bottom-5 text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                    Menu
                  </span>
                </button>

                <button
                  onClick={addInputNode}
                  className="group relative flex flex-col items-center justify-center w-16 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-[0.8rem] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-green-600 hover:to-emerald-700 phone-screen-button"
                >
                  {/* Phone Frame */}
                  <div className="absolute inset-1 bg-black rounded-[0.6rem] flex flex-col">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-1 py-0.5">
                      <div className="flex space-x-0.5">
                        <div className="w-0.5 h-0.5 bg-white rounded-full status-dot"></div>
                        <div className="w-0.5 h-0.5 bg-white rounded-full status-dot"></div>
                        <div className="w-0.5 h-0.5 bg-white rounded-full status-dot"></div>
                      </div>
                      <div className="w-2 h-0.5 bg-white rounded-sm"></div>
                    </div>
                    
                    {/* Screen Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-1">
                      <Hash className="w-3 h-3 text-white mb-0.5" />
                      <div className="text-center">
                        <div className="w-4 h-0.5 bg-white rounded mb-0.5"></div>
                        <div className="w-3 h-0.5 bg-white/70 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <span className="absolute -bottom-5 text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 transition-colors">
                    Input
                  </span>
                </button>

                <button
                  onClick={addEndNode}
                  className="group relative flex flex-col items-center justify-center w-16 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-[0.8rem] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-red-600 hover:to-pink-700 phone-screen-button"
                >
                  {/* Phone Frame */}
                  <div className="absolute inset-1 bg-black rounded-[0.6rem] flex flex-col">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-1 py-0.5">
                      <div className="flex space-x-0.5">
                        <div className="w-0.5 h-0.5 bg-white rounded-full status-dot"></div>
                        <div className="w-0.5 h-0.5 bg-white rounded-full status-dot"></div>
                        <div className="w-0.5 h-0.5 bg-white rounded-full status-dot"></div>
                      </div>
                      <div className="w-2 h-0.5 bg-white rounded-sm"></div>
                    </div>
                    
                    {/* Screen Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-1">
                      <CheckCircle className="w-3 h-3 text-white mb-0.5" />
                      <div className="text-center">
                        <div className="w-4 h-0.5 bg-white rounded mb-0.5"></div>
                        <div className="w-3 h-0.5 bg-white/70 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <span className="absolute -bottom-5 text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-red-600 transition-colors">
                    End
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Tips Overlay */}
      {nodes.length > 0 && nodes.length < 3 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center px-4 py-2 text-yellow-800 bg-yellow-100 rounded-lg border border-yellow-200 shadow-lg dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
          >
            <Lightbulb className="mr-2 w-4 h-4" />
            <span className="text-sm font-medium">
              💡 Tip: Drag from the dots to connect menus together!
            </span>
          </motion.div>
        </div>
      )}

      {/* Phone Preview Sidebar Overlay */}
      <AnimatePresence>
        {showPhonePreview && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 w-72 h-full border-l shadow-2xl backdrop-blur-lg bg-white/80 border-gray-200/50 dark:bg-slate-800/80 dark:border-slate-700/50 z-10"
          >
            <SimplePhonePreview 
              nodes={nodes}
              edges={edges}
              isTestMode={isTestMode}
              onClose={() => setShowPhonePreview(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Modal */}
      <QuickTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onCreateSample={createStarterFlow}
      />
    </div>
  );
};

export default SimpleUSSDBuilder;