import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submissionInProgress = useRef(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submissionInProgress.current) return;

    submissionInProgress.current = true;
    setError('');
    setSubmitting(true);

    try {
      const loggedUser = await login(email, password);
      
      // Navigate based on user role
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin');
      } else if (loggedUser.role === 'PROVIDER') {
        navigate('/provider');
      } else {
        navigate('/services');
      }
    } catch (err) {
      if (err.code === 'API_NOT_CONFIGURED') {
        setError('The login service is not configured. Please contact the site administrator.');
      } else if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
        setError('The login request timed out. Please try again in a moment.');
      } else if (!err.response) {
        setError('Unable to reach the login service. Check your connection and try again.');
      } else if (err.response.status >= 500) {
        setError('The login service is temporarily unavailable. Please try again later.');
      } else if (err.response.status === 401 || err.response.status === 400) {
        setError('Email or password is incorrect. Please check your details and try again.');
      } else {
        setError(err.response.data?.message || 'Unable to log in. Please try again.');
      }
    } finally {
      submissionInProgress.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto' }}>
      <div className="card">
        <h2 className="text-center" style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>
          Welcome Back
        </h2>
        <p className="text-center" style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Log in to manage your bookings and services
        </p>

        <ErrorMessage message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: '600' }}>Register here</Link>
        </div>

        {/* Demo Credentials Helper */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1', fontSize: '0.8rem', color: '#64748b' }}>
          <strong>Default Quick Login Credentials:</strong>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
            <li>Customer: <code>customer@localserve.com</code> / <code>customer123</code></li>
            <li>Provider: <code>provider@localserve.com</code> / <code>provider123</code></li>
            <li>Admin: <code>admin@localserve.com</code> / <code>admin123</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
