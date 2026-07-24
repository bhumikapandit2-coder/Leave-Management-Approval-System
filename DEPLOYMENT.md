# 🚀 Deployment Guide

Complete guide for deploying the Leave Approval Management System to production environments.

## Table of Contents
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Heroku Deployment](#heroku-deployment)
- [AWS EC2 Deployment](#aws-ec2-deployment)
- [Production Checklist](#production-checklist)

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 13+ (recommended)
- Git

### Setup Steps

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/leave-management-system.git
cd "Leave Approval Management System"
```

#### 2. Backend Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your settings (especially DATABASE_URL for local dev)
nano .env
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

#### 4. Database Setup
```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py loaddata sample_data
```

#### 5. Run Development Servers

**Backend (Terminal 1)**:
```bash
python manage.py runserver
# Backend available at http://localhost:8000
```

**Frontend (Terminal 2)**:
```bash
cd frontend
npm run dev
# Frontend available at http://localhost:5173
```

---

## Docker Deployment

### Local Development with Docker

#### 1. Prerequisites
- Docker Desktop installed
- Docker Compose installed

#### 2. Setup

```bash
# Copy environment file
cp .env.example .env

# Build Docker images
docker-compose build

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

#### 3. Access Application
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432

#### 4. Useful Commands
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Remove volumes (clears database)
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

---

## Heroku Deployment

### Prerequisites
- Heroku CLI installed
- Heroku account
- Git repository

### Deployment Steps

#### 1. Login to Heroku
```bash
heroku login
```

#### 2. Create Heroku App
```bash
heroku create your-app-name

# Or if app exists:
heroku git:remote -a your-app-name
```

#### 3. Add PostgreSQL Database
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

#### 4. Configure Environment Variables
```bash
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
heroku config:set ENVIRONMENT=production
heroku config:set LOG_LEVEL=WARNING

# Verify
heroku config
```

#### 5. Create Procfile
Create `Procfile` in project root:
```
web: gunicorn backend.wsgi --log-file -
release: python manage.py migrate
```

#### 6. Create runtime.txt
```
python-3.11.4
```

#### 7. Prepare for Deployment
```bash
# Install Whitenoise
pip install whitenoise
pip freeze > requirements.txt

# Test locally
heroku local web
```

#### 8. Deploy
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Create superuser
heroku run python manage.py createsuperuser

# Collect static files (if needed)
heroku run python manage.py collectstatic --noinput
```

#### 9. Verify Deployment
```bash
# View app
heroku open

# View logs
heroku logs --tail

# Run Django shell
heroku run python manage.py shell
```

### Troubleshooting Heroku

```bash
# Check app status
heroku status

# View resource usage
heroku ps

# Scale dynos
heroku ps:scale web=1 worker=1

# Restart app
heroku restart

# Clear cache
heroku config:unset PYTHONHASHSEED
```

---

## AWS EC2 Deployment

### Prerequisites
- AWS account
- EC2 instance running Ubuntu 22.04 LTS
- Elastic IP allocated
- Security groups configured

### Configuration Steps

#### 1. EC2 Instance Setup

**Security Group Configuration**:
```
Inbound Rules:
- SSH (22): Your IP
- HTTP (80): 0.0.0.0/0
- HTTPS (443): 0.0.0.0/0
```

#### 2. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3.11 python3.11-venv python3-pip \
    postgresql postgresql-contrib \
    nginx \
    git \
    curl \
    certbot \
    python3-certbot-nginx

# Create app directory
sudo mkdir -p /var/www/lams
cd /var/www/lams

# Clone repository
sudo git clone https://github.com/yourusername/leave-management-system.git .
sudo chown -R $USER:$USER .
```

#### 3. Backend Setup
```bash
# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
nano .env  # Edit with production settings

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

#### 4. Configure PostgreSQL
```bash
sudo -u postgres psql
CREATE DATABASE lams_db;
CREATE USER lams_user WITH PASSWORD 'secure_password';
ALTER ROLE lams_user SET client_encoding TO 'utf8';
ALTER ROLE lams_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE lams_user SET default_transaction_deferrable TO on;
ALTER ROLE lams_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE lams_db TO lams_user;
\q
```

#### 5. Configure Gunicorn

Create `/var/www/lams/gunicorn_config.py`:
```python
import multiprocessing

bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 2
```

#### 6. Create Systemd Service

Create `/etc/systemd/system/lams.service`:
```ini
[Unit]
Description=Leave Approval Management System
After=network.target postgresql.service

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/var/www/lams
Environment="PATH=/var/www/lams/venv/bin"
ExecStart=/var/www/lams/venv/bin/gunicorn \
    --config gunicorn_config.py \
    --chdir /var/www/lams \
    backend.wsgi:application

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl daemon-reload
sudo systemctl start lams
sudo systemctl enable lams
```

#### 7. Configure Nginx

Create `/etc/nginx/sites-available/lams`:
```nginx
upstream lams_backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    client_max_body_size 10M;

    location = /favicon.ico {
        access_log off;
        log_not_found off;
    }

    location /static/ {
        alias /var/www/lams/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /var/www/lams/media/;
        expires 7d;
    }

    location / {
        proxy_pass http://lams_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/lams /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 8. Setup SSL with Let's Encrypt
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo systemctl reload nginx
```

#### 9. Auto-renew SSL
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## Production Checklist

- [ ] Set `DEBUG = False` in production
- [ ] Generate new `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use PostgreSQL (not SQLite)
- [ ] Setup HTTPS/SSL certificate
- [ ] Configure email settings
- [ ] Setup proper logging
- [ ] Enable security headers
- [ ] Setup database backups
- [ ] Configure error tracking (Sentry)
- [ ] Setup monitoring
- [ ] Setup CDN for static files
- [ ] Configure rate limiting
- [ ] Setup CORS properly
- [ ] Enable CSRF protection
- [ ] Test all API endpoints
- [ ] Performance testing
- [ ] Security audit
- [ ] Setup CI/CD pipeline
- [ ] Document deployment process
- [ ] Create runbooks for common operations

---

## Monitoring & Maintenance

### Check Service Status
```bash
sudo systemctl status lams
sudo systemctl status nginx
```

### View Logs
```bash
sudo journalctl -u lams -f
sudo tail -f /var/log/nginx/error.log
```

### Database Backups
```bash
# Manual backup
sudo -u postgres pg_dump lams_db > backup.sql

# Restore from backup
sudo -u postgres psql lams_db < backup.sql

# Automated daily backup
# Add to crontab:
0 2 * * * sudo -u postgres pg_dump lams_db > /backups/lams_$(date +\%Y\%m\%d).sql
```

### Update Application
```bash
cd /var/www/lams
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart lams
```

---

## Troubleshooting

### 502 Bad Gateway
```bash
# Check Gunicorn
sudo systemctl status lams
sudo journalctl -u lams -n 50

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Static Files Not Loading
```bash
# Regenerate static files
python manage.py collectstatic --noinput --clear
```

### Database Connection Issues
```bash
# Test database
python manage.py dbshell
SELECT 1;
```

---

## Performance Optimization

### Database Optimization
```sql
CREATE INDEX idx_user_role ON accounts_customuser(role);
CREATE INDEX idx_leave_status ON leaves_leaverequest(status);
CREATE INDEX idx_leave_employee ON leaves_leaverequest(employee_id);
```

### Caching Strategy
- Cache API responses with Redis
- Cache static files with CDN
- Use browser caching for assets

### Load Testing
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test endpoint
ab -n 1000 -c 10 http://yourdomain.com/api/v1/leaves/
```

---

## Emergency Procedures

### Rollback Deployment
```bash
git log --oneline
git revert <commit_hash>
git push origin main
```

### Clear Cache
```bash
python manage.py shell
from django.core.cache import cache
cache.clear()
```

### Emergency Maintenance Mode
Create `/var/www/lams/maintenance.html` and update Nginx to serve it during maintenance.

---

## Support & Resources

- [Django Deployment Checklist](https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/)
- [Gunicorn Deployment](https://gunicorn.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Backup](https://www.postgresql.org/docs/current/sql-copy.html)
