import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const API_BASE_URL = 'http://localhost:8000';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username || formData.email);
        formDataToSend.append('password', formData.password);

        const response = await axios.post(
          `${API_BASE_URL}/auth/login`,
          formDataToSend,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', formData.username || formData.email);
        onLogin(response.data.access_token);
      } else {
        // Register
        const response = await axios.post(
          `${API_BASE_URL}/auth/register`,
          formData
        );

        // Auto login after registration
        const loginFormData = new FormData();
        loginFormData.append('username', formData.username);
        loginFormData.append('password', formData.password);

        const loginResponse = await axios.post(
          `${API_BASE_URL}/auth/login`,
          loginFormData,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        localStorage.setItem('token', loginResponse.data.access_token);
        localStorage.setItem('username', formData.username);
        onLogin(loginResponse.data.access_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="full_name"
                placeholder="Full Name (optional)"
                value={formData.full_name}
                onChange={handleChange}
              />
            </>
          )}
          <input
            type="text"
            name="username"
            placeholder={isLogin ? "Username or Email" : "Username"}
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        <p className="toggle-form">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
