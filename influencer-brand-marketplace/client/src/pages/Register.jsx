import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'influencer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoading(true);
      const result = await register(formData);
      if (result.success) {
        setSuccess(true);
        // Show success message for 2 seconds then redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to create an account');
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      {/* Left side - Branding */}
      <div className="register-branding">
        <div className="register-branding-content">
          <div className="register-branding-header">
            <div className="register-brand-icon brand-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="register-brand-title">Join Influence Connect</h1>
            <p className="register-brand-subtitle">
              Where brands and creators collaborate seamlessly
            </p>
          </div>
          <div className="register-features">
            <div className="register-feature-item neomorphs">
              <div className="register-feature-icon feature-gradient">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 002 2h2a2 2 0 002-2V6m0 0V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v2" />
                </svg>
              </div>
              <span className="register-feature-text">Connect with top brands</span>
            </div>
            <div className="register-feature-item neomorphs">
              <div className="register-feature-icon feature-gradient">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="register-feature-text">Grow your audience</span>
            </div>
            <div className="register-feature-item neumorph">
              <div className="register-feature-icon feature-gradient">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="register-feature-text">Build meaningful partnerships</span>
            </div>
          </div>
        </div>
      </div>
      {/* Right side - Registration Form */}
      <div className="register-form-section">
        <div className="register-form-container form-neumorph">
          <div className="register-header">
            <div className="register-mobile-brand">
              <div className="register-mobile-icon brand-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="register-mobile-title">Influence Connect</h1>
            </div>
            <h2 className="register-welcome-title">
              Create your account
            </h2>
            <p className="register-welcome-subtitle">
              Join our community of brands and creators
            </p>
          </div>
          <form className="register-form" onSubmit={handleSubmit}>
            {error && (
              <div className="register-error neumorph-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="register-error-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="register-error-text">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="register-error-close"
                  aria-label="Dismiss error"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            {success && (
              <div className="register-success neumorph-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="register-success-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="register-success-text">Registration done successfully! Redirecting to login page...</span>
              </div>
            )}
            <div className="register-field-group">
              <label htmlFor="name" className="register-label">
                Full Name *
              </label>
              <div className="register-input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" className="register-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="register-input input-soft"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="register-field-group">
              <label htmlFor="email" className="register-label">
                Email Address *
              </label>
              <div className="register-input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" className="register-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="register-input input-soft"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="register-field-group">
              <label htmlFor="password" className="register-label">
                Password *
              </label>
              <div className="register-input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" className="register-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="register-input input-soft"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="register-field-group">
              <label htmlFor="confirmPassword" className="register-label">
                Confirm Password *
              </label>
              <div className="register-input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" className="register-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="register-input input-soft"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="register-role-section role-neumorph">
              <label className="register-role-label">
                I am a: *
              </label>
              <div className="register-role-grid">
                <label className={`register-role-option ${formData.role === 'influencer' ? 'role-selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="influencer"
                    checked={formData.role === 'influencer'}
                    onChange={handleChange}
                    className="register-role-radio"
                  />
                  <div className="register-role-content">
                    <div className="register-role-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="register-role-text">
                      <span className="register-role-title">Influencer</span>
                      <span className="register-role-subtitle">Content Creator</span>
                    </div>
                  </div>
                </label>
                <label className={`register-role-option ${formData.role === 'brand' ? 'role-selected' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="brand"
                    checked={formData.role === 'brand'}
                    onChange={handleChange}
                    className="register-role-radio"
                  />
                  <div className="register-role-content">
                    <div className="register-role-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="register-role-text">
                      <span className="register-role-title">Brand</span>
                      <span className="register-role-subtitle">Business Account</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="register-submit-btn gradient-btn"
            >
              {loading ? (
                <>
                  <svg className="register-submit-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          <div className="register-signin-prompt">
            <p>
              Already have an account?{' '}
              <Link
                to="/login"
                className="register-signin-link"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
