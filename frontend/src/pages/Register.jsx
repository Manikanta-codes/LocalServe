import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await register(formData);
      setSuccess('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const data = err.response?.data;
      if (data?.data && typeof data.data === 'object') {
        const messages = Object.values(data.data).join(', ');
        setError(`Registration failed: ${messages}`);
      } else {
        setError(data?.message || 'Registration failed. Please check your details and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <div className="card">
        <h2 className="text-center" style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>
          Create an Account
        </h2>
        <p className="text-center" style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Join LocalServe to book or offer professional services
        </p>

        <ErrorMessage message={error} onClose={() => setError('')} />

        {success && <div className="success-alert">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="+1 555-0199"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Register As</label>
            <select
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="CUSTOMER">Customer (Book Services)</option>
              <option value="PROVIDER">Service Provider (Offer Services)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
