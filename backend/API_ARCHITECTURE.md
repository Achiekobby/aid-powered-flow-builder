# USSD Builder API Architecture

This document provides a comprehensive overview of the API architecture for the USSD Builder project, including all Services, Controllers, and Request Classes.

## Architecture Overview

The API follows a layered architecture pattern with clear separation of concerns:

```
Controller Layer (HTTP Requests/Responses)
    ↓
Service Layer (Business Logic)
    ↓
Model Layer (Data Access)
```

## Services Layer

### Core Services

#### 1. AuthService
**File:** `app/Services/AuthService.php`
- **Purpose:** Handles user authentication business logic
- **Key Methods:**
  - `login(array $data)` - Authenticate user and generate token
  - `validateLoginData(array $data)` - Validate login credentials
  - `canLogin(array $data)` - Check if user can login

#### 2. FlowService
**File:** `app/Services/FlowService.php`
- **Purpose:** Manages USSD flow creation, updates, and business rules
- **Key Methods:**
  - `getUserFlows(int $userId)` - Get user's flows
  - `createFlow(array $data)` - Create new flow with validation
  - `updateFlow(int $id, array $data)` - Update existing flow
  - `duplicateFlow(int $id)` - Duplicate flow with new version
  - `getTemplates(string $category = null)` - Get flow templates
  - `activateFlow(int $id)` - Activate flow
  - `deactivateFlow(int $id)` - Deactivate flow

#### 3. SessionService
**File:** `app/Services/SessionService.php`
- **Purpose:** Manages USSD session lifecycle and state
- **Key Methods:**
  - `createSession(array $data)` - Create new USSD session
  - `getSession(string $sessionId)` - Retrieve session by ID
  - `processInput(string $sessionId, string $input)` - Process user input
  - `navigateToNode(string $sessionId, string $nodeId)` - Navigate to specific node
  - `completeSession(string $sessionId)` - Mark session as completed
  - `expireOldSessions()` - Clean up expired sessions

#### 4. UssdCodeService
**File:** `app/Services/UssdCodeService.php`
- **Purpose:** Manages USSD code assignments and telco integration
- **Key Methods:**
  - `createUssdCode(array $data)` - Create new USSD code
  - `getUssdCodeByCode(string $code)` - Get code by USSD code
  - `activateUssdCode(int $id)` - Activate USSD code
  - `assignFlow(int $codeId, int $flowId)` - Assign flow to code
  - `getAvailableCodes()` - Get available USSD codes
  - `generateSuggestedCodes()` - Generate code suggestions

#### 5. AnalyticsService
**File:** `app/Services/AnalyticsService.php`
- **Purpose:** Tracks and analyzes USSD usage data
- **Key Methods:**
  - `logEvent(array $data)` - Log analytics event
  - `getUserAnalytics(int $userId, array $filters)` - Get user analytics
  - `getFlowAnalytics(int $flowId, array $filters)` - Get flow analytics
  - `getDashboardData(int $userId)` - Get dashboard metrics
  - `exportAnalytics(array $filters)` - Export analytics data

#### 6. SubscriptionService
**File:** `app/Services/SubscriptionService.php`
- **Purpose:** Manages user subscription plans and billing
- **Key Methods:**
  - `createSubscription(array $data)` - Create new subscription
  - `activateSubscription(int $id)` - Activate subscription
  - `cancelSubscription(int $id)` - Cancel subscription
  - `upgradeSubscription(int $id, string $newPlan)` - Upgrade plan
  - `checkSubscriptionStatus(int $userId)` - Check user subscription
  - `canAccessFeature(int $userId, string $feature)` - Check feature access

#### 7. PaymentService
**File:** `app/Services/PaymentService.php`
- **Purpose:** Handles payment processing and gateway integration
- **Key Methods:**
  - `createPayment(array $data)` - Create payment record
  - `initializePayment(int $paymentId)` - Initialize payment with gateway
  - `verifyPayment(string $reference)` - Verify payment status
  - `processWebhook(array $data)` - Process payment webhooks
  - `refundPayment(int $paymentId, float $amount)` - Process refunds

## Controllers Layer

### Core Controllers

#### 1. AuthController
**File:** `app/Http/Controllers/Auth/AuthController.php`
- **Purpose:** Handles authentication endpoints
- **Endpoints:**
  - `POST /api/auth/login` - User login
  - `POST /api/auth/logout` - User logout
  - `GET /api/auth/user` - Get current user

#### 2. FlowController
**File:** `app/Http/Controllers/Flow/FlowController.php`
- **Purpose:** Manages USSD flow CRUD operations
- **Endpoints:**
  - `GET /api/flows` - List user flows
  - `POST /api/flows` - Create new flow
  - `GET /api/flows/{id}` - Get specific flow
  - `PUT /api/flows/{id}` - Update flow
  - `DELETE /api/flows/{id}` - Delete flow
  - `POST /api/flows/{id}/duplicate` - Duplicate flow
  - `POST /api/flows/{id}/activate` - Activate flow
  - `POST /api/flows/{id}/deactivate` - Deactivate flow
  - `GET /api/flows/templates` - Get flow templates

#### 3. SessionController
**File:** `app/Http/Controllers/Session/SessionController.php`
- **Purpose:** Manages USSD session operations
- **Endpoints:**
  - `POST /api/sessions` - Create new session
  - `GET /api/sessions/{id}` - Get session details
  - `POST /api/sessions/{id}/input` - Process user input
  - `POST /api/sessions/{id}/navigate` - Navigate to node
  - `POST /api/sessions/{id}/complete` - Complete session
  - `POST /api/sessions/{id}/terminate` - Terminate session
  - `GET /api/sessions` - List user sessions
  - `GET /api/sessions/stats` - Get session statistics

#### 4. UssdCodeController
**File:** `app/Http/Controllers/UssdCode/UssdCodeController.php`
- **Purpose:** Manages USSD code operations
- **Endpoints:**
  - `GET /api/ussd-codes` - List user USSD codes
  - `POST /api/ussd-codes` - Create new USSD code
  - `GET /api/ussd-codes/{id}` - Get specific code
  - `PUT /api/ussd-codes/{id}` - Update code
  - `DELETE /api/ussd-codes/{id}` - Delete code
  - `POST /api/ussd-codes/{id}/activate` - Activate code
  - `POST /api/ussd-codes/{id}/deactivate` - Deactivate code
  - `POST /api/ussd-codes/{id}/assign-flow` - Assign flow to code
  - `GET /api/ussd-codes/available` - Get available codes

#### 5. AnalyticsController
**File:** `app/Http/Controllers/Analytics/AnalyticsController.php`
- **Purpose:** Provides analytics and reporting endpoints
- **Endpoints:**
  - `GET /api/analytics` - Get analytics data
  - `GET /api/analytics/dashboard` - Get dashboard data
  - `GET /api/analytics/flows/{id}` - Get flow analytics
  - `GET /api/analytics/ussd-codes/{id}` - Get USSD code analytics
  - `GET /api/analytics/export` - Export analytics data
  - `GET /api/analytics/top-flows` - Get top performing flows
  - `GET /api/analytics/recent-activity` - Get recent activity

#### 6. SubscriptionController
**File:** `app/Http/Controllers/Subscription/SubscriptionController.php`
- **Purpose:** Manages subscription operations
- **Endpoints:**
  - `GET /api/subscriptions` - List user subscriptions
  - `POST /api/subscriptions` - Create new subscription
  - `GET /api/subscriptions/{id}` - Get subscription details
  - `PUT /api/subscriptions/{id}` - Update subscription
  - `POST /api/subscriptions/{id}/cancel` - Cancel subscription
  - `POST /api/subscriptions/{id}/upgrade` - Upgrade subscription
  - `POST /api/subscriptions/{id}/renew` - Renew subscription
  - `GET /api/subscriptions/plans` - Get available plans

#### 7. PaymentController
**File:** `app/Http/Controllers/Payment/PaymentController.php`
- **Purpose:** Handles payment operations
- **Endpoints:**
  - `GET /api/payments` - List user payments
  - `POST /api/payments` - Create new payment
  - `GET /api/payments/{id}` - Get payment details
  - `PUT /api/payments/{id}` - Update payment
  - `POST /api/payments/{id}/verify` - Verify payment
  - `POST /api/payments/{id}/refund` - Process refund
  - `POST /api/payments/webhook` - Payment webhook handler
  - `GET /api/payments/stats` - Get payment statistics

## Request Classes Layer

### Authentication Requests

#### 1. LoginRequest
**File:** `app/Http/Requests/Auth/LoginRequest.php`
- **Purpose:** Validates login form data
- **Validation Rules:**
  - `email` - Required, valid email format
  - `password` - Required, minimum 8 characters

### Flow Requests

#### 1. StoreFlowRequest
**File:** `app/Http/Requests/Flow/StoreFlowRequest.php`
- **Purpose:** Validates flow creation data
- **Validation Rules:**
  - `name` - Required, max 255 characters
  - `description` - Optional, max 1000 characters
  - `flow_data` - Required, valid JSON structure
  - `variables` - Optional, array
  - `is_active` - Optional, boolean
  - `category` - Optional, string
  - `tags` - Optional, array

#### 2. UpdateFlowRequest
**File:** `app/Http/Requests/Flow/UpdateFlowRequest.php`
- **Purpose:** Validates flow update data
- **Validation Rules:** Same as StoreFlowRequest but with `sometimes` rules

### Session Requests

#### 1. CreateSessionRequest
**File:** `app/Http/Requests/Session/CreateSessionRequest.php`
- **Purpose:** Validates session creation data
- **Validation Rules:**
  - `flow_id` - Required, exists in flows table
  - `phone_number` - Required, valid Ghana phone format
  - `ussd_code` - Required, 3-6 digits

#### 2. ProcessInputRequest
**File:** `app/Http/Requests/Session/ProcessInputRequest.php`
- **Purpose:** Validates user input processing
- **Validation Rules:**
  - `input` - Required, string, max 255 characters

#### 3. UpdateSessionRequest
**File:** `app/Http/Requests/Session/UpdateSessionRequest.php`
- **Purpose:** Validates session update data
- **Validation Rules:**
  - `status` - Optional, valid status enum
  - `session_data` - Optional, array
  - `user_inputs` - Optional, array
  - `current_node` - Optional, string
  - `step_count` - Optional, integer, min 0

### USSD Code Requests

#### 1. StoreUssdCodeRequest
**File:** `app/Http/Requests/UssdCode/StoreUssdCodeRequest.php`
- **Purpose:** Validates USSD code creation data
- **Validation Rules:**
  - `code` - Required, unique, 3-6 digits
  - `name` - Required, max 255 characters
  - `description` - Optional, max 1000 characters
  - `telco` - Optional, valid telco enum
  - `flow_id` - Optional, exists in flows table

#### 2. UpdateUssdCodeRequest
**File:** `app/Http/Requests/UssdCode/UpdateUssdCodeRequest.php`
- **Purpose:** Validates USSD code update data
- **Validation Rules:** Same as StoreUssdCodeRequest but with `sometimes` rules

### Analytics Requests

#### 1. GetAnalyticsRequest
**File:** `app/Http/Requests/Analytics/GetAnalyticsRequest.php`
- **Purpose:** Validates analytics query parameters
- **Validation Rules:**
  - `start_date` - Optional, date, before or equal to end_date
  - `end_date` - Optional, date, after or equal to start_date
  - `flow_id` - Optional, exists in flows table
  - `ussd_code_id` - Optional, exists in ussd_codes table
  - `event_type` - Optional, valid event type enum
  - `group_by` - Optional, valid grouping option
  - `limit` - Optional, integer, min 1, max 100
  - `page` - Optional, integer, min 1

### Subscription Requests

#### 1. StoreSubscriptionRequest
**File:** `app/Http/Requests/Subscription/StoreSubscriptionRequest.php`
- **Purpose:** Validates subscription creation data
- **Validation Rules:**
  - `plan` - Required, valid plan enum
  - `amount` - Required, numeric, min 0
  - `currency` - Optional, valid currency enum
  - `billing_cycle` - Required, valid billing cycle enum
  - `payment_method` - Required, valid payment method enum
  - `auto_renew` - Optional, boolean
  - `start_date` - Optional, date, after or equal to today

#### 2. UpdateSubscriptionRequest
**File:** `app/Http/Requests/Subscription/UpdateSubscriptionRequest.php`
- **Purpose:** Validates subscription update data
- **Validation Rules:** Same as StoreSubscriptionRequest but with `sometimes` rules

### Payment Requests

#### 1. StorePaymentRequest
**File:** `app/Http/Requests/Payment/StorePaymentRequest.php`
- **Purpose:** Validates payment creation data
- **Validation Rules:**
  - `type` - Required, valid payment type enum
  - `amount` - Required, numeric, min 0.01
  - `currency` - Optional, valid currency enum
  - `payment_method` - Required, valid payment method enum
  - `subscription_id` - Optional, exists in subscriptions table
  - `description` - Optional, max 255 characters
  - `metadata` - Optional, array

#### 2. UpdatePaymentRequest
**File:** `app/Http/Requests/Payment/UpdatePaymentRequest.php`
- **Purpose:** Validates payment update data
- **Validation Rules:**
  - `status` - Optional, valid status enum
  - `gateway_response` - Optional, array
  - `metadata` - Optional, array
  - `paid_at` - Optional, date
  - `refund_reason` - Optional, max 500 characters
  - `refund_amount` - Optional, numeric, min 0.01

## API Resources Layer

### Core Resources

#### 1. UserResource
**File:** `app/Http/Resources/UserResource.php`
- **Purpose:** Transforms User model to API response
- **Fields:** id, name, email, company, phone, country, subscription_plan, is_active, created_at, updated_at

#### 2. FlowResource
**File:** `app/Http/Resources/FlowResource.php`
- **Purpose:** Transforms Flow model to API response
- **Fields:** id, user_id, name, description, flow_data, variables, is_active, category, tags, version, usage_count, created_at, updated_at

#### 3. SessionResource
**File:** `app/Http/Resources/SessionResource.php`
- **Purpose:** Transforms Session model to API response
- **Fields:** id, flow_id, session_id, phone_number, ussd_code, status, current_node, step_count, started_at, last_activity_at, expires_at, completed_at

#### 4. UssdCodeResource
**File:** `app/Http/Resources/UssdCodeResource.php`
- **Purpose:** Transforms UssdCode model to API response
- **Fields:** id, user_id, flow_id, code, name, description, status, telco, settings, usage_count, last_used_at, activated_at

#### 5. AnalyticsResource
**File:** `app/Http/Resources/AnalyticsResource.php`
- **Purpose:** Transforms Analytics model to API response
- **Fields:** id, user_id, flow_id, ussd_code_id, session_id, phone_number, event_type, event_data, node_id, user_input, duration, telco, location, device_info, error_message

#### 6. SubscriptionResource
**File:** `app/Http/Resources/SubscriptionResource.php`
- **Purpose:** Transforms Subscription model to API response
- **Fields:** id, user_id, subscription_id, plan, status, amount, currency, billing_cycle, start_date, end_date, next_billing_date, features, usage_limits, current_usage

#### 7. PaymentResource
**File:** `app/Http/Resources/PaymentResource.php`
- **Purpose:** Transforms Payment model to API response
- **Fields:** id, user_id, subscription_id, payment_id, reference, type, status, amount, currency, payment_method, gateway_response, metadata, description, paid_at, expires_at

## Key Features

### 1. Consistent Error Handling
- All Request classes use `failedValidation()` method for consistent JSON error responses
- All Controllers use try-catch blocks with standardized error responses
- Services throw exceptions that are caught and formatted by Controllers

### 2. Data Validation
- Comprehensive validation rules for all input data
- Custom validation messages and attributes
- Conditional validation based on business rules
- Data preparation and sanitization

### 3. Business Logic Separation
- Controllers handle HTTP concerns only
- Services contain all business logic
- Models handle data relationships and scopes
- Clear separation of concerns

### 4. API Response Standardization
- Consistent JSON response format
- Resource classes for data transformation
- Proper HTTP status codes
- Pagination support where applicable

### 5. Authentication & Authorization
- Laravel Sanctum for API authentication
- Route middleware protection
- User-specific data access
- Admin-only endpoints

## Usage Examples

### Creating a Flow
```php
// Controller
public function store(StoreFlowRequest $request)
{
    $flow = $this->flowService->createFlow($request->validated());
    return response()->json([
        'success' => true,
        'data' => new FlowResource($flow)
    ], 201);
}
```

### Processing Session Input
```php
// Controller
public function processInput(ProcessInputRequest $request, $sessionId)
{
    $result = $this->sessionService->processInput($sessionId, $request->input);
    return response()->json([
        'success' => true,
        'data' => $result
    ]);
}
```

### Getting Analytics
```php
// Controller
public function index(GetAnalyticsRequest $request)
{
    $analytics = $this->analyticsService->getUserAnalytics(
        $request->user()->id,
        $request->validated()
    );
    return AnalyticsResource::collection($analytics);
}
```

This architecture provides a robust, scalable, and maintainable foundation for the USSD Builder API, with clear separation of concerns and comprehensive validation and error handling. 
