import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  AlertCircle,
  Search,
  RefreshCw,
  Download,
  Zap,
  Clock,
  Target
} from 'lucide-react';
import useUSSDBuilderStore from '../../../../store/ussdBuilderStore';

const FlowValidationPanel = ({ isOpen, onClose }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const {
    menus,
    connections,
    actions: { validateFlow, selectMenu, addNotification }
  } = useUSSDBuilderStore();

  // Run validation
  const validation = useMemo(() => {
    return validateFlow();
  }, [validateFlow]);

  // Auto-refresh validation
  useEffect(() => {
    if (autoRefresh && isOpen) {
      const interval = setInterval(() => {
        validateFlow();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isOpen, validateFlow]);

  // Enhanced validation with more checks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const enhancedValidation = useMemo(() => {
    const errors = [...validation.errors];
    const warnings = [...validation.warnings];
    const suggestions = [];
    const performance = [];

    // Additional validation checks
    Object.values(menus).forEach(menu => {
      // Check for empty menus
      if ((menu.type === 'main' || menu.type === 'sub') && (!menu.options || menu.options.length === 0)) {
        warnings.push({
          type: 'empty_menu',
          menuId: menu.id,
          message: `Menu "${menu.title}" has no options`,
          severity: 'medium',
        });
      }

      // Check for very long titles
      if (menu.title.length > 50) {
        suggestions.push({
          type: 'long_title',
          menuId: menu.id,
          message: `Menu title "${menu.title}" is quite long (${menu.title.length} chars). Consider shortening for better UX.`,
          severity: 'low',
        });
      }

      // Check for missing input validation
      if (menu.type === 'input' && (!menu.validation || menu.validation.length === 0)) {
        suggestions.push({
          type: 'missing_validation',
          menuId: menu.id,
          message: `Input menu "${menu.title}" has no validation rules`,
          severity: 'medium',
        });
      }

      // Check for duplicate option keys
      if (menu.options) {
        const keys = menu.options.map(opt => opt.key);
        const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
        if (duplicates.length > 0) {
          errors.push({
            type: 'duplicate_keys',
            menuId: menu.id,
            message: `Menu "${menu.title}" has duplicate option keys: ${duplicates.join(', ')}`,
            severity: 'high',
          });
        }
      }

      // Performance checks
      if (menu.options && menu.options.length > 9) {
        performance.push({
          type: 'too_many_options',
          menuId: menu.id,
          message: `Menu "${menu.title}" has ${menu.options.length} options. Consider grouping into sub-menus.`,
          severity: 'medium',
          impact: 'User experience may suffer with too many options',
        });
      }
    });

    // Check for unreachable menus
    const reachableMenus = new Set(['main']);
    const queue = ['main'];
    
    while (queue.length > 0) {
      const currentMenuId = queue.shift();
      const currentMenu = menus[currentMenuId];
      
      if (currentMenu && currentMenu.options) {
        currentMenu.options.forEach(option => {
          if (option.targetId && !reachableMenus.has(option.targetId)) {
            reachableMenus.add(option.targetId);
            queue.push(option.targetId);
          }
        });
      }
    }

    Object.keys(menus).forEach(menuId => {
      if (menuId !== 'main' && !reachableMenus.has(menuId)) {
        warnings.push({
          type: 'unreachable_menu',
          menuId: menuId,
          message: `Menu "${menus[menuId].title}" is not reachable from the main menu`,
          severity: 'high',
        });
      }
    });

    // Check for circular references
    const visited = new Set();
    const recursionStack = new Set();
    
    const detectCycle = (menuId) => {
      if (recursionStack.has(menuId)) {
        errors.push({
          type: 'circular_reference',
          menuId: menuId,
          message: `Circular reference detected starting from menu "${menus[menuId]?.title}"`,
          severity: 'high',
        });
        return true;
      }
      
      if (visited.has(menuId)) return false;
      
      visited.add(menuId);
      recursionStack.add(menuId);
      
      const menu = menus[menuId];
      if (menu && menu.options) {
        for (const option of menu.options) {
          if (option.targetId && detectCycle(option.targetId)) {
            return true;
          }
        }
      }
      
      recursionStack.delete(menuId);
      return false;
    };

    Object.keys(menus).forEach(menuId => {
      if (!visited.has(menuId)) {
        detectCycle(menuId);
      }
    });

    // Helper functions for calculating stats
    const calculateMaxDepth = () => {
      const calculateDepth = (menuId, depth = 0, visited = new Set()) => {
        if (visited.has(menuId) || !menus[menuId]) return depth;
        
        visited.add(menuId);
        const menu = menus[menuId];
        let maxChildDepth = depth;
        
        if (menu.options) {
          menu.options.forEach(option => {
            if (option.targetId) {
              const childDepth = calculateDepth(option.targetId, depth + 1, new Set(visited));
              maxChildDepth = Math.max(maxChildDepth, childDepth);
            }
          });
        }
        
        return maxChildDepth;
      };
      
      return calculateDepth('main');
    };

    const calculateAvgOptions = () => {
      const menusWithOptions = Object.values(menus).filter(menu => 
        (menu.type === 'main' || menu.type === 'sub') && menu.options
      );
      
      if (menusWithOptions.length === 0) return 0;
      
      const totalOptions = menusWithOptions.reduce((sum, menu) => sum + menu.options.length, 0);
      return Math.round(totalOptions / menusWithOptions.length * 10) / 10;
    };

    return {
      errors,
      warnings,
      suggestions,
      performance,
      stats: {
        totalMenus: Object.keys(menus).length,
        totalConnections: Object.keys(connections).length,
        reachableMenus: reachableMenus.size,
        maxDepth: calculateMaxDepth(),
        avgOptionsPerMenu: calculateAvgOptions(),
      }
    };
  }, [menus, connections, validation]);

  // Filter and search functionality
  const filteredIssues = useMemo(() => {
    const allIssues = [
      ...enhancedValidation.errors.map(item => ({ ...item, category: 'error' })),
      ...enhancedValidation.warnings.map(item => ({ ...item, category: 'warning' })),
      ...enhancedValidation.suggestions.map(item => ({ ...item, category: 'suggestion' })),
      ...enhancedValidation.performance.map(item => ({ ...item, category: 'performance' })),
    ];

    return allIssues.filter(issue => {
      const matchesFilter = filterType === 'all' || issue.category === filterType;
      const matchesSearch = !searchQuery || 
        issue.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (menus[issue.menuId]?.title.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesFilter && matchesSearch;
    });
  }, [enhancedValidation, filterType, searchQuery, menus]);

  const getIssueIcon = (category, severity) => {
    switch (category) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'suggestion':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'performance':
        return <Zap className="w-4 h-4 text-purple-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const handleIssueClick = (issue) => {
    if (issue.menuId && menus[issue.menuId]) {
      selectMenu(issue.menuId);
      addNotification({
        type: 'info',
        message: `Selected menu: ${menus[issue.menuId].title}`,
      });
    }
  };

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      project: 'USSD Flow Validation Report',
      summary: {
        errors: enhancedValidation.errors.length,
        warnings: enhancedValidation.warnings.length,
        suggestions: enhancedValidation.suggestions.length,
        performance: enhancedValidation.performance.length,
      },
      stats: enhancedValidation.stats,
      issues: filteredIssues,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ussd-validation-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      message: 'Validation report exported successfully',
    });
  };

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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Flow Validation
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Analyze your USSD flow for issues and improvements
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg transition-colors ${
                  autoRefresh 
                    ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={`Auto-refresh ${autoRefresh ? 'on' : 'off'}`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={exportReport}
                className="p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Export report"
              >
                <Download className="w-4 h-4" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="flex-shrink-0 p-6 bg-gradient-to-r border-b border-slate-200 dark:border-slate-700 from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="p-4 text-center bg-white rounded-xl border shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div className="flex justify-center items-center mx-auto mb-3 w-12 h-12 bg-red-100 rounded-full dark:bg-red-900/20">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
                <div className="mb-1 text-2xl font-bold text-red-500">
                  {enhancedValidation.errors.length}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Errors</div>
              </div>
              <div className="p-4 text-center bg-white rounded-xl border shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div className="flex justify-center items-center mx-auto mb-3 w-12 h-12 bg-yellow-100 rounded-full dark:bg-yellow-900/20">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="mb-1 text-2xl font-bold text-yellow-500">
                  {enhancedValidation.warnings.length}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Warnings</div>
              </div>
              <div className="p-4 text-center bg-white rounded-xl border shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div className="flex justify-center items-center mx-auto mb-3 w-12 h-12 bg-blue-100 rounded-full dark:bg-blue-900/20">
                  <Info className="w-6 h-6 text-blue-500" />
                </div>
                <div className="mb-1 text-2xl font-bold text-blue-500">
                  {enhancedValidation.suggestions.length}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Suggestions</div>
              </div>
              <div className="p-4 text-center bg-white rounded-xl border shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div className="flex justify-center items-center mx-auto mb-3 w-12 h-12 bg-green-100 rounded-full dark:bg-green-900/20">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div className="mb-1 text-2xl font-bold text-green-500">
                  {enhancedValidation.stats.reachableMenus}/{enhancedValidation.stats.totalMenus}
                </div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Reachable</div>
              </div>
            </div>
          </div>

          {/* Tabs and Filters */}
          <div className="flex-shrink-0 bg-white border-b dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-4 justify-between p-4 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-3 items-start sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-0 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="py-2.5 pr-4 pl-9 text-sm bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-600 w-full sm:w-64 transition-colors"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-600 transition-colors min-w-[140px]"
                >
                  <option value="all">All Issues</option>
                  <option value="error">Errors Only</option>
                  <option value="warning">Warnings Only</option>
                  <option value="suggestion">Suggestions Only</option>
                  <option value="performance">Performance Only</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="overflow-y-auto flex-1 p-4">
            {filteredIssues.length === 0 ? (
              <div className="flex justify-center items-center h-full text-center">
                <div>
                  <CheckCircle className="mx-auto mb-4 w-16 h-16 text-green-500" />
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {enhancedValidation.errors.length === 0 && enhancedValidation.warnings.length === 0
                      ? 'Flow Validation Passed!'
                      : 'No Issues Found'
                    }
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {enhancedValidation.errors.length === 0 && enhancedValidation.warnings.length === 0
                      ? 'Your USSD flow is well-structured and ready to go.'
                      : 'Try adjusting your filters or search query.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredIssues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md ${getSeverityColor(issue.severity)}`}
                    onClick={() => handleIssueClick(issue)}
                  >
                    <div className="flex items-start space-x-3">
                      {getIssueIcon(issue.category, issue.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1 space-x-2">
                          <span className="text-sm font-medium capitalize text-slate-900 dark:text-slate-100">
                            {issue.category}
                          </span>
                          {issue.severity && (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                              issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {issue.severity}
                            </span>
                          )}
                          {issue.menuId && menus[issue.menuId] && (
                            <span className="px-2 py-1 text-xs rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                              {menus[issue.menuId].title}
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {issue.message}
                        </p>
                        {issue.impact && (
                          <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">
                            Impact: {issue.impact}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Additional Stats */}
          <div className="flex-shrink-0 bg-gradient-to-r border-t from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border-slate-200 dark:border-slate-700">
            <div className="p-4">
              <div className="flex flex-col gap-3 justify-between items-start sm:flex-row sm:items-center">
                <div className="flex flex-wrap gap-4 items-center text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span><strong>Max Depth:</strong> {enhancedValidation.stats.maxDepth}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span><strong>Avg Options:</strong> {enhancedValidation.stats.avgOptionsPerMenu}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span><strong>Connections:</strong> {enhancedValidation.stats.totalConnections}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FlowValidationPanel;