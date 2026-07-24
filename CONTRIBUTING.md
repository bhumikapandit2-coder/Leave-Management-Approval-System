# 🎯 Contributing Guide

Thank you for your interest in contributing to the Leave Approval Management System! This guide will help you get started.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Report issues professionally
- Follow the project's values

---

## Getting Started

### 1. Fork the Repository
```bash
# Go to GitHub and click "Fork"
# Then clone your fork:
git clone https://github.com/yourusername/leave-management-system.git
cd leave-management-system
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Set Up Development Environment
```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

---

## Development Setup

### Backend

```bash
# Setup environment
cp .env.example .env
# Edit .env with your local settings

# Migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Coding Standards

### Python (Backend)

#### Style Guide: PEP 8
```python
# Good
def calculate_leave_days(start_date, end_date):
    """Calculate number of leave days."""
    delta = end_date - start_date
    return delta.days + 1

# Bad
def calc(s,e):
    return (e-s).days+1
```

#### Formatting
```bash
# Auto-format code
black backend/

# Check code quality
flake8 backend/

# Sort imports
isort backend/
```

#### Documentation
```python
def approve_leave_request(leave_request, reviewer, comment):
    """
    Approve a leave request.
    
    Args:
        leave_request (LeaveRequest): The leave request to approve
        reviewer (CustomUser): The user approving the request
        comment (str): Approval comment
        
    Returns:
        LeaveRequest: Updated leave request object
        
    Raises:
        ValidationError: If leave request is already processed
    """
    pass
```

### JavaScript/React (Frontend)

#### Style Guide: Standard JS
```jsx
// Good
export function LeaveForm() {
  const [startDate, setStartDate] = useState(null)
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </form>
  )
}

// Bad
export const LeaveForm=()=>{const[st,setSt]=useState();return(<form><input/></form>)}
```

#### Naming Conventions
```javascript
// Components: PascalCase
function LeaveRequestForm() {}

// Functions: camelCase
function handleSubmit() {}

// Constants: UPPER_SNAKE_CASE
const API_ENDPOINTS = {}

// Variables: camelCase
const userName = ""
```

---

## Commit Guidelines

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/modifications
- `chore`: Maintenance tasks

### Examples
```bash
# Good
git commit -m "feat(leaves): Add leave balance calculation"
git commit -m "fix(auth): Fix JWT token expiration bug"
git commit -m "docs(api): Update API documentation"

# Bad
git commit -m "fixed stuff"
git commit -m "updates"
```

---

## Pull Request Process

### 1. Create PR with Description

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed:
- [ ] Manual testing
- [ ] Unit tests added
- [ ] All tests passing

## Checklist
- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### 2. Ensure Tests Pass
```bash
# Backend tests
python manage.py test

# Frontend tests
cd frontend && npm test
```

### 3. Wait for Review
- Respond to reviewer feedback
- Make requested changes
- Request re-review when ready

### 4. Merge
Maintainers will merge after approval.

---

## Testing

### Backend Tests

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test accounts
python manage.py test leaves

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Example Test
```python
from django.test import TestCase
from accounts.models import CustomUser
from leaves.models import LeaveRequest

class LeaveRequestTestCase(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            password='testpass'
        )
    
    def test_create_leave_request(self):
        leave = LeaveRequest.objects.create(
            employee=self.user,
            leave_type='SICK_LEAVE',
            start_date='2024-08-01',
            end_date='2024-08-03',
            reason='Medical leave'
        )
        self.assertEqual(leave.status, 'PENDING')
        self.assertEqual(leave.employee, self.user)
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:coverage
```

---

## Documentation

### Code Comments
```python
# Good: Explain WHY, not WHAT
def approve_leave(leave_request):
    # We increment by 1 because both start and end dates are inclusive
    total_days = (leave_request.end_date - leave_request.start_date).days + 1
    
# Bad: Explains WHAT (obvious from code)
def approve_leave(leave_request):
    # Calculate days between dates
    total_days = (leave_request.end_date - leave_request.start_date).days
```

### Docstrings
```python
def calculate_leave_balance(employee, leave_type, year=None):
    """
    Calculate remaining leave balance for an employee.
    
    This method considers approved leave requests and calculates
    the remaining balance for the specified year.
    
    Args:
        employee (CustomUser): The employee
        leave_type (str): Type of leave (SICK_LEAVE, VACATION, etc.)
        year (int, optional): Year to calculate for (defaults to current)
        
    Returns:
        int: Remaining leave days
        
    Raises:
        ValueError: If leave_type is invalid
        
    Example:
        >>> balance = calculate_leave_balance(user, 'SICK_LEAVE')
        >>> print(balance)
        10
    """
    pass
```

### README Updates
Update relevant documentation when:
- Adding new features
- Changing API behavior
- Updating dependencies
- Adding configuration options

---

## Reporting Bugs

### Issue Template
```markdown
## Description
Clear description of the bug.

## Steps to Reproduce
1. Step one
2. Step two
3. ...

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: macOS/Windows/Linux
- Python version: 3.11
- Node version: 18
- Browser: Chrome/Firefox

## Screenshots
If applicable, add screenshots.
```

---

## Feature Requests

### Request Template
```markdown
## Description
Clear description of the requested feature.

## Problem Statement
What problem does this solve?

## Proposed Solution
How should it work?

## Alternative Solutions
Any alternatives considered?

## Additional Context
Any other relevant information.
```

---

## Development Workflow

### 1. Identify Issue or Feature
- Check existing issues
- Create new issue if needed
- Get feedback from maintainers

### 2. Create Feature Branch
```bash
git checkout -b feature/issue-123
```

### 3. Develop
```bash
# Make changes
# Test locally
# Follow coding standards
```

### 4. Commit
```bash
git add .
git commit -m "feat(leaves): Add leave balance calculation"
```

### 5. Push
```bash
git push origin feature/issue-123
```

### 6. Create Pull Request
- Provide clear description
- Link related issues
- Add reviewers

### 7. Address Feedback
```bash
# Make changes based on review
git add .
git commit -m "refactor(leaves): Simplify calculation logic"
git push origin feature/issue-123
```

### 8. Merge
Maintainers will merge after approval.

---

## Local Testing Checklist

Before submitting PR:

- [ ] Code runs without errors
- [ ] All tests pass
- [ ] No console warnings
- [ ] Code follows standards
- [ ] Documentation updated
- [ ] No hardcoded values
- [ ] Environment variables used
- [ ] Error handling added
- [ ] Comments added where needed
- [ ] Performance considered

---

## Tools & Resources

### Backend
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Python PEP 8](https://pep8.org/)

### Frontend
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [JavaScript Standards](https://standardjs.com/)

### Tools
- [Black](https://black.readthedocs.io/) - Code formatter
- [Pytest](https://pytest.org/) - Testing framework
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatter

---

## Getting Help

- **Discord**: [Link to community]
- **GitHub Discussions**: [Link]
- **Email**: [Contact]
- **Documentation**: [Docs Link]

---

## Recognition

Contributors will be recognized in:
- README file
- Release notes
- GitHub contributors page

Thank you for contributing to make this project better! 🎉
