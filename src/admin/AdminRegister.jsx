import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import './Admin.css';

const AdminRegister = () => {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await register(formData.username, formData.password);
      setSuccess(true);
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="success-message">
            <h2>Registration Successful!</h2>
            <p>Your account has been created. Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login">
      <div className="login-container">
        <h1>Create Admin Account</h1>
        <p className="login-subtitle">Ticketmaster Admin Portal</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister} className="login-form">
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username (min 3 characters)"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="login-hint">
          <p>Already have an account? <Link to="/admin">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
