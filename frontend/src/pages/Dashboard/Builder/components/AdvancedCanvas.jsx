import React, { useRef, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3X3, 
  Eye, 
  EyeOff,
  Undo,
  Redo,
  Save,
  Download,
  Upload,
  Search,
  Filter,
  Lightbulb
} from 'lucide-react';
import useUSSDBuilderStore, { selectCanUndo, selectCanRedo } from '../../../../store/ussdBuilderStore';
import DraggableMenuCard from './DraggableMenuCard';
import ConnectionLine from './ConnectionLine';

import MenuCreationModal from './MenuCreationModal';
import FlowValidationPanel from './FlowValidationPanel';
import OptionConnectionModal from './OptionConnectionModal';
import USSDFlowGuide from './USSDFlowGuide';

const AdvancedCanvas = () => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showMenuCreation, setShowMenuCreation] = useState(false);
  const [menuCreationPosition, setMenuCreationPosition] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [connectionMode, setConnectionMode] = useState({ active: false, sourceMenuId: null });
  const [showOptionConnections, setShowOptionConnections] = useState(false);
  const [selectedMenuForOptions, setSelectedMenuForOptions] = useState(null);
  const [showFlowGuide, setShowFlowGuide] = useState(false);

  const {
    canvas,
    menus,
    connections,
    // menuOrder,
    ui,
    actions: {
      updateCanvas,
      setZoom,
      setPan,
      selectMenu,
      addMenu,
      duplicateMenu,
      deleteMenu,
      addConnection,
      addOptionConnection,
      undo,
      redo,
      addNotification,
      validateFlow,
      exportProject,
      importProject,
    }
  } = useUSSDBuilderStore();

  // Get computed values using selectors
  const canUndo = useUSSDBuilderStore(selectCanUndo);
  const canRedo = useUSSDBuilderStore(selectCanRedo);

  // Canvas pan and zoom handlers
  const handleMouseDown = useCallback((e) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX - canvas.pan.x, 
        y: e.clientY - canvas.pan.y 
      });
      selectMenu(null);
    }
  }, [canvas.pan, selectMenu]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, setPan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(canvas.zoom + delta);
  }, [canvas.zoom, setZoom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'n':
            e.preventDefault();
            handleAddMenu({ x: 200, y: 200 });
            break;
          case 'd':
            e.preventDefault();
            if (canvas.selectedMenuId) {
              duplicateMenu(canvas.selectedMenuId);
            }
            break;
          case 'Delete':
          case 'Backspace':
            if (canvas.selectedMenuId) {
              deleteMenu(canvas.selectedMenuId);
            }
            break;
            default:
              break;
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undo, redo, canvas.selectedMenuId]);

  // Canvas event handlers
  const handleCanvasRightClick = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.pan.x) / canvas.zoom;
    const y = (e.clientY - rect.top - canvas.pan.y) / canvas.zoom;
    
    setMenuCreationPosition({ x, y });
    setShowMenuCreation(true);
  }, [canvas.pan, canvas.zoom]);

  const handleAddMenu = useCallback((position) => {
    setMenuCreationPosition(position);
    setShowMenuCreation(true);
  }, []);

  const handleCreateMenu = useCallback((menuData) => {
    addMenu({
      ...menuData,
      position: menuCreationPosition,
      id: `menu-${Date.now()}`,
    });
    setShowMenuCreation(false);
    addNotification({
      type: 'success',
      message: `${menuData.type} menu created successfully`,
    });
  }, [menuCreationPosition, addMenu, addNotification]);

  const handleSave = useCallback(async () => {
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      addNotification({
        type: 'success',
        message: 'Project saved successfully',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to save project',
      });
    }
  }, [addNotification]);

  const handleExport = useCallback(() => {
    const projectData = exportProject();
    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectData.project.name.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addNotification({
      type: 'success',
      message: 'Project exported successfully',
    });
  }, [exportProject, addNotification]);

  const handleImport = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const projectData = JSON.parse(event.target.result);
          importProject(projectData);
        } catch (error) {
          addNotification({
            type: 'error',
            message: 'Failed to import project: Invalid file format',
          });
        }
      };
      reader.readAsText(file);
    }
  }, [importProject, addNotification]);

  const handleValidation = useCallback(() => {
    const validation = validateFlow();
    setShowValidation(true);
    
    if (validation.errors.length === 0 && validation.warnings.length === 0) {
      addNotification({
        type: 'success',
        message: 'Flow validation passed: No issues found',
      });
    } else {
      addNotification({
        type: validation.errors.length > 0 ? 'error' : 'warning',
        message: `Found ${validation.errors.length} errors and ${validation.warnings.length} warnings`,
      });
    }
  }, [validateFlow, addNotification]);

  const handleShowOptionConnections = useCallback((menu) => {
    setSelectedMenuForOptions(menu);
    setShowOptionConnections(true);
  }, []);

  const handleCreateOptionConnection = useCallback((sourceMenuId, targetMenuId, optionKey, optionLabel) => {
    addOptionConnection(sourceMenuId, targetMenuId, optionKey, optionLabel);
  }, [addOptionConnection]);

  // Test connection function
  const handleTestConnection = useCallback(() => {
    const menuIds = Object.keys(menus);
    if (menuIds.length >= 2) {
      addConnection(menuIds[0], menuIds[1], { type: 'flow', label: 'Test Connection' });
      addNotification({
        type: 'success',
        message: 'Test connection created',
      });
    }
  }, [menus, addConnection, addNotification]);

  // Filter menus based on search
  const filteredMenus = Object.values(menus).filter(menu =>
    menu.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    menu.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-full">
      {/* Advanced Toolbar */}
      <div className="flex absolute top-6 left-6 z-30 items-center space-x-3">
        <div className="flex items-center p-2 space-x-2 rounded-xl border shadow-2xl backdrop-blur-lg bg-white/95 dark:bg-slate-800/95 border-slate-200/50 dark:border-slate-700/50">
          {/* Undo/Redo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={undo}
            disabled={!canUndo}
            className="p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={redo}
            disabled={!canRedo}
            className="p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </motion.button>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

          {/* Zoom Controls */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setZoom(canvas.zoom - 0.1)}
            className="p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </motion.button>

          <span className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded min-w-[50px] text-center">
            {Math.round(canvas.zoom * 100)}%
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setZoom(canvas.zoom + 0.1)}
            className="p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Reset View"
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

          {/* Grid Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateCanvas({ snapToGrid: !canvas.snapToGrid })}
            className={`p-2 rounded-md transition-colors ${
              canvas.snapToGrid ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Toggle Grid Snap"
          >
            <Grid3X3 className="w-4 h-4" />
          </motion.button>

          {/* Connections Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateCanvas({ showConnections: !ui.showConnections })}
            className={`p-2 rounded-md transition-colors ${
              ui.showConnections ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Toggle Connections"
          >
            {ui.showConnections ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </motion.button>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

          {/* Add Menu Button - More Prominent */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAddMenu({ x: 200, y: 200 })}
            className="p-2 text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-md shadow-lg transition-all duration-200 hover:from-emerald-600 hover:to-cyan-600 hover:shadow-xl"
            title="Add Menu (Ctrl+N)"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFlowGuide(true)}
            className="p-2 text-slate-600 bg-white/90 hover:bg-white rounded-md transition-all duration-200 shadow-lg hover:shadow-xl dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-slate-800"
            title="USSD Flow Guide & Best Practices"
          >
            <Lightbulb className="w-4 h-4" />
          </motion.button>

          {/* Test Connection Button (for development) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTestConnection}
              className="p-2 text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
              title="Create Test Connection"
            >
              <Filter className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search menus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-2 pr-4 pl-9 w-48 text-sm rounded-lg border backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Connection Mode Indicator */}
        {connectionMode.active && (
          <div className="flex items-center px-3 py-2 space-x-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg dark:bg-purple-900 dark:text-purple-300">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span>Connection Mode Active</span>
          </div>
        )}
      </div>

      {/* Secondary Toolbar */}
      <div className="flex absolute top-6 right-6 z-30 items-center space-x-3">
        <div className="flex items-center p-2 space-x-2 rounded-xl border shadow-2xl backdrop-blur-lg bg-white/95 dark:bg-slate-800/95 border-slate-200/50 dark:border-slate-700/50">
          {/* Validation */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleValidation}
            className="p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Validate Flow"
          >
            <Filter className="w-4 h-4" />
          </motion.button>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

          {/* Save */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="p-2 text-emerald-600 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </motion.button>

          {/* Export */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Export Project"
          >
            <Download className="w-4 h-4" />
          </motion.button>

          {/* Import */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Import Project"
            >
              <Upload className="w-4 h-4" />
            </motion.div>
          </label>
        </div>
      </div>

      {/* Canvas - Full Viewport with White Background */}
      <div
        ref={canvasRef}
        data-canvas="true"
        className="overflow-hidden absolute inset-0 w-full h-full bg-white cursor-move select-none dark:bg-slate-900"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={handleCanvasRightClick}
      >
        {/* Subtle Grid Background */}
        <div
          className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)
            `,
            backgroundSize: `${canvas.gridSize}px ${canvas.gridSize}px`,
            transform: `translate(${canvas.pan.x % canvas.gridSize}px, ${canvas.pan.y % canvas.gridSize}px)`,
          }}
        />

        {/* Canvas Content */}
        <div
          className="relative w-full h-full"
          style={{
            transform: `translate(${canvas.pan.x}px, ${canvas.pan.y}px) scale(${canvas.zoom})`,
            transformOrigin: '0 0',
            width: '4000px',
            height: '3000px',
          }}
        >
          {/* Connection Lines */}
          <AnimatePresence>
            {ui.showConnections && Object.values(connections).map(connection => {
              const sourceMenu = menus[connection.source];
              const targetMenu = menus[connection.target];
              
              if (!sourceMenu || !targetMenu) return null;
              
              return (
                <ConnectionLine
                  key={connection.id}
                  connection={connection}
                  sourceMenu={sourceMenu}
                  targetMenu={targetMenu}
                />
              );
            })}
          </AnimatePresence>

          {/* Menu Cards */}
          <AnimatePresence>
            {filteredMenus.map(menu => (
              <DraggableMenuCard
                key={menu.id}
                menu={menu}
                isSelected={canvas.selectedMenuId === menu.id}
                searchQuery={searchQuery}
                connectionMode={connectionMode}
                onStartConnection={(menuId) => setConnectionMode({ active: true, sourceMenuId: menuId })}
                onConnect={(targetMenuId) => {
                  if (connectionMode.active && connectionMode.sourceMenuId) {
                    addConnection(connectionMode.sourceMenuId, targetMenuId);
                    setConnectionMode({ active: false, sourceMenuId: null });
                    addNotification({
                      type: 'success',
                      message: 'Connection created successfully',
                    });
                  }
                }}
                onCancelConnection={() => setConnectionMode({ active: false, sourceMenuId: null })}
                onShowOptionConnections={handleShowOptionConnections}
              />
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {Object.keys(menus).length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/2 left-1/2 text-center transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="p-8 rounded-2xl border shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
                <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Start Building Your USSD App
                </h3>
                <p className="mb-6 max-w-md text-slate-600 dark:text-slate-400">
                  Right-click on the canvas to create your first menu, or use the shortcuts to get started quickly.
                </p>
                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div>Right-click empty space: Create menu</div>
                  <div>Right-click node: Start connection</div>
                  <div>Ctrl+N: New menu | Ctrl+Z: Undo</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Menu Creation Modal */}
      <MenuCreationModal
        isOpen={showMenuCreation}
        onClose={() => setShowMenuCreation(false)}
        onCreate={handleCreateMenu}
        position={menuCreationPosition}
      />

      {/* Status Bar */}
      <div className="flex absolute bottom-4 left-4 z-30 items-center px-3 py-2 space-x-4 text-xs rounded-lg border backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
        <span>{Object.keys(menus).length} menus</span>
        <span>•</span>
        <span>{Object.keys(connections).length} connections</span>
        <span>•</span>
        <span>Zoom: {Math.round(canvas.zoom * 100)}%</span>
      </div>

      {/* Flow Validation Panel */}
      <FlowValidationPanel
        isOpen={showValidation}
        onClose={() => setShowValidation(false)}
      />

      {/* Option Connection Modal */}
      <OptionConnectionModal
        isOpen={showOptionConnections}
        onClose={() => {
          setShowOptionConnections(false);
          setSelectedMenuForOptions(null);
        }}
        sourceMenu={selectedMenuForOptions}
        targetMenus={Object.values(menus)}
        onCreateConnection={handleCreateOptionConnection}
      />

      {/* USSD Flow Guide */}
      <USSDFlowGuide
        isOpen={showFlowGuide}
        onClose={() => setShowFlowGuide(false)}
      />
    </div>
  );
};

export default AdvancedCanvas;