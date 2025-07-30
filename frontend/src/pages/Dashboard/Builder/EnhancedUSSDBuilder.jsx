import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  Rocket,
  Settings,
  Eye,
  Home,
  Layers,
  Zap,
  Moon,
  Sun,
  Download,
  Upload,
  Users,
  HelpCircle,
  X,
  Smartphone,
  Maximize2,
  Minimize2,
} from "lucide-react";

// Import the enhanced components
import AdvancedCanvas from "./components/AdvancedCanvas";
import EnhancedPhonePreview from "./components/EnhancedPhonePreview";
import SettingsPanel from "./SettingsPanel";
import PreviewPanel from "./PreviewPanel";
import useUSSDBuilderStore, { selectMenuCount, selectConnectionCount } from "../../../store/ussdBuilderStore";

const EnhancedUSSDBuilder = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);

  const {
    project,
    canvas,
    ui,
    actions: {
      updateProject,
      loadProject,
      updateCanvas,
      toggleTheme,
      togglePhonePreview,
      addNotification,
      removeNotification,
      setLoading,
      exportProject,
      importProject,
    }
  } = useUSSDBuilderStore();

  // Get computed values using selectors
  const menuCount = useUSSDBuilderStore(selectMenuCount);
  const connectionCount = useUSSDBuilderStore(selectConnectionCount);

  // Initialize project
  useEffect(() => {
    // Simulate loading project data
    const loadProjectData = async () => {
      setLoading('saving', true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const projectData = {
          id: projectId,
          name: "Advanced Customer Service App",
          category: "customer-service",
          shortCode: "*123#",
          version: "2.0.0",
          lastModified: new Date().toISOString(),
          menus: {
            'main': {
              id: 'main',
              type: 'main',
              title: 'Welcome to Customer Service',
              position: { x: 100, y: 100 },
              options: [
                { key: '1', text: 'Technical Support', action: 'submenu', targetId: 'tech-support' },
                { key: '2', text: 'Billing Inquiries', action: 'submenu', targetId: 'billing' },
                { key: '3', text: 'Account Management', action: 'submenu', targetId: 'account' },
              ],
              metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            }
          },
          connections: {},
        };
        
        loadProject(projectData);
        
        addNotification({
          type: 'success',
          message: 'Project loaded successfully',
        });
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Failed to load project',
        });
      } finally {
        setLoading('saving', false);
      }
    };

    if (projectId) {
      loadProjectData();
    }
  }, [projectId, loadProject, addNotification, setLoading]);

  // Handle notifications
  useEffect(() => {
    ui.notifications.forEach(notification => {
      switch (notification.type) {
        case 'success':
          toast.success(notification.message, {
            duration: notification.duration || 4000,
            onTimeout: () => removeNotification(notification.id),
          });
          break;
        case 'error':
          toast.error(notification.message, {
            duration: notification.duration || 6000,
            onTimeout: () => removeNotification(notification.id),
          });
          break;
        case 'warning':
          toast(notification.message, {
            icon: '⚠️',
            duration: notification.duration || 5000,
            onTimeout: () => removeNotification(notification.id),
          });
          break;
        default:
          toast(notification.message, {
            duration: notification.duration || 4000,
            onTimeout: () => removeNotification(notification.id),
          });
      }
      
      // Remove notification after showing
      setTimeout(() => {
        removeNotification(notification.id);
      }, 100);
    });
  }, [ui.notifications, removeNotification]);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(async () => {
      if (menuCount > 0) {
        setLoading('saving', true);
        
        try {
          // Simulate auto-save
          await new Promise(resolve => setTimeout(resolve, 500));
          
          updateProject({
            lastModified: new Date().toISOString(),
          });
          
          // Silent notification for auto-save
          console.log('Auto-saved at', new Date().toLocaleTimeString());
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setLoading('saving', false);
        }
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, [menuCount, setLoading, updateProject]);



  // Action handlers
  const handleSave = useCallback(async () => {
    setLoading('saving', true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateProject({
        lastModified: new Date().toISOString(),
      });
      
      addNotification({
        type: 'success',
        message: 'Project saved successfully',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to save project',
      });
    } finally {
      setLoading('saving', false);
    }
  }, [setLoading, updateProject, addNotification]);

  const handlePublish = async () => {
    setLoading('publishing', true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateProject({
        status: 'published',
        publishedAt: new Date().toISOString(),
      });
      
      addNotification({
        type: 'success',
        message: 'Project published successfully! 🚀',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to publish project',
      });
    } finally {
      setLoading('publishing', false);
    }
  };

  const handleExport = useCallback(() => {
    try {
      const projectData = exportProject();
      const blob = new Blob([JSON.stringify(projectData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '-')}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addNotification({
        type: 'success',
        message: 'Project exported successfully',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to export project',
      });
    }
  }, [exportProject, project.name, addNotification]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
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
              message: 'Invalid project file format',
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [importProject, addNotification]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'e':
            e.preventDefault();
            handleExport();
            break;
          case 'i':
            e.preventDefault();
            handleImport();
            break;
          case '`':
            e.preventDefault();
            toggleTheme();
            break;
          default:
            // No action for other keys
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [toggleTheme, handleSave, handleExport, handleImport]);

  const viewModes = [
    { id: 'builder', name: 'Builder', icon: Home, description: 'Design your USSD flow' },
    { id: 'preview', name: 'Preview', icon: Eye, description: 'Test your application' },
    { id: 'settings', name: 'Settings', icon: Settings, description: 'Configure project settings' },
    { id: 'flow-chart', name: 'Flow Chart', icon: Layers, description: 'Visualize flow structure' },
  ];



  return (
    <div className={`h-screen overflow-hidden transition-colors duration-300 ${
      ui.theme === 'dark' ? 'dark bg-slate-900' : 'bg-gray-50'
    } ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      
      {/* Enhanced Navigation Bar */}
      <div className="sticky top-0 z-40 border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95 dark:bg-slate-800/95 dark:border-slate-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            
            {/* Left Section - Back & Project Info */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard/projects')}
                className="p-2 text-gray-500 rounded-lg transition-colors duration-200 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                    {project.name}
                  </h1>
                  {project.status === 'published' && (
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                      Published
                    </span>
                  )}
                  {ui.loading.saving && (
                    <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                      <span>Saving...</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-slate-400">
                  <span>USSD: {project.shortCode}</span>
                  <span>•</span>
                  <span>{menuCount} menus</span>
                  <span>•</span>
                  <span>{connectionCount} connections</span>
                  <span>•</span>
                  <span>v{project.version}</span>
                </div>
              </div>
            </div>

            {/* Center - View Mode Selector */}
            <div className="flex items-center p-1 bg-gray-100 rounded-xl dark:bg-slate-700">
              {viewModes.map((mode) => {
                const IconComponent = mode.icon;
                const isActive = canvas.viewMode === mode.id;
                
                return (
                  <motion.button
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateCanvas({ viewMode: mode.id })}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-emerald-600 bg-white shadow-sm dark:bg-slate-600 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100'
                    }`}
                    title={mode.description}
                  >
                    <IconComponent className="mr-2 w-4 h-4" />
                    {mode.name}
                  </motion.button>
                );
              })}
            </div>

            {/* Right Section - Actions & Tools */}
            <div className="flex items-center space-x-2">
              
              {/* Collaboration */}
              <div className="relative">
                <button
                  onClick={() => setShowCollaborators(!showCollaborators)}
                  className="flex items-center px-3 py-2 space-x-2 text-gray-600 rounded-lg transition-colors dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">2</span>
                </button>
                
                <AnimatePresence>
                  {showCollaborators && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-12 p-4 w-64 bg-white rounded-xl border border-gray-200 shadow-xl dark:bg-slate-800 dark:border-slate-700"
                    >
                      <h3 className="mb-3 font-semibold text-gray-900 dark:text-slate-100">
                        Collaborators
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex justify-center items-center w-8 h-8 text-sm font-medium text-white bg-emerald-500 rounded-full">
                            A
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                              You
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              Owner • Online
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex justify-center items-center w-8 h-8 text-sm font-medium text-white bg-blue-500 rounded-full">
                            B
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                              Bob Designer
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                              Editor • 2m ago
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tools */}
              <div className="flex items-center p-1 space-x-1 bg-gray-100 rounded-lg dark:bg-slate-700">
                
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md transition-colors hover:bg-white dark:hover:bg-slate-600"
                  title="Toggle theme"
                >
                  {ui.theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {/* Fullscreen */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-md transition-colors hover:bg-white dark:hover:bg-slate-600"
                  title="Toggle fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>

                {/* Help */}
                <button
                  className="p-2 rounded-md transition-colors hover:bg-white dark:hover:bg-slate-600"
                  title="Help & Documentation"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              {/* Import/Export */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleImport}
                  className="p-2 text-gray-600 rounded-lg transition-colors dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  title="Import project"
                >
                  <Upload className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleExport}
                  className="p-2 text-gray-600 rounded-lg transition-colors dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  title="Export project"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Actions */}
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={ui.loading.saving}
                  className="flex items-center px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg transition-all duration-200 dark:text-slate-200 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50"
                >
                  <Save className="mr-2 w-4 h-4" />
                  {ui.loading.saving ? 'Saving...' : 'Save'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePublish}
                  disabled={ui.loading.publishing}
                  className="flex items-center px-4 py-2 font-medium text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg shadow-lg transition-all duration-200 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50"
                >
                  {ui.loading.publishing ? (
                    <>
                      <Zap className="mr-2 w-4 h-4 animate-pulse" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 w-4 h-4" />
                      Publish
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-89px)] relative">
        
        {/* Primary Content Area - Full Viewport */}
        <div className="relative flex-1">
          <AnimatePresence mode="wait">
            {canvas.viewMode === 'builder' && (
              <motion.div
                key="builder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <AdvancedCanvas />
              </motion.div>
            )}
            
            {canvas.viewMode === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <PreviewPanel project={project} />
              </motion.div>
            )}
            
            {canvas.viewMode === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <SettingsPanel project={project} />
              </motion.div>
            )}
            
            {canvas.viewMode === 'flow-chart' && (
              <motion.div
                key="flow-chart"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center items-center h-full"
              >
                <div className="text-center">
                  <Layers className="mx-auto mb-4 w-16 h-16 text-gray-400 dark:text-slate-500" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Flow Chart View
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400">
                    Advanced flow visualization coming soon
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sliding Phone Preview */}
        <AnimatePresence>
          {ui.phonePreviewVisible && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 backdrop-blur-sm z-35 bg-black/20 lg:hidden"
                onClick={() => togglePhonePreview()}
              />
              
              {/* Sliding Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ 
                  type: 'spring', 
                  damping: 25, 
                  stiffness: 200,
                  mass: 1.2
                }}
                className="absolute top-0 right-0 z-40 w-80 h-[calc(100vh-89px)] border-l shadow-2xl backdrop-blur-xl sm:w-96 bg-white/95 border-gray-200/50 dark:bg-slate-800/95 dark:border-slate-700/50"
              >
                {/* Header with Close Button */}
                <div className="flex justify-between items-center p-4 border-b backdrop-blur-sm border-gray-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Phone Preview
                  </h3>
                  <button
                    onClick={() => togglePhonePreview()}
                    className="flex justify-center items-center w-8 h-8 rounded-lg transition-colors text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                    title="Close Preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Phone Preview Content */}
                <div className="overflow-y-auto px-4 pt-4 pb-6 h-[calc(100%-4rem)]">
                  <EnhancedPhonePreview />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating Phone Preview Toggle Button */}
        {!ui.phonePreviewVisible && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => togglePhonePreview()}
            className="flex absolute top-6 right-6 z-30 justify-center items-center w-14 h-14 text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl"
            title="Open Phone Preview"
          >
            <Smartphone className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: ui.theme === 'dark' ? '#1e293b' : '#ffffff',
            color: ui.theme === 'dark' ? '#f1f5f9' : '#1e293b',
            border: `1px solid ${ui.theme === 'dark' ? '#334155' : '#e2e8f0'}`,
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Loading Overlay for Publishing */}
      <AnimatePresence>
        {ui.loading.publishing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-black/50"
          >
            <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-2xl dark:bg-slate-800 dark:border-slate-700">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                >
                  <Rocket className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Publishing Your USSD App
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  Please wait while we deploy your application...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedUSSDBuilder;