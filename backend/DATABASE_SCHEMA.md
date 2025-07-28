# Database Schema Documentation

## Overview

The USSD Builder application uses a comprehensive database schema designed to support USSD flow management, session handling, analytics, subscriptions, and payments. This document outlines all tables, their relationships, and key features.

## Database Tables

### 1. Users Table
**File:** `2014_10_12_000000_create_users_table.php`

**Purpose:** Store user account information and subscription details.

**Key Fields:**
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `company` - Company name (optional)
- `phone` - Phone number (optional)
- `country` - Country (default: Ghana)
- `subscription_plan` - Current plan (starter/professional/enterprise)
- `is_active` - Account status
- `is_admin` - Admin privileges
- `settings` - JSON user preferences
- `last_login_at` - Last login timestamp

**Relationships:**
- Has many `flows`
- Has many `ussdCodes`
- Has many `subscriptions`
- Has many `payments`
- Has many `sessions`
- Has many `analytics`

### 2. Flows Table
**File:** `2025_07_24_113431_create_flows_table.php`

**Purpose:** Store USSD flow definitions and configurations.

**Key Fields:**
- `id` - Primary key
- `user_id` - Foreign key to users
- `name` - Flow name
- `description` - Flow description
- `flow_data` - JSON flow structure (nodes, edges, viewport)
- `variables` - JSON custom variables
- `is_active` - Flow status
- `is_template` - Template flag
- `category` - Flow category
- `tags` - Comma-separated tags
- `version` - Flow version
- `usage_count` - Total usage
- `last_used_at` - Last usage timestamp

**Relationships:**
- Belongs to `user`
- Has many `sessions`
- Has many `ussdCodes`
- Has many `analytics`

### 3. Sessions Table
**File:** `2025_01_01_000001_create_sessions_table.php`

**Purpose:** Track USSD session state and user interactions.

**Key Fields:**
- `id` - Primary key
- `flow_id` - Foreign key to flows
- `session_id` - Unique session identifier
- `phone_number` - User's phone number
- `ussd_code` - USSD code being used
- `status` - Session status (active/completed/expired/terminated)
- `session_data` - JSON current session state
- `user_inputs` - JSON user inputs during session
- `current_node` - Current node in flow
- `step_count` - Number of steps taken
- `started_at` - Session start time
- `last_activity_at` - Last activity time
- `expires_at` - Session expiration time
- `completed_at` - Session completion time

**Relationships:**
- Belongs to `flow`
- Belongs to `user` (via flow)

### 4. USSD Codes Table
**File:** `2025_01_01_000002_create_ussd_codes_table.php`

**Purpose:** Manage USSD code assignments and configurations.

**Key Fields:**
- `id` - Primary key
- `user_id` - Foreign key to users
- `flow_id` - Foreign key to flows (optional)
- `code` - USSD code (e.g., "123")
- `name` - Display name
- `description` - Code description
- `status` - Code status (active/inactive/pending/suspended)
- `telco` - Telecom provider (mtn/telecel/AirtelTigo/all)
- `settings` - JSON code-specific settings
- `usage_count` - Total usage
- `last_used_at` - Last usage timestamp
- `activated_at` - Activation timestamp

**Relationships:**
- Belongs to `user`
- Belongs to `flow`
- Has many `sessions` (via ussd_code field)
- Has many `analytics`

### 5. Analytics Table
**File:** `2025_01_01_000003_create_analytics_table.php`

**Purpose:** Track usage analytics and events.

**Key Fields:**
- `id` - Primary key
- `user_id` - Foreign key to users
- `flow_id` - Foreign key to flows (optional)
- `ussd_code_id` - Foreign key to ussd_codes (optional)
- `session_id` - Session identifier
- `phone_number` - User's phone number
- `event_type` - Event type (session_started, node_visited, etc.)
- `event_data` - JSON event-specific data
- `node_id` - Node where event occurred
- `user_input` - User input if applicable
- `duration` - Duration in seconds
- `telco` - Telecom provider
- `location` - Geographic location
- `device_info` - Device information
- `error_message` - Error message if any

**Relationships:**
- Belongs to `user`
- Belongs to `flow`
- Belongs to `ussdCode`

### 6. Subscriptions Table
**File:** `2025_01_01_000004_create_subscriptions_table.php`

**Purpose:** Manage user subscriptions and billing.

**Key Fields:**
- `id` - Primary key
- `user_id` - Foreign key to users
- `subscription_id` - External subscription ID
- `plan` - Subscription plan (starter/professional/enterprise)
- `status` - Subscription status (active/inactive/cancelled/expired/pending)
- `amount` - Subscription amount
- `currency` - Currency (default: GHS)
- `billing_cycle` - Billing frequency (monthly/quarterly/yearly)
- `start_date` - Subscription start date
- `end_date` - Subscription end date
- `next_billing_date` - Next billing date
- `cancelled_at` - Cancellation timestamp
- `features` - JSON plan features
- `usage_limits` - JSON usage limits
- `current_usage` - JSON current usage statistics

**Relationships:**
- Belongs to `user`
- Has many `payments`

### 7. Payments Table
**File:** `2025_01_01_000005_create_payments_table.php`

**Purpose:** Track payment transactions and gateway responses.

**Key Fields:**
- `id` - Primary key
- `user_id` - Foreign key to users
- `subscription_id` - Foreign key to subscriptions (optional)
- `payment_id` - External payment ID
- `reference` - Payment reference
- `type` - Payment type (subscription/ussd_code/addon/credit)
- `status` - Payment status (pending/processing/completed/failed/cancelled/refunded)
- `amount` - Payment amount
- `currency` - Currency (default: GHS)
- `payment_method` - Payment method (flutterwave/paystack/momo/card/bank_transfer)
- `gateway_response` - Gateway response data
- `metadata` - JSON additional payment data
- `description` - Payment description
- `paid_at` - Payment completion timestamp
- `expires_at` - Payment expiration timestamp

**Relationships:**
- Belongs to `user`
- Belongs to `subscription`

## Model Relationships

### User Model
```php
// One-to-Many Relationships
public function flows() { return $this->hasMany(Flow::class); }
public function ussdCodes() { return $this->hasMany(UssdCode::class); }
public function subscriptions() { return $this->hasMany(Subscription::class); }
public function payments() { return $this->hasMany(Payment::class); }
public function sessions() { return $this->hasMany(Session::class); }
public function analytics() { return $this->hasMany(Analytics::class); }
```

### Flow Model
```php
// Many-to-One Relationships
public function user() { return $this->belongsTo(User::class); }

// One-to-Many Relationships
public function sessions() { return $this->hasMany(Session::class); }
public function ussdCodes() { return $this->hasMany(UssdCode::class); }
public function analytics() { return $this->hasMany(Analytics::class); }
```

### Session Model
```php
// Many-to-One Relationships
public function flow() { return $this->belongsTo(Flow::class); }
public function user() { return $this->belongsTo(User::class); }
```

### UssdCode Model
```php
// Many-to-One Relationships
public function user() { return $this->belongsTo(User::class); }
public function flow() { return $this->belongsTo(Flow::class); }

// One-to-Many Relationships
public function sessions() { return $this->hasMany(Session::class, 'ussd_code', 'code'); }
public function analytics() { return $this->hasMany(Analytics::class); }
```

### Analytics Model
```php
// Many-to-One Relationships
public function user() { return $this->belongsTo(User::class); }
public function flow() { return $this->belongsTo(Flow::class); }
public function ussdCode() { return $this->belongsTo(UssdCode::class); }
```

### Subscription Model
```php
// Many-to-One Relationships
public function user() { return $this->belongsTo(User::class); }

// One-to-Many Relationships
public function payments() { return $this->hasMany(Payment::class); }
```

### Payment Model
```php
// Many-to-One Relationships
public function user() { return $this->belongsTo(User::class); }
public function subscription() { return $this->belongsTo(Subscription::class); }
```

## Key Features

### 1. Session Management
- **Session Tracking:** Complete session lifecycle management
- **State Persistence:** JSON-based session state storage
- **User Input History:** Track all user inputs during sessions
- **Session Expiration:** Automatic session timeout handling

### 2. USSD Code Management
- **Code Assignment:** Assign USSD codes to flows
- **Telco Support:** Support for multiple telecom providers
- **Code Status:** Active, inactive, pending, suspended states
- **Usage Tracking:** Monitor code usage and performance

### 3. Analytics & Reporting
- **Event Tracking:** Comprehensive event logging
- **Performance Metrics:** Session duration, completion rates
- **User Behavior:** Input patterns, node visits
- **Error Tracking:** Error occurrence and resolution

### 4. Subscription Management
- **Plan Management:** Starter, Professional, Enterprise plans
- **Feature Control:** Plan-based feature access
- **Usage Limits:** Monthly usage restrictions
- **Billing Cycles:** Flexible billing options

### 5. Payment Integration
- **Multiple Gateways:** Flutterwave, Paystack, Mobile Money
- **Payment Tracking:** Complete payment lifecycle
- **Gateway Responses:** Store gateway-specific data
- **Metadata Support:** Flexible payment data storage

## Indexes for Performance

### Users Table
- `email` - Unique email lookups
- `subscription_plan, is_active` - Plan-based queries

### Flows Table
- `user_id, is_active` - User's active flows
- `category, is_template` - Template filtering

### Sessions Table
- `session_id` - Session lookups
- `phone_number` - Phone-based queries
- `ussd_code` - Code-based queries
- `status` - Status filtering
- `flow_id, status` - Flow-specific sessions
- `last_activity_at` - Activity-based queries

### USSD Codes Table
- `code` - Code lookups
- `status` - Status filtering
- `telco` - Telco-based queries
- `user_id, status` - User's codes
- `flow_id, status` - Flow-specific codes

### Analytics Table
- `user_id, created_at` - User analytics
- `flow_id, created_at` - Flow analytics
- `ussd_code_id, created_at` - Code analytics
- `event_type, created_at` - Event-based queries
- `phone_number, created_at` - Phone-based analytics
- `session_id` - Session-specific analytics
- `created_at` - Time-based queries

### Subscriptions Table
- `user_id, status` - User subscriptions
- `subscription_id` - External ID lookups
- `plan, status` - Plan-based queries
- `end_date` - Expiration queries
- `next_billing_date` - Billing queries

### Payments Table
- `user_id, status` - User payments
- `subscription_id, status` - Subscription payments
- `payment_id` - External payment lookups
- `reference` - Reference lookups
- `type, status` - Payment type queries
- `payment_method, status` - Method-based queries
- `created_at` - Time-based queries

## Data Integrity

### Foreign Key Constraints
- All foreign keys have proper constraints
- Cascade deletes where appropriate
- Set null for optional relationships

### Unique Constraints
- User email addresses
- USSD codes
- Session IDs
- Payment references
- Subscription IDs

### Validation Rules
- Email format validation
- Phone number validation
- USSD code format validation
- Amount validation (positive numbers)
- Date validation (logical date ranges)

## Scalability Considerations

### Partitioning Strategy
- Analytics table can be partitioned by date
- Sessions table can be partitioned by month
- Payments table can be partitioned by year

### Archival Strategy
- Old sessions can be archived after 90 days
- Old analytics can be archived after 1 year
- Completed payments can be archived after 2 years

### Performance Optimization
- Proper indexing on frequently queried columns
- JSON columns for flexible data storage
- Efficient relationship queries
- Optimized date range queries 
