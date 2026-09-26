import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff, ShoppingCart } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { login, loading, error } = useAuth();

  const validateForm = () => {
    const errors = {};
    
    // Username validation - Instagram style: can be username or email
    if (!username.trim()) {
      errors.username = 'Email or username is required';
    } else if (username.trim().length < 3) {
      errors.username = 'Must be at least 3 characters';
    } else {
      // Check if it's an email format
      const isEmail = username.includes('@');
      if (isEmail) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username.trim())) {
          errors.username = 'Please enter a valid email address';
        }
      } else {
        // Check if it's a valid username format
        if (!/^[a-zA-Z0-9._]+$/.test(username.trim())) {
          errors.username = 'Invalid format (letters, numbers, periods, underscores only)';
        } else if (/^[._]/.test(username.trim()) || /[._]$/.test(username.trim())) {
          errors.username = 'Cannot start or end with . or _';
        }
      }
    }
    
    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Must be at least 6 characters';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    await login(username, password);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Branding Section */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="branding-logo">
              <ShoppingCart size={48} />
            </div>
            <h2>Multi POS System</h2>
            <p className="branding-tagline">Cloud Point of Sale System</p>
            
            <div className="branding-divider"></div>
            
            <h3>Manage Your Business</h3>
            <p className="branding-subtitle">Smarter & Faster</p>
            
            <p className="branding-description">
              Complete POS solution for retail businesses. Manage inventory, track sales, and grow your business from anywhere.
            </p>
            
            <div className="branding-features">
              <div className="feature">
                <div className="feature-icon">🛒</div>
                <div>
                  <p className="feature-title">POS Terminal</p>
                  <p className="feature-desc">Fast checkout experience</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">📊</div>
                <div>
                  <p className="feature-title">Analytics</p>
                  <p className="feature-desc">Detailed sales reports</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">📦</div>
                <div>
                  <p className="feature-title">Inventory</p>
                  <p className="feature-desc">Real-time stock tracking</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🏪</div>
                <div>
                  <p className="feature-title">Multi-Store</p>
                  <p className="feature-desc">Manage all locations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Login Form Section */}
        <div className="login-form-section">
          <div className="login-card">
            <div className="login-header">
              <div className="login-logo">
                <ShoppingCart size={32} />
              </div>
              <h1>Multi POS System</h1>
              <p>Sign in to your account</p>
            </div>

            {error && (
              <div className="login-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Email</label>
                <input
                  id="username"
                  type="email"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (validationErrors.username) {
                      setValidationErrors({ ...validationErrors, username: '' });
                    }
                  }}
                  placeholder="email@example.com"
                  autoComplete="email"
                  className={validationErrors.username ? 'error' : ''}
                />
                {validationErrors.username && (
                  <span className="error-message">{validationErrors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors({ ...validationErrors, password: '' });
                      }
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={validationErrors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <span className="error-message">{validationErrors.password}</span>
                )}
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>By continuing, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
