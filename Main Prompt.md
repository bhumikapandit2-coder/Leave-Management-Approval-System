# Leave Approval Management System - Full Stack Project Prompt

Build a production-ready, portfolio-worthy Leave Approval Management System using Python Django for the backend, React for the frontend, and MySQL for the database.

This project must go beyond a basic CRUD application. It should demonstrate advanced full-stack development skills, real-world software engineering practices, secure architecture, scalability, testing, documentation, deployment readiness, and professional UI/UX.

---

## 1. Project Overview

Create a modern employee leave management system for organizations with three user roles:
- Admin
- HR
- Employee

The system should allow employees to request leave, HR to approve/reject leave and manage employee records, and Admin to oversee system-wide operations, analytics, users, logs, and audit activities.

The application should be fully integrated end-to-end, with every frontend page connected to backend APIs.

---

## 2. Backend Requirements (Django + Python)

### Core Backend Stack
- Django
- Django REST Framework (DRF)
- Custom User Model
- JWT Authentication using Simple JWT
- Role-Based Access Control (Admin, HR, Employee)
- RESTful APIs
- ModelViewSet
- Generic Views
- API Versioning
- API Throttling / Rate Limiting
- Pagination
- Search
- Filtering
- Ordering
- Custom Permissions
- Custom Middleware
- Custom Validators
- Signals
- Custom Management Commands
- File Upload API
- Image Upload API
- Email Service
- Logging
- Exception Handling
- Serializer Validation
- Environment Variables using .env
- Database Transactions
- Optimized ORM Queries using select_related and prefetch_related
- Caching with Redis
- Background Tasks using Celery
- Swagger/OpenAPI Documentation
- Unit Testing
- Integration Testing
- API Testing with Postman Collection
- Database Migrations
- Soft Delete
- Audit Logs
- Activity Tracking

### Backend Functional Requirements
- Secure authentication and authorization
- Employee registration and profile management
- Leave request creation, update, cancellation, approval, and rejection
- Leave balance tracking
- Holiday management
- Attendance summary views
- Leave reports and analytics
- Notifications for leave status changes
- Password reset via email
- Welcome email on registration
- File/image upload support for employee documents and profiles

---

## 3. Database Requirements (MySQL)

Design a normalized relational database with proper relationships and constraints.

### Required Database Features
- Foreign Keys
- OneToOne Fields
- ManyToMany Fields
- Indexing
- Constraints
- Unique Fields
- Transactions

### Suggested Core Models
- User / CustomUser
- EmployeeProfile
- Department
- Designation
- LeaveType
- LeaveRequest
- LeaveApprovalHistory
- Holiday
- Attendance
- Notification
- ActivityLog
- AuditLog
- Role / Permission mapping

Ensure proper database relationships and efficient queries.

---

## 4. Frontend Requirements (React)

### Core Frontend Stack
- React
- React Router
- Context API or Redux Toolkit
- Axios
- Axios Interceptors
- Protected Routes
- Lazy Loading
- Code Splitting
- Reusable Components
- Custom Hooks
- Form Validation
- Toast Notifications
- Error Boundaries
- Responsive Design
- Dark Mode
- Charts using Chart.js or Recharts
- Pagination
- Search
- Filters
- Loading Skeleton
- Modal Components
- Confirmation Dialogs

### Frontend Functional Requirements
- Login / Registration / Forgot Password pages
- Role-based dashboards for Admin, HR, and Employee
- Fully connected API-driven pages
- Dynamic charts and reports
- Leave request form
- Leave history timeline
- Notifications panel
- Activity history UI
- Admin and HR management screens

---

## 5. Role-Based Module Requirements

### Admin Dashboard
Include:
- Employee Analytics
- Leave Analytics
- Department-wise Reports
- Monthly Leave Reports
- Active Users
- Recent Activities
- System Logs
- Audit Logs
- Charts and Graphs
- Export PDF
- Export Excel

### HR Module
HR users must have permissions to:
- Manage employees
- View leave reports
- Approve or reject leave
- Generate monthly reports
- Export reports
- Manage holidays
- View attendance summary

### Employee Dashboard
Include:
- Profile Completion
- Leave Balance
- Leave Calendar
- Upcoming Holidays
- Team Leave Calendar
- Leave Timeline
- Notifications
- Activity History

---

## 6. Notification Requirements

Implement:
- In-App Notifications
- Email Notifications
- Leave Status Updates
- Password Reset Emails
- Welcome Email

---

## 7. API Documentation Requirements

Generate complete and professional API documentation including:
- API Endpoints
- Request Body
- Response Body
- Error Responses
- Authentication Flow
- Swagger/OpenAPI
- Postman Collection

---

## 8. Security Requirements

Implement strong security practices:
- Password Hashing
- Secure JWT Authentication
- CORS Configuration
- CSRF Protection
- XSS Protection
- SQL Injection Protection
- Input Validation
- File Upload Validation
- Environment Variables
- Secure Secret Keys

---

## 9. Deployment Requirements

Provide deployment-ready configuration for:

### Backend
- Docker
- Docker Compose
- Gunicorn
- Nginx
- Render
- Railway

### Frontend
- Netlify
- Vercel

### Database
- MySQL

---

## 10. CI/CD Requirements

Configure:
- GitHub Actions
- Automatic Testing
- Automatic Deployment
- Code Quality Checks

---

## 11. Documentation Requirements

Generate:
- Professional README.md
- Installation Guide
- API Documentation
- ER Diagram
- Database Schema
- System Architecture Diagram
- Sequence Diagram
- Flow Charts
- Screenshots
- Deployment Guide

---

## 12. Code Quality Requirements

Follow:
- PEP 8 Coding Standards
- Clean Architecture
- SOLID Principles
- DRY Principle
- Modular Code
- Reusable Components
- Type Hints
- Docstrings

---

## 13. Final Expectations

The final project should be:
- Production-ready
- Scalable
- Secure
- Portfolio-worthy
- Suitable for technical interviews at companies such as TCS, Infosys, Accenture, Cognizant, Capgemini, Deloitte, and other product or service-based companies

Every frontend page must be fully connected to backend APIs.

Every API must be tested, documented, validated, and optimized.

No placeholder code, dummy implementation, or incomplete feature should remain.

---

## 14. Deliverables Expected

The completed solution should include:
- Full Django backend with DRF APIs
- React frontend with modern UI
- MySQL database design and migrations
- Authentication and role-based access
- Leave workflow and analytics
- Notifications and email integration
- Testing suite and API docs
- Deployment configuration and CI/CD setup
- Professional documentation
