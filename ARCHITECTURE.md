# 🏗️ System Architecture

Comprehensive documentation of the Leave Approval Management System architecture.

## Table of Contents
- [High-Level Overview](#high-level-overview)
- [Technology Stack](#technology-stack)
- [System Components](#system-components)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [API Architecture](#api-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Data Flow](#data-flow)
- [Deployment Architecture](#deployment-architecture)
- [Security Architecture](#security-architecture)

---

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         React + Vite Application                      │  │
│  │  - Dashboard, Leave Forms, Approval Board             │  │
│  │  - Real-time Updates, Form Validation                 │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS/REST API
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │     Django REST Framework + SimpleJWT                 │  │
│  │  - Authentication: JWT Tokens                         │  │
│  │  - Authorization: Role-Based Access Control           │  │
│  │  - Versioning: /api/v1/                               │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                 BUSINESS LOGIC LAYER                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ViewSets, Serializers, Permissions                  │  │
│  │  - Leave Management Logic                             │  │
│  │  - User Management Logic                              │  │
│  │  - Email Notifications                                │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │    PostgreSQL Database + Django ORM                   │  │
│  │  - User Management (CustomUser)                       │  │
│  │  - Leave Requests & Tracking                          │  │
│  │  - Audit Logs & History                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Backend

```
Framework: Django 6.0.7
API: Django REST Framework 3.14.0
Authentication: SimpleJWT (JSON Web Tokens)
Database: PostgreSQL 13+
Web Server: Gunicorn
Reverse Proxy: Nginx
Caching: Redis
Task Queue: Celery (optional)
```

### Frontend

```
Framework: React 19.2.7
Build Tool: Vite 8.1.1
Routing: React Router 7.1.0
HTTP Client: Axios 1.11.0
Charts: Recharts 3.1.0
Icons: Lucide React 0.542.0
Styling: CSS Modules / Tailwind CSS
```

### Database

```
Primary: PostgreSQL 13+
Cache: Redis 7+
Search: PostgreSQL Full-Text Search
```

### DevOps

```
Containerization: Docker
Orchestration: Docker Compose
CI/CD: GitHub Actions
Monitoring: ELK Stack (optional)
Error Tracking: Sentry (optional)
```

---

## System Components

### 1. Backend Components

#### accounts/ App
- **CustomUser Model**: Extended user model with role-based access
- **Authentication Views**: Login, Register, Token Refresh
- **Serializers**: User data validation and transformation
- **Permissions**: Custom permission classes for RBAC

#### leaves/ App
- **LeaveRequest Model**: Store leave request details
- **LeaveRequestViewSet**: CRUD operations and custom actions
- **Serializers**: Request/Response data handling
- **Business Logic**: Leave approval workflow

#### core/ App
- **Utilities**: Helper functions and constants
- **Signals**: Event handlers for model changes
- **Management Commands**: Custom Django commands
- **Middleware**: Request processing

#### backend/ (Configuration)
- **settings.py**: Django configuration
- **urls.py**: URL routing
- **wsgi.py**: WSGI application entry point
- **asgi.py**: ASGI application entry point

### 2. Frontend Components

#### Pages
- **Dashboard**: Main landing page with statistics
- **Leave Requests**: List, create, update leave requests
- **Approval Board**: HR approval interface
- **User Management**: Admin user management
- **Settings**: User profile and settings

#### Services
- **api.js**: API client configuration
- **auth.service.js**: Authentication API calls
- **leave.service.js**: Leave management API calls
- **user.service.js**: User management API calls

#### Hooks
- **useAuth()**: Authentication state management
- **useLeaves()**: Leave data management
- **usePagination()**: Pagination logic
- **useNotification()**: Notification display

#### Utilities
- **validators.js**: Form validation
- **formatters.js**: Data formatting
- **constants.js**: Application constants

---

## Database Schema

### Core Tables

```sql
-- Users Table
CREATE TABLE accounts_customuser (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    role VARCHAR(20) DEFAULT 'EMPLOYEE',
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Leave Requests Table
CREATE TABLE leaves_leaverequest (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES accounts_customuser(id),
    leave_type VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    review_comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indices for Performance
CREATE INDEX idx_leave_employee ON leaves_leaverequest(employee_id);
CREATE INDEX idx_leave_status ON leaves_leaverequest(status);
CREATE INDEX idx_leave_dates ON leaves_leaverequest(start_date, end_date);
CREATE INDEX idx_user_role ON accounts_customuser(role);
```

### Relationships

```
CustomUser ──1◄────────────┬──Many─► LeaveRequest
                           │
                           └─ Leave Requests (employee)
```

---

## Authentication & Authorization

### JWT Flow

```
1. User Registration
   └─→ POST /auth/register/
       └─→ Returns: User object

2. User Login
   └─→ POST /auth/login/
       └─→ Returns: { access_token, refresh_token, user }
       └─→ Stored in: localStorage / sessionStorage

3. API Requests
   └─→ Header: Authorization: Bearer {access_token}
       └─→ Validated by: JWTAuthentication

4. Token Refresh
   └─→ POST /auth/token/refresh/
       └─→ Returns: { access_token }
       └─→ Automatic refresh before expiry
```

### Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────┐
│              User Roles & Permissions               │
├─────────────────────────────────────────────────────┤
│ ADMIN                                               │
│  ├─ View all leave requests                         │
│  ├─ Approve/Reject any leave                        │
│  ├─ Manage all users                                │
│  ├─ View system analytics                           │
│  └─ Access admin panel                              │
├─────────────────────────────────────────────────────┤
│ HR                                                  │
│  ├─ View all leave requests                         │
│  ├─ Approve/Reject employee leaves                  │
│  ├─ View employee list                              │
│  └─ Generate reports                                │
├─────────────────────────────────────────────────────┤
│ EMPLOYEE                                            │
│  ├─ Create leave requests                           │
│  ├─ View own leave requests                         │
│  ├─ Update own pending requests                     │
│  ├─ Cancel own requests                             │
│  └─ View leave balance                              │
└─────────────────────────────────────────────────────┘
```

### Permission Classes

```python
class IsAuthenticated(BasePermission):
    """Only authenticated users"""

class IsAdmin(BasePermission):
    """Only admin users"""

class IsHROrAdmin(BasePermission):
    """HR or Admin users"""

class IsOwnerOrAdmin(BasePermission):
    """User or Admin"""
```

---

## API Architecture

### API Structure

```
/api/v1/
├── auth/
│   ├── register/          [POST]
│   ├── login/             [POST]
│   ├── token/refresh/     [POST]
│   ├── me/                [GET, PATCH]
│   └── change-password/   [POST]
├── leaves/
│   ├── leave-requests/    [GET, POST]
│   ├── leave-requests/<id>/
│   │   ├── [GET, PATCH, DELETE]
│   │   ├── approve/       [POST]
│   │   ├── reject/        [POST]
│   │   └── cancel/        [POST]
│   └── leave-history/     [GET]
└── users/
    ├── [GET]              (List users - Admin/HR only)
    ├── <id>/
    │   ├── [GET, PATCH, DELETE]
    │   └── activate/      [POST]
```

### Response Format

**Success Response**:
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**:
```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Error description",
  "details": { ... }
}
```

### Request/Response Cycle

```
1. Client Request
   ├─ Headers: Authorization, Content-Type
   ├─ Path: /api/v1/{resource}/
   ├─ Method: GET, POST, PATCH, DELETE
   └─ Body: JSON data

2. Django Middleware
   ├─ CORS Check
   ├─ CSRF Validation
   └─ Rate Limiting

3. URL Routing
   └─ Maps to ViewSet

4. Authentication
   └─ JWT Token Validation

5. Permission Check
   ├─ IsAuthenticated
   ├─ Role-based (IsHROrAdmin, etc.)
   └─ Object-level permissions

6. Serializer
   ├─ Validation
   ├─ Data Transformation
   └─ Business Rules

7. ViewSet Logic
   ├─ Database Query
   ├─ Business Logic
   └─ Response Generation

8. Response
   └─ JSON Data + Metadata
```

---

## Frontend Architecture

### State Management

```
App.jsx
├── AuthContext
│   └─ Current user, tokens, login/logout
├── NotificationContext
│   └─ Notification messages
└── UIContext
    └─ UI states, modals, dropdowns

Pages
├── Dashboard
│   ├─ useAuth()
│   ├─ useLeaves()
│   └─ useState()
└── LeaveRequests
    ├─ useAuth()
    ├─ useLeaves()
    └─ useState()
```

### Component Hierarchy

```
<App>
├── <Header>
│   ├── <Logo>
│   ├── <Navigation>
│   └── <UserMenu>
├── <Main>
│   ├── <Sidebar>
│   └── <Content>
│       ├── <Dashboard>
│       ├── <LeaveRequestForm>
│       ├── <LeaveTable>
│       └── <ApprovalBoard>
└── <Footer>
```

### Data Flow

```
User Interaction
      ↓
Event Handler
      ↓
API Call (axios)
      ↓
Backend Processing
      ↓
Response JSON
      ↓
State Update (Context/useState)
      ↓
Component Re-render
      ↓
UI Update
```

---

## Data Flow

### Leave Request Workflow

```
Step 1: Employee Creates Request
├─ POST /api/v1/leaves/leave-requests/
├─ Data: { leave_type, start_date, end_date, reason }
├─ Status: PENDING
└─ Stored in: Database

Step 2: HR Receives Notification
├─ Email Notification
├─ Notification Dashboard
└─ List View Updated

Step 3: HR Reviews & Approves/Rejects
├─ GET /api/v1/leaves/leave-requests/{id}/
├─ POST /api/v1/leaves/leave-requests/{id}/approve/
├─ Data: { review_comment }
└─ Status: APPROVED / REJECTED

Step 4: Employee Notified
├─ Email Notification
├─ Dashboard Update
└─ Status Changed

Step 5: Leave Balance Updated
├─ Deduct from total leave balance
├─ Update remaining balance
└─ Generate reports
```

---

## Deployment Architecture

### Development Environment

```
┌──────────────────────────────────────────────┐
│         Developer Machine                    │
├──────────────────────────────────────────────┤
│ Frontend: npm run dev                        │
│ Backend: python manage.py runserver          │
│ Database: SQLite / Local PostgreSQL          │
└──────────────────────────────────────────────┘
```

### Docker Compose Environment

```
┌─────────────────────────────────────────────────────────┐
│                  docker-compose                         │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐ │
│ │  Frontend   │  │   Backend   │  │   PostgreSQL     │ │
│ │ :5173       │  │   :8000     │  │    :5432         │ │
│ │ (Vite Dev)  │  │ (Gunicorn)  │  │                  │ │
│ └─────────────┘  └─────────────┘  └──────────────────┘ │
│                                                         │
│ ┌──────────────────────────────────────────────────────┤
│ │            Redis Cache (Optional)                    │
│ │                :6379                                 │
│ └──────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────┘
```

### Production Environment

```
┌──────────────────────────────────────────────────────────────┐
│                   Production Server                          │
├──────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────┐   │
│ │              Internet (HTTPS)                          │   │
│ └──────────────────────┬─────────────────────────────────┘   │
│                        ↓                                      │
│ ┌────────────────────────────────────────────────────────┐   │
│ │              Nginx (Reverse Proxy)                     │   │
│ │  - SSL/TLS Termination                                 │   │
│ │  - Load Balancing                                      │   │
│ │  - Static File Serving                                 │   │
│ └──────────────────────┬─────────────────────────────────┘   │
│                        ↓                                      │
│ ┌────────────────────────────────────────────────────────┐   │
│ │    Gunicorn (Django Application Server)               │   │
│ │  - Multiple Workers (4-8)                              │   │
│ │  - Timeout: 120s                                       │   │
│ └──────────────────────┬─────────────────────────────────┘   │
│                        ↓                                      │
│ ┌────────────────────────────────────────────────────────┐   │
│ │           PostgreSQL Database                          │   │
│ │  - Connection Pooling                                  │   │
│ │  - Automated Backups                                   │   │
│ │  - Replication (optional)                              │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                               │
│ ┌────────────────────────────────────────────────────────┐   │
│ │              Redis Cache                               │   │
│ │  - Session Storage                                     │   │
│ │  - Application Cache                                   │   │
│ └────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Authentication & Authorization

```
Request
  ├─ Check CORS
  ├─ JWT Token Validation
  ├─ User Identification
  └─ Permission Check
     └─ Role-based authorization
        └─ Allow/Deny
```

### Data Protection

```
┌────────────────────────────────────────┐
│       Data Protection Layers           │
├────────────────────────────────────────┤
│ 1. HTTPS/TLS Encryption (Transport)    │
│ 2. Password Hashing (PBKDF2)           │
│ 3. Database Encryption (optional)      │
│ 4. Token Expiration (Short-lived)      │
│ 5. CSRF Protection                     │
│ 6. XSS Protection                      │
│ 7. SQL Injection Prevention (ORM)      │
└────────────────────────────────────────┘
```

### Infrastructure Security

```
┌─────────────────────────────────────────────────┐
│           Security Measures                     │
├─────────────────────────────────────────────────┤
│ ✓ Environment Variables for Secrets             │
│ ✓ CORS White-listing                            │
│ ✓ Rate Limiting                                 │
│ ✓ Security Headers                              │
│ ✓ Firewall Rules (Security Groups)              │
│ ✓ SSL/TLS Certificates                          │
│ ✓ Automated Backups                             │
│ ✓ Database Access Restrictions                  │
│ ✓ Application Logging & Monitoring              │
│ ✓ Dependency Scanning                           │
└─────────────────────────────────────────────────┘
```

---

## Performance Optimization

### Database Optimization
- Indexed columns for fast queries
- Query optimization with select_related/prefetch_related
- Connection pooling
- Proper pagination

### Caching Strategy
- Redis for session storage
- Application-level caching
- Browser caching for static assets
- CDN for static content delivery

### Frontend Optimization
- Code splitting
- Lazy loading of components
- Minification and compression
- Asset optimization

### Backend Optimization
- Gunicorn with multiple workers
- Connection pooling (psycopg2)
- Query batching
- Response compression (gzip)

---

## Scalability Considerations

### Horizontal Scaling
```
Load Balancer
    ├── Gunicorn Server 1
    ├── Gunicorn Server 2
    ├── Gunicorn Server 3
    └── Gunicorn Server N
         └── PostgreSQL (Central)
```

### Database Scaling
- Master-Slave Replication
- Read Replicas
- Partitioning for large tables
- Archive old data

### Caching Layer
- Redis Cluster
- Memcached
- CDN for static files

---

## Monitoring & Observability

### Metrics to Monitor
- Request latency
- Error rates
- Database query performance
- Cache hit rates
- Server resource usage

### Logging Strategy
- Structured logging (JSON)
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Centralized log aggregation
- Log retention policies

### Error Tracking
- Sentry integration
- Error notifications
- Error rate monitoring
- User impact analysis

---

## Future Enhancements

1. **Microservices Architecture**: Split into independent services
2. **Event-Driven Architecture**: Event bus for asynchronous operations
3. **Message Queue**: Celery for background tasks
4. **API Gateway**: Kong or similar for API management
5. **GraphQL**: GraphQL API alongside REST
6. **Real-time Updates**: WebSockets with Django Channels
7. **Mobile App**: React Native or Flutter
8. **Advanced Analytics**: BI tools integration
9. **Machine Learning**: Leave prediction and insights
10. **Blockchain**: Audit trail immutability

---

## Conclusion

The Leave Approval Management System is built on a robust, scalable, and secure architecture that follows industry best practices. The separation of concerns, modular design, and clear data flow ensure maintainability and extensibility for future enhancements.
