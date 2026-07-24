# 📚 API Documentation

Complete API reference for the Leave Approval Management System.

## Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Authentication Endpoints](#authentication-endpoints)
- [User Endpoints](#user-endpoints)
- [Leave Request Endpoints](#leave-request-endpoints)
- [Rate Limiting](#rate-limiting)

---

## Base URL

**Development**:
```
http://localhost:8000/api/v1
```

**Production**:
```
https://yourdomain.com/api/v1
```

---

## Authentication

### JWT Token-Based Authentication

All endpoints (except `/auth/register/` and `/auth/login/`) require JWT authentication.

**Token Types**:
- `access`: Short-lived token (60 minutes)
- `refresh`: Long-lived token (24 hours)

**Usage**:
```
Authorization: Bearer <access_token>
```

**Token Refresh**:
```http
POST /auth/token/refresh/
Content-Type: application/json

{
  "refresh": "your-refresh-token"
}
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "detail": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Invalid username or password |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `INVALID_TOKEN` | 401 | Invalid or malformed JWT token |
| `PERMISSION_DENIED` | 403 | User lacks required permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Authentication Endpoints

### 1. Register User

**Endpoint**:
```http
POST /auth/register/
```

**Access**: Public

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "EMPLOYEE"
}
```

**Error Cases**:
- 400: Username or email already exists
- 400: Password doesn't meet requirements
- 400: Invalid email format

---

### 2. Login

**Endpoint**:
```http
POST /auth/login/
```

**Access**: Public

**Request Body**:
```json
{
  "username": "john_doe",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "EMPLOYEE"
  }
}
```

---

### 3. Refresh Token

**Endpoint**:
```http
POST /auth/token/refresh/
```

**Access**: Public

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## User Endpoints

### 1. Get Current User

**Endpoint**:
```http
GET /auth/me/
```

**Access**: Authenticated

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "EMPLOYEE",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 2. Update Profile

**Endpoint**:
```http
PATCH /auth/me/
```

**Access**: Authenticated

**Request Body**:
```json
{
  "first_name": "Jonathan",
  "last_name": "Smith",
  "email": "jonathan@example.com"
}
```

**Response** (200 OK): Updated user object

---

### 3. Change Password

**Endpoint**:
```http
POST /auth/change-password/
```

**Access**: Authenticated

**Request Body**:
```json
{
  "old_password": "OldPassword123!",
  "new_password": "NewPassword123!",
  "new_password_confirm": "NewPassword123!"
}
```

**Response** (200 OK):
```json
{
  "message": "Password changed successfully"
}
```

---

### 4. List All Users (Admin/HR Only)

**Endpoint**:
```http
GET /users/
```

**Access**: Admin, HR

**Query Parameters**:
```
?role=EMPLOYEE&search=john&page=1
```

**Response** (200 OK):
```json
{
  "count": 42,
  "next": "http://localhost:8000/api/v1/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "EMPLOYEE",
      "first_name": "John",
      "last_name": "Doe"
    }
  ]
}
```

---

## Leave Request Endpoints

### 1. Create Leave Request

**Endpoint**:
```http
POST /leaves/leave-requests/
```

**Access**: Authenticated (Any role)

**Request Body**:
```json
{
  "leave_type": "SICK_LEAVE",
  "start_date": "2024-08-01",
  "end_date": "2024-08-03",
  "reason": "Medical appointment and recovery"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "employee": 1,
  "employee_name": "John Doe",
  "leave_type": "SICK_LEAVE",
  "start_date": "2024-08-01",
  "end_date": "2024-08-03",
  "reason": "Medical appointment and recovery",
  "status": "PENDING",
  "review_comment": "",
  "created_at": "2024-07-25T10:00:00Z"
}
```

**Validation Rules**:
- `start_date` must be today or in future
- `end_date` must be >= `start_date`
- `reason` must be non-empty
- Maximum 30 days per request

---

### 2. List Leave Requests

**Endpoint**:
```http
GET /leaves/leave-requests/
```

**Access**: Authenticated

**Query Parameters**:
```
?status=PENDING&start_date=2024-08-01&page=1&search=vacation
?ordering=-created_at
```

**Response** (200 OK):
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "employee": 1,
      "employee_name": "John Doe",
      "leave_type": "SICK_LEAVE",
      "start_date": "2024-08-01",
      "end_date": "2024-08-03",
      "reason": "Medical appointment",
      "status": "PENDING",
      "review_comment": "",
      "created_at": "2024-07-25T10:00:00Z"
    }
  ]
}
```

**Filters**:
- `status`: PENDING, APPROVED, REJECTED
- `start_date`: Filter by start date
- `end_date`: Filter by end date
- `leave_type`: Type of leave

**Ordering**:
- `created_at`: Order by creation date
- `-created_at`: Reverse order
- `status`: Order by status

---

### 3. Retrieve Leave Request

**Endpoint**:
```http
GET /leaves/leave-requests/{id}/
```

**Access**: Authenticated (Employee can only view own, HR/Admin can view all)

**Response** (200 OK):
```json
{
  "id": 1,
  "employee": 1,
  "employee_name": "John Doe",
  "leave_type": "SICK_LEAVE",
  "start_date": "2024-08-01",
  "end_date": "2024-08-03",
  "reason": "Medical appointment",
  "status": "PENDING",
  "review_comment": "",
  "created_at": "2024-07-25T10:00:00Z"
}
```

---

### 4. Update Leave Request

**Endpoint**:
```http
PATCH /leaves/leave-requests/{id}/
```

**Access**: Employee (own leave), Admin

**Request Body**:
```json
{
  "reason": "Updated reason",
  "start_date": "2024-08-02"
}
```

**Constraints**:
- Only PENDING requests can be updated
- Can only update own requests (unless Admin)

**Response** (200 OK): Updated leave object

---

### 5. Cancel Leave Request

**Endpoint**:
```http
POST /leaves/leave-requests/{id}/cancel/
```

**Access**: Employee (own leave), Admin

**Response** (200 OK):
```json
{
  "id": 1,
  "status": "CANCELLED",
  "message": "Leave request cancelled successfully"
}
```

---

### 6. Approve Leave Request

**Endpoint**:
```http
POST /leaves/leave-requests/{id}/approve/
```

**Access**: HR, Admin only

**Request Body**:
```json
{
  "review_comment": "Approved"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "status": "APPROVED",
  "review_comment": "Approved",
  "updated_at": "2024-07-26T14:30:00Z"
}
```

---

### 7. Reject Leave Request

**Endpoint**:
```http
POST /leaves/leave-requests/{id}/reject/
```

**Access**: HR, Admin only

**Request Body**:
```json
{
  "review_comment": "Insufficient leave balance"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "status": "REJECTED",
  "review_comment": "Insufficient leave balance",
  "updated_at": "2024-07-26T14:30:00Z"
}
```

---

### 8. Delete Leave Request

**Endpoint**:
```http
DELETE /leaves/leave-requests/{id}/
```

**Access**: Employee (own PENDING leave), Admin

**Response** (204 No Content)

---

## Rate Limiting

### Rate Limits

```
Anonymous Users: 100 requests/hour
Authenticated Users: 1000 requests/hour
```

### Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1627289400
```

### 429 Too Many Requests

When rate limit is exceeded:

```json
{
  "detail": "Request was throttled. Expected available in 3600 seconds."
}
```

---

## Pagination

All list endpoints support pagination.

**Default Parameters**:
```
page_size: 20
max_page_size: 100
```

**Request**:
```http
GET /leaves/leave-requests/?page=2&page_size=50
```

**Response**:
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/v1/leaves/?page=3",
  "previous": "http://localhost:8000/api/v1/leaves/?page=1",
  "results": [...]
}
```

---

## Search & Filtering

### Search

Search across multiple fields:

```http
GET /leaves/leave-requests/?search=vacation
```

### Advanced Filtering

```http
GET /leaves/leave-requests/?status=PENDING&start_date=2024-08-01
```

---

## Example Workflows

### Workflow 1: Employee Requesting Leave

```bash
# 1. Register
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "emp1",
    "email": "emp1@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'

# 2. Login
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "emp1",
    "password": "SecurePass123!"
  }'

# 3. Create Leave Request
curl -X POST http://localhost:8000/api/v1/leaves/leave-requests/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "leave_type": "VACATION",
    "start_date": "2024-08-10",
    "end_date": "2024-08-15",
    "reason": "Family vacation"
  }'

# 4. Check Status
curl -X GET http://localhost:8000/api/v1/leaves/leave-requests/ \
  -H "Authorization: Bearer <access_token>"
```

### Workflow 2: HR Approving Leave

```bash
# 1. Login as HR
# ... (login endpoint)

# 2. List Pending Requests
curl -X GET "http://localhost:8000/api/v1/leaves/leave-requests/?status=PENDING" \
  -H "Authorization: Bearer <hr_token>"

# 3. Approve Request
curl -X POST http://localhost:8000/api/v1/leaves/leave-requests/1/approve/ \
  -H "Authorization: Bearer <hr_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "review_comment": "Approved. Enjoy your vacation!"
  }'
```

---

## Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123!"}'

# Login
RESPONSE=$(curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"Test123!"}')

TOKEN=$(echo $RESPONSE | jq -r '.access')

# Make authenticated request
curl -X GET http://localhost:8000/api/v1/leaves/leave-requests/ \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Import the collection: `postman_collection.json`
2. Set `base_url` environment variable
3. Run requests from the collection

### Using Python

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"

# Register
resp = requests.post(f"{BASE_URL}/auth/register/", json={
    "username": "test",
    "email": "test@test.com",
    "password": "Test123!"
})

# Login
resp = requests.post(f"{BASE_URL}/auth/login/", json={
    "username": "test",
    "password": "Test123!"
})
token = resp.json()['access']

# Make authenticated request
headers = {"Authorization": f"Bearer {token}"}
resp = requests.get(f"{BASE_URL}/leaves/leave-requests/", headers=headers)
print(resp.json())
```

---

## API Versioning

Current API version: **v1**

Future versions will be available at:
```
/api/v2/
/api/v3/
```

Backward compatibility is maintained for 6 months after new version release.

---

## Support

For API issues and questions:
- GitHub Issues: [link]
- Email: [email]
- Documentation: [docs_link]
