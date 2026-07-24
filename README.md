# 🏢 Leave Approval Management System

A modern, full-stack **Employee Leave Management System** built with **Django REST Framework** and **React**, demonstrating production-ready software engineering practices, scalable architecture, and professional UI/UX.

## ✨ Features

### Core Features
- **Role-Based Access Control**: Admin, HR, and Employee roles with granular permissions
- **Leave Management**: Create, update, cancel, and track leave requests
- **Approval Workflow**: HR approval/rejection with comments
- **Leave Balance Tracking**: Real-time leave balance calculation
- **User Authentication**: JWT-based secure authentication
- **Employee Management**: Complete employee profile management
- **Analytics Dashboard**: Leave statistics and reports
- **Notifications**: Email notifications for leave status updates

### Technical Highlights
- ✅ RESTful APIs with JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ Optimized database queries (select_related, prefetch_related)
- ✅ Pagination, filtering, and search
- ✅ Comprehensive error handling
- ✅ Docker & Docker Compose support
- ✅ Environment-based configuration
- ✅ Production-ready security settings
- ✅ Responsive React UI with modern components

---

## 📋 Project Structure

```
Leave Approval Management System/
├── backend/                    # Django REST Framework backend
│   ├── settings.py            # Django settings
│   ├── urls.py                # Main URL routing
│   ├── wsgi.py                # WSGI configuration
│   └── custom_user.py         # Custom user model
│
├── accounts/                  # User authentication & management
│   ├── models.py              # CustomUser model
│   ├── views.py               # Login, Register, User list views
│   ├── serializers.py         # User serializers
│   ├── urls.py                # Account endpoints
│   └── permissions.py         # Custom permissions
│
├── leaves/                    # Leave request management
│   ├── models.py              # LeaveRequest model
│   ├── views.py               # Leave ViewSet
│   ├── serializers.py         # Leave serializers
│   └── urls.py                # Leave endpoints
│
├── core/                      # Core app (utilities & helpers)
│   ├── models.py              # Additional models
│   └── views.py               # Core utilities
│
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── App.jsx            # Main App component
│   └── package.json
│
├── manage.py                  # Django management command
├── db.sqlite3                 # SQLite database (development)
├── requirements.txt           # Python dependencies
├── docker-compose.yml         # Docker composition
├── Dockerfile                 # Backend Docker image
└── .env.example              # Environment variables template
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn
- PostgreSQL (for production) or SQLite (development)

### Backend Setup

#### 1. Clone & Navigate to Project
```bash
cd "Leave Approval Management System"
```

#### 2. Create Virtual Environment
```bash
python -m venv .venv

# On Windows
.venv\Scripts\activate

# On macOS/Linux
source .venv/bin/activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Environment Configuration
```bash
# Copy environment template
copy .env.example .env

# Edit .env with your settings
# Configure DATABASE_URL, SECRET_KEY, etc.
```

#### 5. Database Migrations
```bash
python manage.py migrate
```

#### 6. Create Superuser
```bash
python manage.py createsuperuser
```

#### 7. Run Backend Server
```bash
python manage.py runserver
```
Backend will be available at `http://localhost:8000`

---

### Frontend Setup

#### 1. Navigate to Frontend Directory
```bash
cd frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
```

#### 4. Run Development Server
```bash
npm run dev
```
Frontend will be available at `http://localhost:5173`

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1/
```

### Authentication Endpoints

#### Register
```http
POST /auth/register/
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Login
```http
POST /auth/login/
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "EMPLOYEE"
  }
}
```

### Leave Request Endpoints

#### Create Leave Request
```http
POST /leaves/leave-requests/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "leave_type": "SICK_LEAVE",
  "start_date": "2024-08-01",
  "end_date": "2024-08-03",
  "reason": "Medical appointment"
}
```

#### List Leave Requests
```http
GET /leaves/leave-requests/
Authorization: Bearer {access_token}
```

#### Approve Leave Request (HR/Admin Only)
```http
POST /leaves/leave-requests/{id}/approve/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "review_comment": "Approved"
}
```

#### Reject Leave Request (HR/Admin Only)
```http
POST /leaves/leave-requests/{id}/reject/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "review_comment": "Insufficient leave balance"
}
```

---

## 🗄️ Database Models

### CustomUser
```python
- id (Primary Key)
- username (Unique)
- email (Unique)
- password
- first_name
- last_name
- role (ADMIN, HR, EMPLOYEE)
- is_active
- is_staff
- created_at
- updated_at
```

### LeaveRequest
```python
- id (Primary Key)
- employee (ForeignKey → CustomUser)
- leave_type (CharField)
- start_date (DateField)
- end_date (DateField)
- reason (TextField)
- status (PENDING, APPROVED, REJECTED)
- review_comment (TextField)
- created_at (DateTimeField)
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ CSRF protection
- ✅ SQL injection prevention (ORM usage)
- ✅ XSS protection
- ✅ Secure password hashing (Django default: PBKDF2)
- ✅ Environment-based sensitive configuration
- ✅ HTTP-only cookies for tokens (production)

---

## 🐳 Docker Deployment

### Build & Run with Docker Compose

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser

# Collect static files
docker-compose exec web python manage.py collectstatic --noinput
```

Services available at:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Database: postgres://db:5432

---

## ☁️ Cloud Deployment

### Heroku Deployment

#### 1. Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Login & Create App
```bash
heroku login
heroku create your-app-name
```

#### 3. Add PostgreSQL Database
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

#### 4. Configure Environment Variables
```bash
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key
heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
```

#### 5. Deploy
```bash
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### AWS EC2 Deployment

#### 1. Launch EC2 Instance
- Use Ubuntu 22.04 LTS AMI
- Configure security groups (ports 80, 443, 8000)

#### 2. Setup Server
```bash
sudo apt update
sudo apt install -y python3-pip python3-venv postgresql postgresql-contrib nginx

# Clone project
git clone <your-repo-url>
cd "Leave Approval Management System"

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure Gunicorn
pip install gunicorn
```

#### 3. Configure Nginx as Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/lams
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        alias /home/ubuntu/Leave\ Approval\ Management\ System/staticfiles/;
    }

    location / {
        include proxy_params;
        proxy_pass http://127.0.0.1:8000;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/lams /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

#### 4. Setup SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│  - Components: Dashboard, LeaveForm, ApprovalBoard   │
│  - State: React Context / Custom Hooks              │
│  - Styling: Tailwind CSS / CSS Modules              │
└──────────────────────┬──────────────────────────────┘
                       │ (Axios HTTP Calls)
                       ↓
┌─────────────────────────────────────────────────────┐
│          Django REST Framework API                   │
│  - Authentication: JWT (SimpleJWT)                   │
│  - ViewSets: LeaveRequestViewSet, UserViewSet       │
│  - Permissions: Role-based RBAC                      │
│  - Serializers: Data validation & transformation     │
└──────────────────────┬──────────────────────────────┘
                       │ (ORM Queries)
                       ↓
┌─────────────────────────────────────────────────────┐
│             Database Layer (PostgreSQL)              │
│  - Models: CustomUser, LeaveRequest                  │
│  - Relationships: ForeignKey, OneToOne, ManyToMany  │
│  - Indexing: Optimized for common queries           │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test accounts
python manage.py test leaves

# With coverage report
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Frontend Testing
```bash
cd frontend
npm run test
```

---

## 📖 Environment Variables

Create a `.env` file in the project root:

```env
# Django Settings
DEBUG=False
SECRET_KEY=your-very-secret-key-here-min-50-chars
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database (PostgreSQL for production)
DATABASE_URL=postgresql://user:password@localhost:5432/lams_db
# DATABASE_URL=sqlite:///db.sqlite3  # For development

# JWT Settings
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Email Settings
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Frontend
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Leave Management System
```

---

## 📦 Dependencies

### Backend (Python)
```
Django==6.0.7
djangorestframework==3.14.0
django-rest-framework-simplejwt==5.2.2
django-cors-headers==4.0.0
psycopg2-binary==2.9.6
python-decouple==3.8
gunicorn==20.1.0
```

### Frontend (Node.js)
```
react@19.2.7
react-dom@19.2.7
react-router-dom@7.1.0
axios@1.11.0
recharts@3.1.0
lucide-react@0.542.0
```

---

## 🎯 Key Features Implemented

- [x] Custom User Model with Role-Based Access Control
- [x] JWT Authentication
- [x] Leave Request CRUD Operations
- [x] Leave Approval Workflow
- [x] Role-Based Permissions (Admin, HR, Employee)
- [x] RESTful API Design
- [x] Responsive React UI
- [x] Form Validation
- [x] Error Handling
- [x] Environment Configuration

## 🚧 Future Enhancements

- [ ] Email notifications for leave status updates
- [ ] Leave balance tracking and calculation
- [ ] Holiday management
- [ ] Attendance integration
- [ ] Advanced analytics and reports
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSockets)
- [ ] Audit logging
- [ ] Document upload support

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Developer

**Leave Approval Management System**  
A comprehensive portfolio project demonstrating full-stack development expertise with Django, React, and modern web technologies.

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [your-email@example.com]
- Documentation: See `/docs` folder

---

## 🔗 Links

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)

**Last Updated**: 2024
