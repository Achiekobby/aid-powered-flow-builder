# USSD Builder - Authentication System Documentation

## Overview
This document outlines the modular authentication system built for the USSD Builder platform. The system follows industry standards and is designed to be scalable, maintainable, and secure.

## Architecture

### 1. Service Layer (`AuthService`)
**Location:** `app/Services/AuthService.php`

**Purpose:** Contains all business logic for authentication operations.

**Key Methods:**
- `register(array $data)` - User registration with transaction handling
- `validateRegistrationData(array $data)` - Business rule validation
- `canRegister(array $data)` - Check if user can register
- `getDefaultSettings()` - Get default user settings

**Features:**
- Database transaction handling
- Comprehensive error handling
- Business rule validation
- Default user settings management

### 2. Controller Layer (`AuthController`)
**Location:** `app/Http/Controllers/Auth/AuthController.php`

**Purpose:** Handles HTTP requests and responses for authentication.

**Key Methods:**
- `register(RegisterRequest $request)` - User registration endpoint
- `user(Request $request)` - Get authenticated user
- `logout(Request $request)` - User logout
- `checkEmail(Request $request)` - Check email availability

**Features:**
- Dependency injection with AuthService
- Comprehensive error handling and logging
- Consistent JSON response format
- Input validation through Form Requests

### 3. Validation Layer (`RegisterRequest`)
**Location:** `app/Http/Requests/Auth/RegisterRequest.php`

**Purpose:** Handles input validation and sanitization.

**Validation Rules:**
- Name: required, string, 2-255 characters
- Email: required, valid email, unique, max 255 characters
- Password: required, minimum 8 characters, confirmed
- Company: optional, string, max 255 characters
- Phone: optional, string, max 20 characters, unique
- Country: optional, string, max 100 characters

**Features:**
- Custom validation messages
- Input sanitization (trim, lowercase email)
- Automatic validation failure handling
- Custom attribute names

### 4. Response Layer (`UserResource`)
**Location:** `app/Http/Resources/UserResource.php`

**Purpose:** Formats user data for API responses.

**Features:**
- Consistent data structure
- Hidden sensitive fields
- Formatted timestamps
- All user attributes included

## API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "password_confirmation": "Password123",
    "company": "Test Company",
    "phone": "+233244123456",
    "country": "Ghana"
}
```

**Success Response (201):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "company": "Test Company",
            "phone": "+233244123456",
            "country": "Ghana",
            "subscription_plan": "starter",
            "is_active": true,
            "settings": {...},
            "created_at": "2024-01-01T00:00:00.000000Z"
        },
        "token": "1|abc123...",
        "token_type": "Bearer"
    }
}
```

#### 2. Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "Password123"
}
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "company": "Test Company",
            "phone": "+233244123456",
            "country": "Ghana",
            "subscription_plan": "starter",
            "is_active": true,
            "settings": {...},
            "last_login_at": "2024-01-01T00:00:00.000000Z"
        },
        "token": "1|abc123...",
        "token_type": "Bearer"
    }
}
```

**Error Response (401):**
```json
{
    "success": false,
    "message": "Invalid credentials"
}
```

#### 3. Check Email Availability
```
GET /api/auth/check-email?email=john@example.com
```

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "email": "john@example.com",
        "exists": false
    }
}
```

### Protected Endpoints (Authentication Required)

#### 1. Get Authenticated User
```
GET /api/auth/user
```

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        ...
    }
}
```

#### 2. Logout User
```
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

## Error Handling

### Validation Errors (422)
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["This email is already registered"],
        "password": ["Password must be at least 8 characters"]
    }
}
```

### Server Errors (500)
```json
{
    "success": false,
    "message": "Registration failed. Please try again."
}
```

### Authentication Errors (401)
```json
{
    "success": false,
    "message": "User not authenticated"
}
```

### Login Errors (401)
```json
{
    "success": false,
    "message": "Invalid credentials"
}
```

```json
{
    "success": false,
    "message": "Account is deactivated. Please contact support."
}
```

## Security Features

### 1. Password Security
- Minimum 8 characters
- Must contain uppercase, lowercase, and number
- Hashed using Laravel's built-in hashing
- Password confirmation required

### 2. Token Management
- Laravel Sanctum for API tokens
- Automatic token revocation on logout
- Secure token generation

### 3. Input Sanitization
- Email addresses converted to lowercase
- Whitespace trimmed from all inputs
- SQL injection prevention through Eloquent ORM

### 4. Validation
- Server-side validation for all inputs
- Custom validation messages
- Business rule validation in service layer

## Testing

### Running Tests
```bash
# Run all authentication tests
php artisan test --filter=RegistrationTest

# Run specific test
php artisan test tests/Feature/Auth/RegistrationTest.php
```

### Test Coverage
- Successful registration and login
- Validation failures
- Duplicate email handling
- Password strength validation
- Business rule validation
- Invalid credentials handling
- Inactive account handling
- Case insensitive email login

## Usage Examples

### 1. Register a New User
```php
use App\Services\AuthService;

$authService = new AuthService();

$userData = [
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => 'Password123',
    'password_confirmation' => 'Password123',
    'company' => 'Test Company'
];

$result = $authService->register($userData);

if ($result['success']) {
    $user = $result['user'];
    $token = $result['token'];
    // Handle success
} else {
    // Handle error
}
```

### 2. Login a User
```php
$loginData = [
    'email' => 'john@example.com',
    'password' => 'Password123'
];

$result = $authService->login($loginData);

if ($result['success']) {
    $user = $result['user'];
    $token = $result['token'];
    // Handle success
} else {
    // Handle error
}
```

### 3. Validate Registration Data
```php
$canRegister = $authService->canRegister($userData);

if (!$canRegister['can_register']) {
    $errors = $canRegister['errors'];
    // Handle validation errors
}
```

## Extensibility

### Adding New Authentication Methods
1. Add new methods to `AuthService`
2. Create corresponding Form Request classes
3. Add new endpoints to `AuthController`
4. Update API routes
5. Add tests for new functionality

### Customizing Validation Rules
1. Modify `RegisterRequest` validation rules
2. Add custom validation methods to `AuthService`
3. Update error messages as needed

### Adding New User Fields
1. Update database migration
2. Add fields to User model `$fillable` array
3. Update `UserResource` for API responses
4. Modify validation rules in `RegisterRequest`
5. Update tests

## Best Practices

### 1. Code Organization
- Business logic in Service layer
- HTTP handling in Controller layer
- Validation in Form Request classes
- Response formatting in Resource classes

### 2. Error Handling
- Comprehensive try-catch blocks
- Detailed error logging
- User-friendly error messages
- Proper HTTP status codes

### 3. Security
- Input validation and sanitization
- Password strength requirements
- Token-based authentication
- Database transaction handling

### 4. Testing
- Unit tests for service layer
- Feature tests for API endpoints
- Comprehensive validation testing
- Error scenario testing

## Dependencies

### Required Packages
- Laravel Sanctum (API authentication)
- Laravel Framework (core functionality)

### Optional Packages
- Laravel Telescope (debugging)
- Laravel Horizon (queue management)

## Configuration

### Environment Variables
```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### Database Configuration
Ensure your database is properly configured in `.env` file.

## Troubleshooting

### Common Issues

1. **Token Not Working**
   - Check if Sanctum is properly configured
   - Verify token is included in Authorization header
   - Ensure token hasn't expired

2. **Validation Errors**
   - Check validation rules in RegisterRequest
   - Verify business rules in AuthService
   - Review error messages

3. **Database Errors**
   - Run migrations: `php artisan migrate`
   - Check database connection
   - Verify table structure

### Debug Mode
Enable debug mode in `.env` for detailed error messages:
```env
APP_DEBUG=true
``` 
