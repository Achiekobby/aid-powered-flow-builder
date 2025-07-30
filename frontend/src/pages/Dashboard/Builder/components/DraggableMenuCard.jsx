import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Edit3, 
  Trash2, 
  Copy, 
  Link, 
  ArrowRight, 
  Phone, 
  Terminal, 
  CheckCircle,
  AlertCircle,
  Hash,
  Type,
  Mail,
  Calculator,
  Target,
  GitBranch
} from 'lucide-react';
import useUSSDBuilderStore from '../../../../store/ussdBuilderStore';

const DraggableMenuCard = ({ 
  menu, 
  isSelected, 
  searchQuery = '', 
  connectionMode = { active: false, sourceMenuId: null },
  onStartConnection,
  onConnect,
  onCancelConnection,
  onShowOptionConnections
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showActions, setShowActions] = useState(false);

  const cardRef = useRef(null);

  const {
    canvas,
    connections,
    actions: {
      updateMenu,
      deleteMenu,
      duplicateMenu,
      selectMenu,
      addNotification,
    }
  } = useUSSDBuilderStore();

  // Get option connections for this menu
  const getOptionConnections = () => {
    return Object.values(connections).filter(conn => 
      conn.source === menu.id && conn.type === 'option'
    );
  };

  const optionConnections = getOptionConnections();

  // Menu type configurations
  const menuTypeConfig = {
    main: {
      icon: Phone,
      color: 'from-emerald-500 to-cyan-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      textColor: 'text-emerald-800 dark:text-emerald-200',
      label: 'Main Menu'
    },
    sub: {
      icon: Menu,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-800 dark:text-blue-200',
      label: 'Sub Menu'
    },
    input: {
      icon: Terminal,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-800 dark:text-purple-200',
      label: 'Input Menu'
    },
    end: {
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-800 dark:text-green-200',
      label: 'End Menu'
    },
    conditional: {
      icon: AlertCircle,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-800 dark:text-orange-200',
      label: 'Conditional Menu'
    }
  };

  const config = menuTypeConfig[menu.type] || menuTypeConfig.sub;
  const IconComponent = config.icon;

  // Input type icons
  const getInputTypeIcon = (inputType) => {
    switch (inputType) {
      case 'number': return Calculator;
      case 'phone': return Phone;
      case 'email': return Mail;
      case 'text': 
      default: return Type;
    }
  };

  // Drag handlers
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Only left click
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.zoom;
    const y = (e.clientY - rect.top) / canvas.zoom;
    
    setDragOffset({ x, y });
    setIsDragging(true);
    selectMenu(menu.id);
    
    e.stopPropagation();
  }, [canvas.zoom, menu.id, selectMenu]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const canvasRect = document.querySelector('[data-canvas="true"]')?.getBoundingClientRect();
    if (!canvasRect) return;

    let newX = (e.clientX - canvasRect.left - canvas.pan.x) / canvas.zoom - dragOffset.x;
    let newY = (e.clientY - canvasRect.top - canvas.pan.y) / canvas.zoom - dragOffset.y;

    // Snap to grid if enabled
    if (canvas.snapToGrid) {
      newX = Math.round(newX / canvas.gridSize) * canvas.gridSize;
      newY = Math.round(newY / canvas.gridSize) * canvas.gridSize;
    }

    updateMenu(menu.id, {
      position: { x: Math.max(0, newX), y: Math.max(0, newY) }
    });
  }, [isDragging, canvas, dragOffset, menu.id, updateMenu]);

  const handleMouseUp = useCallback((e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      addNotification({
        type: 'info',
        message: `Moved ${menu.title}`,
        duration: 2000,
      });
    }
  }, [isDragging, menu.title, addNotification]);

  // Attach global mouse events when dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Action handlers
  const handleEdit = () => {
    // This would open the edit modal
    setShowActions(false);
  };

  const handleDelete = () => {
    // Only prevent deletion of the original main menu (usually first created)
    if (menu.type === 'main' && menu.id === 'main-menu') {
      addNotification({
        type: 'error',
        message: 'Cannot delete the original main menu',
      });
      return;
    }
    
    deleteMenu(menu.id);
    addNotification({
      type: 'success',
      message: `Deleted ${menu.title}`,
    });
    setShowActions(false);
  };

  const handleDuplicate = () => {
    duplicateMenu(menu.id);
    addNotification({
      type: 'success',
      message: `Duplicated ${menu.title}`,
    });
    setShowActions(false);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (connectionMode.active) {
      // Cancel connection mode
      onCancelConnection?.();
    } else {
      // Start connection mode from this node
      onStartConnection?.(menu.id);
    }
    selectMenu(menu.id);
  };

  const handleClick = (e) => {
    if (connectionMode.active && connectionMode.sourceMenuId !== menu.id) {
      // Complete connection to this node
      e.preventDefault();
      e.stopPropagation();
      onConnect?.(menu.id);
    }
  };



  // Highlight search matches
  const highlightText = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="px-1 bg-yellow-200 rounded dark:bg-yellow-800">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      className={`absolute select-none transition-all duration-200 ${
        isDragging ? 'z-50 shadow-2xl cursor-grabbing' : 'z-10 shadow-lg hover:shadow-xl cursor-grab'
      } ${
        isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''}`}
      style={{
        left: menu.position.x,
        top: menu.position.y,
        width: '320px',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => !isDragging && setShowActions(false)}
    >
      {/* Card */}
      <div className="overflow-hidden bg-white rounded-xl border-2 backdrop-blur-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${config.color} p-4 text-white`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg backdrop-blur-sm bg-white/20">
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight">
                  {highlightText(menu.title, searchQuery)}
                </h3>
                <p className="text-xs opacity-90">{config.label}</p>
              </div>
            </div>
            
            {/* Menu Badge */}
            <div className="flex items-center space-x-2">
              {menu.type === 'main' && (
                <div className="px-2 py-1 text-xs font-medium rounded-full bg-white/20">
                  MAIN
                </div>
              )}
              {menu.validation?.length > 0 && (
                <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Has validation rules" />
              )}
            </div>
          </div>

          {/* Quick Actions - Appears on hover */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex absolute top-2 right-2 items-center space-x-1"
              >
                <button
                  onClick={handleEdit}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Edit menu"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDuplicate}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Duplicate menu"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onStartConnection?.(menu.id)}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Create connection"
                >
                  <Link className="w-3.5 h-3.5" />
                </button>
                {(menu.options && menu.options.length > 0) && (
                  <button
                    onClick={() => onShowOptionConnections?.(menu)}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    title="Configure option routing"
                  >
                    <Target className="w-3.5 h-3.5" />
                  </button>
                )}
                {menu.type !== 'main' && (
                  <button
                    onClick={handleDelete}
                    className="p-1.5 bg-red-500/50 hover:bg-red-500/70 rounded-lg transition-colors"
                    title="Delete menu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4">
          {menu.type === 'input' ? (
            /* Input Menu Content */
            <div className={`p-4 ${config.bgColor} ${config.borderColor} border rounded-lg`}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  {React.createElement(getInputTypeIcon(menu.inputType), {
                    className: `w-4 h-4 ${config.textColor}`
                  })}
                  <span className={`text-sm font-medium ${config.textColor}`}>
                    {menu.inputType || 'Text'} Input
                  </span>
                </div>
                {menu.required && (
                  <span className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded-full">
                    Required
                  </span>
                )}
              </div>
              <p className={`text-xs ${config.textColor} opacity-75`}>
                Collects user input: {menu.variableName || `input_${menu.id.slice(-4)}`}
              </p>
              {menu.validation?.length > 0 && (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  <Hash className="inline mr-1 w-3 h-3" />
                  {menu.validation.length} validation rule{menu.validation.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ) : menu.type === 'end' ? (
            /* End Menu Content */
            <div className={`p-4 ${config.bgColor} ${config.borderColor} border rounded-lg text-center`}>
              <CheckCircle className={`w-8 h-8 ${config.textColor} mx-auto mb-2`} />
              <p className={`text-sm font-medium ${config.textColor}`}>
                Session Ends
              </p>
              <p className={`text-xs ${config.textColor} opacity-75`}>
                Final message displayed to user
              </p>
            </div>
          ) : menu.type === 'conditional' ? (
            /* Conditional Menu Content */
            <div className={`p-4 ${config.bgColor} ${config.borderColor} border rounded-lg`}>
              <div className="flex items-center mb-2 space-x-2">
                <AlertCircle className={`w-4 h-4 ${config.textColor}`} />
                <span className={`text-sm font-medium ${config.textColor}`}>
                  Conditional Logic
                </span>
              </div>
              <p className={`text-xs ${config.textColor} opacity-75`}>
                Routes based on: {menu.condition?.variable || 'user_input'}
              </p>
              <div className="mt-2 text-xs text-slate-500">
                {menu.condition?.rules?.length || 0} condition{menu.condition?.rules?.length !== 1 ? 's' : ''}
              </div>
            </div>
          ) : (
            /* Regular Menu Options */
            <div className="space-y-2">
              {menu.options && menu.options.length > 0 ? (
                menu.options.slice(0, 4).map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                      option.key === '0' 
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        : 'bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold min-w-[16px] ${
                        option.key === '0' ? 'text-red-600' : 'text-emerald-600'
                      }`}>
                        {option.key}.
                      </span>
                      <span className={`${
                        option.key === '0' ? 'text-red-800 dark:text-red-200' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {highlightText(option.text, searchQuery)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {(() => {
                        const connection = optionConnections.find(conn => conn.optionKey === option.key);
                        if (connection) {
                          return (
                            <div className="flex items-center space-x-1" title="Connected to target menu">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                              <GitBranch className="w-3 h-3 text-emerald-500" />
                            </div>
                          );
                        } else {
                          return (
                            <div className="flex items-center space-x-1" title="Not connected">
                              <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full opacity-50" />
                              <ArrowRight className={`w-3 h-3 ${
                                option.key === '0' ? 'text-red-400' : 'text-slate-400'
                              }`} />
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-6 text-center text-slate-500 dark:text-slate-400">
                  <Menu className="mx-auto mb-2 w-6 h-6 opacity-50" />
                  <p className="text-xs">No options configured</p>
                  <button 
                    onClick={handleEdit}
                    className="mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Add options
                  </button>
                </div>
              )}
              
              {menu.options && menu.options.length > 4 && (
                <div className="py-2 text-xs text-center rounded-lg text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700">
                  +{menu.options.length - 4} more options
                </div>
              )}
            </div>
          )}
        </div>

        {/* Connection Points */}
        <div className="flex absolute -right-3 top-1/2 justify-center items-center w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg transform -translate-y-1/2">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        
        {menu.type !== 'main' && (
          <div className="flex absolute -left-3 top-1/2 justify-center items-center w-6 h-6 rounded-full border-4 border-white shadow-lg transform -translate-y-1/2 bg-slate-400">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex absolute top-2 left-2 items-center space-x-1">
          {isDragging && (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          )}
          {isSelected && (
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          )}
          {connectionMode.active && connectionMode.sourceMenuId === menu.id && (
            <div className="px-2 py-1 text-xs font-medium text-white bg-purple-500 rounded-full animate-pulse">
              Connect Mode
            </div>
          )}
        </div>

        {/* Connection Mode Overlays */}
        {connectionMode.active && connectionMode.sourceMenuId === menu.id && (
          <div className="absolute inset-0 rounded-xl border-2 border-purple-500 border-dashed backdrop-blur-sm bg-purple-500/10">
            <div className="flex justify-center items-center h-full">
              <div className="px-3 py-2 text-sm font-medium text-purple-700 bg-white rounded-lg shadow-lg dark:bg-slate-800 dark:text-purple-300">
                Click on another node to connect
              </div>
            </div>
          </div>
        )}
        
        {connectionMode.active && connectionMode.sourceMenuId !== menu.id && (
          <div className="absolute inset-0 rounded-xl border-2 border-green-500 border-dashed backdrop-blur-sm bg-green-500/10">
            <div className="flex justify-center items-center h-full">
              <div className="px-3 py-2 text-sm font-medium text-green-700 bg-white rounded-lg shadow-lg dark:bg-slate-800 dark:text-green-300">
                Click to connect here
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DraggableMenuCard;