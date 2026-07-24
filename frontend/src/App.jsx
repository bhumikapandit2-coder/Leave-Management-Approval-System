import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { BarChart3, CalendarDays, ShieldCheck, Users } from 'lucide-react';
import './App.css';

function getToken() {
  return localStorage.getItem('accessToken');
}

const API_URL = 'http://127.0.0.1:8000/api';

function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

function normalizeResponse(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.results)) return data.results;
  return [];
}

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [form, setForm] = useState({ leave_type: '', start_date: '', end_date: '', reason: '' });
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    const token = getToken();
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setRole(decoded.role || 'EMPLOYEE');
      setUserName(decoded.username || decoded.email || '');
    } catch {
      setRole('EMPLOYEE');
      setUserName('');
    }

    try {
      const usersRes = await axios.get(`${API_URL}/accounts/users/`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(normalizeResponse(usersRes.data));
    } catch {
      setUsers([]);
    }

    try {
      const leavesRes = await axios.get(`${API_URL}/leaves/leave-history/`, { headers: { Authorization: `Bearer ${token}` } });
      setLeaveRequests(normalizeResponse(leavesRes.data));
    } catch {
      setLeaveRequests([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setMessage('Please login first.');
      return;
    }

    try {
      await axios.post(`${API_URL}/leaves/leave-requests/`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Leave request submitted.');
      setForm({ leave_type: '', start_date: '', end_date: '', reason: '' });
      await loadData();
    } catch {
      setMessage('Submission failed.');
    }
  };

  const handleDecision = async (id, action) => {
    const token = getToken();
    try {
      await axios.post(`${API_URL}/leaves/leave-requests/${id}/${action}/`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await loadData();
      setMessage(`${action.charAt(0).toUpperCase() + action.slice(1)} completed.`);
    } catch {
      setMessage(`${action.charAt(0).toUpperCase() + action.slice(1)} failed.`);
    }
  };

  const statusClass = (status) => {
    if (!status) return 'status-badge';
    return `status-badge status-${status.toLowerCase()}`;
  };

  return (
    <div className="app-shell">
      <nav className="topbar">
        <div>
          <h1>Leave Approval System</h1>
          <p className="topbar-subtitle">A modern, bright dashboard for your leave approvals.</p>
        </div>
        <div className="nav-links">
          <span className="nav-label">Hello {userName || 'User'}</span>
          <button className="link-button" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <section className="hero-card">
        <div>
          <h2>Welcome back{userName ? `, ${userName}` : ''}</h2>
          <p>Track leaves, review approvals, and stay organized from one place.</p>
        </div>
        <div className="hero-meta">
          <span className="role-chip">Role: {role}</span>
          <span>{loading ? 'Loading latest requests...' : `${leaveRequests.length} requests in the system`}</span>
        </div>
      </section>

      <main className="dashboard-grid">
        <section className="card summary-card">
          <div className="card-title"><Users size={18} /> Employees</div>
          <div className="metric">{users.length}</div>
          <p className="card-note">Team members currently in the system.</p>
        </section>
        <section className="card summary-card">
          <div className="card-title"><CalendarDays size={18} /> Requests</div>
          <div className="metric">{leaveRequests.length}</div>
          <p className="card-note">Total leave requests in the system.</p>
        </section>
        <section className="card summary-card">
          <div className="card-title"><ShieldCheck size={18} /> Security</div>
          <p>JWT authentication and role-based access control.</p>
        </section>
        <section className="card wide insights-card">
          <div className="card-title"><BarChart3 size={18} /> Quick Insight</div>
          <p>Keep approvals moving quickly and reduce manual follow up.</p>
        </section>

        <section className="card wide">
          <h3>Submit Leave Request</h3>
          <form onSubmit={handleSubmit} className="leave-form">
            <input value={form.leave_type} onChange={(e) => setForm({ ...form, leave_type: e.target.value })} placeholder="Leave Type" />
            <div className="date-row">
              <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
            <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason" rows="4" />
            <button type="submit">Submit Request</button>
          </form>
          {message && <p className="form-message">{message}</p>}
        </section>

        <section className="card wide">
          <h3>Recent Leave Requests</h3>
          <ul className="request-list">
            {Array.isArray(leaveRequests) && leaveRequests.length > 0 ? (
              leaveRequests.map((item) => (
                <li key={item.id} className="request-item">
                  <div className="request-header">
                    <div>
                      <strong>{item.leave_type || 'Leave Request'}</strong>
                      <span className="request-person">{item.employee_name || item.employee || 'Unknown'}</span>
                    </div>
                    <span className={statusClass(item.status)}>{item.status || 'PENDING'}</span>
                  </div>

                  <div className="request-details">
                    <span>{item.start_date || 'N/A'} → {item.end_date || 'N/A'}</span>
                    {item.review_comment ? <span>Note: {item.review_comment}</span> : null}
                  </div>

                  {(role === 'HR' || role === 'ADMIN') && item.status === 'PENDING' ? (
                    <div className="approval-actions">
                      <button className="approve" onClick={() => handleDecision(item.id, 'approve')}>Approve</button>
                      <button className="reject" onClick={() => handleDecision(item.id, 'reject')}>Reject</button>
                    </div>
                  ) : null}
                </li>
              ))
            ) : (
              <li className="request-empty">No leave requests available yet.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/accounts/login/`, form);
      localStorage.setItem('accessToken', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);
      navigate('/', { replace: true });
    } catch (error) {
      const detail = error?.response?.data?.detail || error?.response?.data?.non_field_errors?.[0] || 'Login failed';
      setMessage(detail);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div>
          <p className="eyebrow">Employee Portal</p>
          <h1>Sign in to leave management</h1>
          <p>Securely login to submit requests, review approvals, and stay updated on your team.</p>
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Enter your credentials to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Username
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
          </label>
          <button type="submit">Login</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to={getToken() ? '/' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
