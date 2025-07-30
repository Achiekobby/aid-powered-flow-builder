import React, { useEffect } from 'react';
import useUSSDBuilderStore from '../../../store/ussdBuilderStore';

/**
 * Advanced USSD Builder Example
 * 
 * This component demonstrates how to use all the state-of-the-art features
 * of the enhanced USSD builder, including:
 * 
 * - Advanced menu types (conditional, API, input validation)
 * - Complex flow logic with multiple paths
 * - Professional templates and best practices
 * - Real-time validation and error handling
 * 
 * Use this as a reference for building sophisticated USSD applications.
 */
const AdvancedUSSDExample = () => {
  const {
    actions: {
      addMenu,
      addConnection,
      updateProject,
      applyTemplate,
      validateFlow,
      addNotification,
    }
  } = useUSSDBuilderStore();

  useEffect(() => {
    // Create a comprehensive example USSD flow
    createAdvancedUSSDFlow();
  }, []);

  const createAdvancedUSSDFlow = async () => {
    // Update project with advanced configuration
    updateProject({
      name: 'Advanced Banking USSD App',
      category: 'financial-services',
      shortCode: '*123#',
      language: 'en',
      sessionTimeout: 120, // 2 minutes for banking operations
    });

    // 1. Main Menu with sophisticated options
    const mainMenu = {
      id: 'main-banking',
      type: 'main',
      title: 'Welcome to SecureBank\nHow can we help you today?',
      position: { x: 100, y: 100 },
      options: [
        { 
          key: '1', 
          text: 'Check Balance', 
          action: 'submenu', 
          targetId: 'auth-pin',
          description: 'View account balance' 
        },
        { 
          key: '2', 
          text: 'Transfer Money', 
          action: 'submenu', 
          targetId: 'auth-pin',
          description: 'Send money to another account' 
        },
        { 
          key: '3', 
          text: 'Pay Bills', 
          action: 'submenu', 
          targetId: 'bill-categories',
          description: 'Pay utility bills' 
        },
        { 
          key: '4', 
          text: 'Mini Statement', 
          action: 'submenu', 
          targetId: 'auth-pin',
          description: 'View recent transactions' 
        },
        { 
          key: '5', 
          text: 'Support', 
          action: 'submenu', 
          targetId: 'support-menu',
          description: 'Get help and support' 
        },
      ],
      metadata: {
        category: 'main',
        priority: 'high',
        analytics: true,
      }
    };

    // 2. PIN Authentication (Input Menu with Validation)
    const authPinMenu = {
      id: 'auth-pin',
      type: 'input',
      title: 'Enter your 4-digit PIN for security verification',
      position: { x: 400, y: 150 },
      inputType: 'number',
      required: true,
      maxLength: 4,
      minLength: 4,
      validation: [
        {
          type: 'length',
          value: 4,
          message: 'PIN must be exactly 4 digits'
        },
        {
          type: 'numeric',
          message: 'PIN must contain only numbers'
        },
        {
          type: 'security',
          attempts: 3,
          lockout: '30m',
          message: 'Account locked after 3 failed attempts'
        }
      ],
      variableName: 'user_pin',
      nextMenuId: 'pin-verification',
      security: {
        encrypted: true,
        timeout: 30,
        maskInput: true,
      }
    };

    // 3. PIN Verification (Conditional Menu)
    const pinVerificationMenu = {
      id: 'pin-verification',
      type: 'conditional',
      title: 'Verifying your identity...',
      position: { x: 700, y: 200 },
      condition: {
        variable: 'user_pin',
        operator: 'api_validate',
        endpoint: '/api/auth/validate-pin',
        successTarget: 'account-dashboard',
        failureTarget: 'pin-error',
        timeout: 10,
      },
      loadingMessage: 'Please wait while we verify your PIN...',
      retryOptions: {
        maxAttempts: 3,
        retryTarget: 'auth-pin',
      }
    };

    // 4. Account Dashboard (API Menu)
    const accountDashboard = {
      id: 'account-dashboard',
      type: 'api',
      title: 'Loading your account information...',
      position: { x: 1000, y: 100 },
      apiEndpoint: '/api/account/dashboard',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer {session_token}',
        'X-USSD-Session': '{session_id}',
      },
      timeout: 15,
      retryAttempts: 2,
      successTemplate: `Account: {account_number}
Available: \${balance}
Last Transaction: {last_transaction_date}

1. Transfer Money
2. Mini Statement  
3. Pay Bills
0. Main Menu`,
      errorTarget: 'api-error',
      loadingMessage: 'Fetching account details...',
    };

    // 5. Bill Categories (Sub Menu with Dynamic Options)
    const billCategoriesMenu = {
      id: 'bill-categories',
      type: 'sub',
      title: 'Select Bill Category',
      position: { x: 400, y: 400 },
      options: [
        { key: '1', text: 'Electricity', action: 'submenu', targetId: 'electricity-providers' },
        { key: '2', text: 'Water', action: 'submenu', targetId: 'water-providers' },
        { key: '3', text: 'Internet', action: 'submenu', targetId: 'internet-providers' },
        { key: '4', text: 'TV/Cable', action: 'submenu', targetId: 'tv-providers' },
        { key: '5', text: 'Mobile Top-up', action: 'submenu', targetId: 'mobile-topup' },
      ],
      analytics: {
        trackSelection: true,
        popularItems: ['1', '5', '2'], // Most used options
      }
    };

    // 6. Transfer Amount Input (Advanced Input Menu)
    const transferAmountMenu = {
      id: 'transfer-amount',
      type: 'input',
      title: 'Enter amount to transfer\n(Min: $1, Max: $5,000)',
      position: { x: 1300, y: 200 },
      inputType: 'amount',
      required: true,
      validation: [
        {
          type: 'range',
          min: 1,
          max: 5000,
          message: 'Amount must be between $1 and $5,000'
        },
        {
          type: 'balance_check',
          message: 'Insufficient funds'
        },
        {
          type: 'daily_limit',
          limit: 10000,
          message: 'Daily transfer limit exceeded'
        }
      ],
      variableName: 'transfer_amount',
      formatting: {
        currency: true,
        decimals: 2,
        prefix: '$',
      },
      nextMenuId: 'transfer-confirmation',
    };

    // 7. Transfer Confirmation (Conditional with Multiple Paths)
    const transferConfirmationMenu = {
      id: 'transfer-confirmation',
      type: 'conditional',
      title: `Confirm Transfer
Amount: \${transfer_amount}
To: {recipient_name}
Account: {recipient_account}
Fee: \${transfer_fee}

1. Confirm Transfer
2. Cancel
0. Main Menu`,
      position: { x: 1600, y: 300 },
      condition: {
        variable: 'user_confirmation',
        rules: [
          {
            operator: 'equals',
            value: '1',
            target: 'process-transfer'
          },
          {
            operator: 'equals',
            value: '2',
            target: 'transfer-cancelled'
          },
          {
            operator: 'equals',
            value: '0',
            target: 'main-banking'
          }
        ],
        defaultTarget: 'invalid-option',
      }
    };

    // 8. Process Transfer (API Menu with Advanced Features)
    const processTransferMenu = {
      id: 'process-transfer',
      type: 'api',
      title: 'Processing your transfer...\nPlease do not close this session.',
      position: { x: 1900, y: 400 },
      apiEndpoint: '/api/transfers/execute',
      method: 'POST',
      payload: {
        amount: '{transfer_amount}',
        recipient: '{recipient_account}',
        pin: '{user_pin}',
        reference: '{auto_reference}',
      },
      timeout: 30,
      retryAttempts: 1,
      successTarget: 'transfer-success',
      errorTarget: 'transfer-failed',
      loadingSteps: [
        'Validating recipient account...',
        'Checking available balance...',
        'Processing transfer...',
        'Updating account balance...',
        'Sending confirmation...',
      ],
      webhooks: {
        success: '/webhooks/transfer-success',
        failure: '/webhooks/transfer-failed',
      }
    };

    // 9. Support Menu (Advanced Sub Menu)
    const supportMenu = {
      id: 'support-menu',
      type: 'sub',
      title: '🆘 How can we help you?',
      position: { x: 400, y: 600 },
      options: [
        { 
          key: '1', 
          text: 'Report Problem', 
          action: 'submenu', 
          targetId: 'report-issue',
          icon: '⚠️' 
        },
        { 
          key: '2', 
          text: 'FAQ', 
          action: 'submenu', 
          targetId: 'faq-menu',
          icon: '❓' 
        },
        { 
          key: '3', 
          text: 'Call Support', 
          action: 'end', 
          targetId: 'call-support',
          icon: '📞' 
        },
        { 
          key: '4', 
          text: 'Live Chat', 
          action: 'submenu', 
          targetId: 'live-chat',
          icon: '💬' 
        },
      ],
      metadata: {
        category: 'support',
        priority: 'medium',
        workingHours: '24/7',
      }
    };

    // 10. Error Handling Menu (End Menu with Options)
    const transferFailedMenu = {
      id: 'transfer-failed',
      type: 'end',
      title: `❌ Transfer Failed

{error_message}

Your account has not been charged.
Reference: {error_reference}

For assistance, call: 1-800-BANK
Or visit our website: bank.com

Thank you for using SecureBank.`,
      position: { x: 2200, y: 500 },
      metadata: {
        category: 'error',
        severity: 'high',
        logError: true,
        notifySupport: true,
      }
    };

    // 11. Success Menu (End Menu with Receipt)
    const transferSuccessMenu = {
      id: 'transfer-success',
      type: 'end',
      title: `✅ Transfer Successful!

Amount: \${transfer_amount}
To: {recipient_name}
Reference: {transaction_reference}
Date: {transaction_date}
New Balance: \${new_balance}

SMS receipt sent to {user_phone}
Thank you for using SecureBank!`,
      position: { x: 2200, y: 200 },
      metadata: {
        category: 'success',
        generateReceipt: true,
        sendSMS: true,
        updateHistory: true,
      }
    };

    // Add all menus
    const menus = [
      mainMenu,
      authPinMenu,
      pinVerificationMenu,
      accountDashboard,
      billCategoriesMenu,
      transferAmountMenu,
      transferConfirmationMenu,
      processTransferMenu,
      supportMenu,
      transferFailedMenu,
      transferSuccessMenu,
    ];

    // Add menus with delay for visual effect
    for (let i = 0; i < menus.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      addMenu(menus[i]);
    }

    // Add connections between menus
    const connections = [
      { source: 'main-banking', target: 'auth-pin', type: 'flow', label: 'Auth Required' },
      { source: 'main-banking', target: 'bill-categories', type: 'flow', label: 'Direct Access' },
      { source: 'main-banking', target: 'support-menu', type: 'flow', label: 'Help' },
      { source: 'auth-pin', target: 'pin-verification', type: 'flow', label: 'Validate' },
      { source: 'pin-verification', target: 'account-dashboard', type: 'conditional', label: 'Success' },
      { source: 'pin-verification', target: 'auth-pin', type: 'conditional', label: 'Retry' },
      { source: 'account-dashboard', target: 'transfer-amount', type: 'api', label: 'Transfer' },
      { source: 'transfer-amount', target: 'transfer-confirmation', type: 'flow', label: 'Confirm' },
      { source: 'transfer-confirmation', target: 'process-transfer', type: 'conditional', label: 'Execute' },
      { source: 'process-transfer', target: 'transfer-success', type: 'api', label: 'Success' },
      { source: 'process-transfer', target: 'transfer-failed', type: 'api', label: 'Error' },
    ];

    // Add connections with delay
    for (let i = 0; i < connections.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      addConnection(connections[i].source, connections[i].target, {
        type: connections[i].type,
        label: connections[i].label,
      });
    }

    // Run validation and show results
    setTimeout(() => {
      const validation = validateFlow();
      
      addNotification({
        type: validation.errors.length > 0 ? 'warning' : 'success',
        message: `Advanced USSD flow created! ${validation.errors.length} errors, ${validation.warnings.length} warnings`,
        duration: 6000,
      });
    }, 3000);

    // Show feature highlights
    setTimeout(() => {
      addNotification({
        type: 'info',
        message: '🎉 Advanced features: PIN validation, API integration, conditional logic, error handling!',
        duration: 8000,
      });
    }, 5000);
  };

  // This component doesn't render anything - it's just for demonstration
  return null;
};

// Export helper functions for building advanced USSD flows
export const USSDFlowHelpers = {
  
  // Create a secure PIN input menu
  createPINInput: (id, title, nextMenuId, options = {}) => ({
    id,
    type: 'input',
    title,
    inputType: 'number',
    required: true,
    maxLength: 4,
    minLength: 4,
    validation: [
      { type: 'length', value: 4, message: 'PIN must be 4 digits' },
      { type: 'numeric', message: 'PIN must be numbers only' },
      { type: 'security', attempts: 3, lockout: '30m' },
      ...(options.extraValidation || [])
    ],
    variableName: options.variableName || 'user_pin',
    nextMenuId,
    security: {
      encrypted: true,
      timeout: 30,
      maskInput: true,
      ...options.security
    }
  }),

  // Create an API menu with error handling
  createAPIMenu: (id, title, endpoint, options = {}) => ({
    id,
    type: 'api',
    title,
    apiEndpoint: endpoint,
    method: options.method || 'GET',
    timeout: options.timeout || 15,
    retryAttempts: options.retryAttempts || 2,
    successTarget: options.successTarget,
    errorTarget: options.errorTarget,
    loadingMessage: options.loadingMessage || 'Loading...',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  }),

  // Create a conditional menu with multiple paths
  createConditionalMenu: (id, title, variable, rules, options = {}) => ({
    id,
    type: 'conditional',
    title,
    condition: {
      variable,
      rules,
      defaultTarget: options.defaultTarget || 'error-menu',
      timeout: options.timeout || 10,
    },
    loadingMessage: options.loadingMessage || 'Processing...',
  }),

  // Create a validated input menu
  createValidatedInput: (id, title, inputType, validationRules, options = {}) => ({
    id,
    type: 'input',
    title,
    inputType,
    required: options.required !== false,
    validation: validationRules,
    variableName: options.variableName || `input_${id}`,
    nextMenuId: options.nextMenuId,
    formatting: options.formatting,
  }),

  // Create a professional end menu
  createEndMenu: (id, title, options = {}) => ({
    id,
    type: 'end',
    title,
    metadata: {
      category: options.category || 'completion',
      generateReceipt: options.receipt || false,
      sendSMS: options.sms || false,
      logInteraction: options.logging !== false,
      ...options.metadata,
    }
  }),

  // Common validation rules
  ValidationRules: {
    phoneNumber: [
      { type: 'regex', pattern: '^[0-9+\\-\\s()]+$', message: 'Invalid phone format' },
      { type: 'length', min: 10, max: 15, message: 'Phone must be 10-15 digits' }
    ],
    
    email: [
      { type: 'regex', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', message: 'Invalid email format' }
    ],
    
    amount: [
      { type: 'numeric', message: 'Amount must be a number' },
      { type: 'range', min: 0.01, max: 999999, message: 'Invalid amount range' }
    ],
    
    accountNumber: [
      { type: 'numeric', message: 'Account number must be numeric' },
      { type: 'length', value: 10, message: 'Account number must be 10 digits' }
    ]
  },

  // Common menu templates
  Templates: {
    mainMenu: (options) => ({
      type: 'main',
      title: options.title || 'Welcome! How can we help?',
      options: options.options || [],
      metadata: { category: 'main', priority: 'high' }
    }),

    authMenu: (options) => ({
      type: 'input',
      title: 'Enter your PIN for security',
      inputType: 'number',
      validation: USSDFlowHelpers.ValidationRules.pin,
      security: { encrypted: true, maskInput: true }
    }),

    errorMenu: (message) => ({
      type: 'end',
      title: `❌ Error: ${message}\n\nPlease try again or contact support.\nThank you.`,
      metadata: { category: 'error', logError: true }
    })
  }
};

export default AdvancedUSSDExample;