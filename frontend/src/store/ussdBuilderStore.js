import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Advanced USSD Builder Store with undo/redo and real-time features
const useUSSDBuilderStore = create(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        // Core project state
        project: {
          id: null,
          name: 'Untitled USSD App',
          shortCode: '*123#',
          category: 'general',
          sessionTimeout: 60,
          language: 'en',
          version: '1.0.0',
          lastModified: new Date().toISOString(),
          status: 'draft', // draft, published, archived
        },

        // Canvas state
        canvas: {
          zoom: 1,
          pan: { x: 0, y: 0 },
          selectedMenuId: null,
          draggedMenuId: null,
          viewMode: 'builder', // builder, preview, settings, flow-chart
          showMinimap: true,
          gridSize: 20,
          snapToGrid: true,
        },

        // Menus collection with advanced properties
        menus: {},
        menuOrder: [], // For z-index management
        connections: {}, // Visual connections between menus

        // Real-time testing state
        testing: {
          isActive: false,
          currentMenuId: null,
          userInput: '',
          sessionHistory: [],
          currentStep: 0,
          variables: {}, // User input storage
        },

        // History for undo/redo
        history: {
          past: [],
          present: null,
          future: [],
          maxHistoryLength: 20,
        },

        // UI state
        ui: {
          sidebarCollapsed: false,
          phonePreviewVisible: true,
          showConnections: true,
          theme: 'light', // light, dark, auto
          notifications: [],
          loading: {
            saving: false,
            publishing: false,
            testing: false,
          },
        },

        // Templates and presets
        templates: [
          {
            id: 'customer-service',
            name: 'Customer Service',
            description: 'Complete customer service flow with support, billing, and account management',
            preview: '👥',
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
                ]
              }
            }
          },
          {
            id: 'banking',
            name: 'Mobile Banking',
            description: 'Secure banking operations with balance check, transfer, and payments',
            preview: '🏦',
            menus: {}
          },
          {
            id: 'ecommerce',
            name: 'E-Commerce',
            description: 'Product catalog, ordering, and payment processing',
            preview: '🛒',
            menus: {}
          }
        ],

        // Actions
        actions: {
          // Project actions
          updateProject: (updates) => set(state => {
            Object.assign(state.project, updates, {
              lastModified: new Date().toISOString()
            });
          }),

          loadProject: (projectData) => set(state => {
            state.project = { ...state.project, ...projectData };
            state.menus = projectData.menus || {};
            state.connections = projectData.connections || {};
            state.menuOrder = projectData.menuOrder || [];
          }),

          // Canvas actions
          updateCanvas: (canvasUpdates) => set(state => {
            Object.assign(state.canvas, canvasUpdates);
          }),

          setZoom: (zoom) => set(state => {
            state.canvas.zoom = Math.max(0.1, Math.min(3, zoom));
          }),

          setPan: (pan) => set(state => {
            state.canvas.pan = pan;
          }),

          selectMenu: (menuId) => set(state => {
            state.canvas.selectedMenuId = menuId;
          }),

          // Menu management with history
          addMenu: (menu) => set(state => {
            const menuWithDefaults = {
              id: menu.id || `menu-${Date.now()}`,
              type: 'sub',
              title: 'New Menu',
              position: { x: 200, y: 200 },
              options: [],
              validation: [],
              metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              ...menu,
            };

            state.menus[menuWithDefaults.id] = menuWithDefaults;
            state.menuOrder.push(menuWithDefaults.id);
            
            // Add to history
            get().actions._addToHistory();
          }),

          updateMenu: (menuId, updates) => set(state => {
            if (state.menus[menuId]) {
              Object.assign(state.menus[menuId], updates, {
                metadata: {
                  ...state.menus[menuId].metadata,
                  updatedAt: new Date().toISOString(),
                }
              });
              get().actions._addToHistory();
            }
          }),

          deleteMenu: (menuId) => set(state => {
            delete state.menus[menuId];
            state.menuOrder = state.menuOrder.filter(id => id !== menuId);
            
            // Remove connections involving this menu
            Object.keys(state.connections).forEach(connId => {
              const conn = state.connections[connId];
              if (conn.source === menuId || conn.target === menuId) {
                delete state.connections[connId];
              }
            });
            
            if (state.canvas.selectedMenuId === menuId) {
              state.canvas.selectedMenuId = null;
            }
            
            get().actions._addToHistory();
          }),

          duplicateMenu: (menuId) => set(state => {
            const originalMenu = state.menus[menuId];
            if (originalMenu) {
              const duplicatedMenu = {
                ...originalMenu,
                id: `${menuId}-copy-${Date.now()}`,
                title: `${originalMenu.title} (Copy)`,
                position: {
                  x: originalMenu.position.x + 50,
                  y: originalMenu.position.y + 50,
                },
              };
              
              state.menus[duplicatedMenu.id] = duplicatedMenu;
              state.menuOrder.push(duplicatedMenu.id);
              get().actions._addToHistory();
            }
          }),

          // Enhanced Connection management with option routing
          addConnection: (source, target, options = {}) => set(state => {
            const connectionId = options.optionKey 
              ? `${source}-${target}-${options.optionKey}`
              : `${source}-${target}`;
            
            state.connections[connectionId] = {
              id: connectionId,
              source,
              target,
              type: options.type || 'flow', // flow, option, input, conditional, api
              label: options.label || '',
              condition: options.condition || null,
              optionKey: options.optionKey || null, // For option-specific routing
              inputCondition: options.inputCondition || null, // For input-based routing
              priority: options.priority || 0,
              metadata: {
                createdAt: new Date().toISOString(),
                description: options.description || '',
                tags: options.tags || [],
              },
              ...options,
            };
          }),

          // Add option-specific connection
          addOptionConnection: (sourceMenuId, targetMenuId, optionKey, optionLabel) => set(state => {
            const sourceMenu = state.menus[sourceMenuId];
            if (sourceMenu && sourceMenu.options) {
              // Update the option with target information
              const optionIndex = sourceMenu.options.findIndex(opt => opt.key === optionKey);
              if (optionIndex !== -1) {
                sourceMenu.options[optionIndex].targetMenuId = targetMenuId;
                sourceMenu.options[optionIndex].hasConnection = true;
              }
            }
            
            // Create the connection directly
            const connectionId = `${sourceMenuId}-${targetMenuId}-${optionKey}`;
            state.connections[connectionId] = {
              id: connectionId,
              source: sourceMenuId,
              target: targetMenuId,
              type: 'option',
              label: optionLabel,
              optionKey,
              condition: null,
              inputCondition: null,
              priority: 0,
              metadata: {
                createdAt: new Date().toISOString(),
                description: `Option "${optionKey}: ${optionLabel}" routes to target menu`,
                tags: [],
              },
            };
          }),
          

          // Add input-based connection with conditions
          addInputConnection: (sourceMenuId, targetMenuId, inputCondition) => set(state => {
            const connectionId = `${sourceMenuId}-${targetMenuId}-input`;
            state.connections[connectionId] = {
              id: connectionId,
              source: sourceMenuId,
              target: targetMenuId,
              type: 'input',
              label: `Input: ${inputCondition.type}`,
              optionKey: null,
              condition: null,
              inputCondition,
              priority: 0,
              metadata: {
                createdAt: new Date().toISOString(),
                description: `Routes based on input validation: ${inputCondition.description}`,
                tags: [],
              },
            };
          }),

          removeConnection: (connectionId) => set(state => {
            delete state.connections[connectionId];
          }),

          // Testing actions
          startTesting: (startMenuId = 'main') => set(state => {
            state.testing.isActive = true;
            state.testing.currentMenuId = startMenuId;
            state.testing.sessionHistory = [];
            state.testing.currentStep = 0;
            state.testing.variables = {};
            state.testing.userInput = '';
          }),

          stopTesting: () => set(state => {
            state.testing.isActive = false;
            state.testing.currentMenuId = null;
            state.testing.userInput = '';
          }),

          processUserInput: (input) => set(state => {
            const currentMenu = state.menus[state.testing.currentMenuId];
            if (!currentMenu) return;

            // Add to session history
            state.testing.sessionHistory.push({
              menuId: state.testing.currentMenuId,
              input: input,
              timestamp: new Date().toISOString(),
            });

            // Process navigation
            if (currentMenu.type === 'input') {
              // Store input in variables
              const variableName = currentMenu.variableName || `input_${state.testing.currentStep}`;
              state.testing.variables[variableName] = input;
              
              // Navigate to next menu
              const nextMenuId = currentMenu.nextMenuId;
              if (nextMenuId && state.menus[nextMenuId]) {
                state.testing.currentMenuId = nextMenuId;
              }
            } else {
              // Find matching option
              const option = currentMenu.options?.find(opt => opt.key === input);
              if (option) {
                if (option.action === 'submenu' && option.targetId) {
                  state.testing.currentMenuId = option.targetId;
                } else if (option.action === 'end') {
                  state.testing.isActive = false;
                  state.testing.currentMenuId = null;
                }
              }
            }

            state.testing.currentStep++;
            state.testing.userInput = '';
          }),

          // History management
          _addToHistory: () => set(state => {
            const currentState = {
              menus: JSON.parse(JSON.stringify(state.menus)),
              connections: JSON.parse(JSON.stringify(state.connections)),
              menuOrder: [...state.menuOrder],
            };

            state.history.past.push(currentState);
            
            // Limit history size
            if (state.history.past.length > state.history.maxHistoryLength) {
              state.history.past.shift();
            }
            
            // Clear future when new action is performed
            state.history.future = [];
          }),

          undo: () => set(state => {
            if (state.history.past.length === 0) return;
            
            const previous = state.history.past.pop();
            const current = {
              menus: JSON.parse(JSON.stringify(state.menus)),
              connections: JSON.parse(JSON.stringify(state.connections)),
              menuOrder: [...state.menuOrder],
            };
            
            state.history.future.push(current);
            
            // Restore previous state
            state.menus = previous.menus;
            state.connections = previous.connections;
            state.menuOrder = previous.menuOrder;
          }),

          redo: () => set(state => {
            if (state.history.future.length === 0) return;
            
            const next = state.history.future.pop();
            const current = {
              menus: JSON.parse(JSON.stringify(state.menus)),
              connections: JSON.parse(JSON.stringify(state.connections)),
              menuOrder: [...state.menuOrder],
            };
            
            state.history.past.push(current);
            
            // Restore next state
            state.menus = next.menus;
            state.connections = next.connections;
            state.menuOrder = next.menuOrder;
          }),

          // UI actions
          addNotification: (notification) => set(state => {
            const id = Date.now().toString();
            state.ui.notifications.push({
              id,
              type: 'info',
              duration: 5000,
              ...notification,
            });
          }),

          removeNotification: (id) => set(state => {
            state.ui.notifications = state.ui.notifications.filter(n => n.id !== id);
          }),

          setLoading: (key, loading) => set(state => {
            state.ui.loading[key] = loading;
          }),

          toggleTheme: () => set(state => {
            state.ui.theme = state.ui.theme === 'light' ? 'dark' : 'light';
          }),

          togglePhonePreview: () => set(state => {
            state.ui.phonePreviewVisible = !state.ui.phonePreviewVisible;
          }),

          // Template actions
          applyTemplate: (templateId) => set(state => {
            const template = state.templates.find(t => t.id === templateId);
            if (template) {
              state.menus = { ...template.menus };
              state.menuOrder = Object.keys(template.menus);
              state.connections = {};
              
              get().actions._addToHistory();
              get().actions.addNotification({
                type: 'success',
                message: `Applied ${template.name} template`,
              });
            }
          }),

          // Export/Import
          exportProject: () => {
            const state = get();
            return {
              project: state.project,
              menus: state.menus,
              connections: state.connections,
              menuOrder: state.menuOrder,
              exportedAt: new Date().toISOString(),
              version: '2.0.0',
            };
          },

          importProject: (projectData) => set(state => {
            if (projectData.version && projectData.menus) {
              state.project = { ...state.project, ...projectData.project };
              state.menus = projectData.menus;
              state.connections = projectData.connections || {};
              state.menuOrder = projectData.menuOrder || Object.keys(projectData.menus);
              
              get().actions.addNotification({
                type: 'success',
                message: 'Project imported successfully',
              });
            }
          }),

          // Validation
          validateFlow: () => {
            const state = get();
            const errors = [];
            const warnings = [];

            // Check for orphaned menus
            Object.values(state.menus).forEach(menu => {
              if (menu.type !== 'main') {
                const hasIncomingConnection = Object.values(state.connections)
                  .some(conn => conn.target === menu.id);
                
                if (!hasIncomingConnection) {
                  warnings.push({
                    type: 'orphaned_menu',
                    menuId: menu.id,
                    message: `Menu "${menu.title}" is not connected to any other menu`,
                  });
                }
              }
            });

            // Check for broken connections
            Object.values(state.connections).forEach(conn => {
              if (!state.menus[conn.source] || !state.menus[conn.target]) {
                errors.push({
                  type: 'broken_connection',
                  connectionId: conn.id,
                  message: `Connection "${conn.id}" points to non-existent menu`,
                });
              }
            });

            return { errors, warnings };
          },
        },


      }))
    ),
    {
      name: 'ussd-builder-store',
    }
  )
);

// Helper selectors for easier use in components
export const selectCanUndo = (state) => state.history.past.length > 0;
export const selectCanRedo = (state) => state.history.future.length > 0;
export const selectCurrentMenu = (state) => 
  state.testing.currentMenuId ? state.menus[state.testing.currentMenuId] : null;
export const selectSelectedMenu = (state) => 
  state.canvas.selectedMenuId ? state.menus[state.canvas.selectedMenuId] : null;
export const selectMenuCount = (state) => Object.keys(state.menus).length;
export const selectConnectionCount = (state) => Object.keys(state.connections).length;

export default useUSSDBuilderStore;