# Flow Management API Documentation

## Base URL
```
/api/flows
```

## Authentication
All endpoints require authentication via Laravel Sanctum. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your_token}
```

## Endpoints

### 1. Get All Flows
**GET** `/api/flows`

Returns all flows for the authenticated user.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "My USSD Flow",
            "description": "A sample USSD flow",
            "flow_data": {...},
            "variables": {...},
            "is_active": true,
            "is_template": false,
            "category": "banking",
            "tags": "payment,transfer",
            "version": 1,
            "usage_count": 0,
            "last_used_at": null,
            "created_at": "2024-01-01T00:00:00.000000Z",
            "updated_at": "2024-01-01T00:00:00.000000Z",
            "user": {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com"
            }
        }
    ]
}
```

### 2. Create New Flow
**POST** `/api/flows`

Creates a new flow for the authenticated user.

**Request Body:**
```json
{
    "name": "My USSD Flow",
    "description": "A sample USSD flow",
    "flow_data": {
        "nodes": [...],
        "edges": [...],
        "viewport": {"x": 0, "y": 0, "zoom": 1}
    },
    "variables": {},
    "is_active": false,
    "is_template": false,
    "category": "banking",
    "tags": "payment,transfer"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Flow created successfully",
    "data": {
        "id": 1,
        "name": "My USSD Flow",
        ...
    }
}
```

### 3. Get Flow Templates
**GET** `/api/flows/templates`

Returns available flow templates. Optionally filter by category.

**Query Parameters:**
- `category` (optional): Filter templates by category

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Banking Template",
            "is_template": true,
            ...
        }
    ]
}
```

### 4. Get Specific Flow
**GET** `/api/flows/{id}`

Returns a specific flow by ID.

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "My USSD Flow",
        ...
    }
}
```

### 5. Update Flow
**PUT** `/api/flows/{id}`

Updates an existing flow. Supports partial updates.

**Request Body:**
```json
{
    "name": "Updated Flow Name",
    "description": "Updated description",
    "flow_data": {...},
    "is_active": true
}
```

**Response:**
```json
{
    "success": true,
    "message": "Flow updated successfully",
    "data": {
        "id": 1,
        "name": "Updated Flow Name",
        ...
    }
}
```

### 6. Delete Flow
**DELETE** `/api/flows/{id}`

Deletes a flow. Cannot delete active flows with usage history.

**Response:**
```json
{
    "success": true,
    "message": "Flow deleted successfully"
}
```

### 7. Duplicate Flow
**POST** `/api/flows/{id}/duplicate`

Creates a copy of an existing flow.

**Response:**
```json
{
    "success": true,
    "message": "Flow duplicated successfully",
    "data": {
        "id": 2,
        "name": "My USSD Flow (Copy)",
        ...
    }
}
```

### 8. Activate Flow
**POST** `/api/flows/{id}/activate`

Activates a flow.

**Response:**
```json
{
    "success": true,
    "message": "Flow activated successfully",
    "data": {
        "id": 1,
        "is_active": true,
        ...
    }
}
```

### 9. Deactivate Flow
**POST** `/api/flows/{id}/deactivate`

Deactivates a flow.

**Response:**
```json
{
    "success": true,
    "message": "Flow deactivated successfully",
    "data": {
        "id": 1,
        "is_active": false,
        ...
    }
}
```

## Error Responses

### Validation Error (422)
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "name": ["Flow name is required"],
        "flow_data": ["Flow data must be an array"]
    }
}
```

### Not Found Error (404)
```json
{
    "success": false,
    "message": "Flow not found"
}
```

### Server Error (500)
```json
{
    "success": false,
    "message": "Failed to create flow"
}
```

## Flow Data Structure

The `flow_data` field contains the visual flow structure:

```json
{
    "nodes": [
        {
            "id": "start",
            "type": "start",
            "position": {"x": 100, "y": 100},
            "data": {
                "label": "Start",
                "message": "Welcome to USSD Service"
            }
        }
    ],
    "edges": [],
    "viewport": {"x": 0, "y": 0, "zoom": 1}
}
```

## Categories

Common flow categories:
- `banking` - Banking and financial services
- `ecommerce` - E-commerce and shopping
- `healthcare` - Healthcare services
- `education` - Educational services
- `entertainment` - Entertainment and media
- `utilities` - Utility services
- `custom` - Custom applications 