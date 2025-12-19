import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    favouriteColour: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setIsLoggedIn(true);
      setFormData(prev => ({ ...prev, favouriteColour: response.data.user.favouriteColour || '' }));
    } catch (err) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = showRegister ? '/api/auth/register' : '/api/auth/login';
      const response = await axios.post(`${API_URL}${endpoint}`, {
        username: formData.username,
        password: formData.password,
        favouriteColour: showRegister ? formData.favouriteColour : undefined
      });

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsLoggedIn(true);
      setFormData(prev => ({ ...prev, password: '', favouriteColour: response.data.user.favouriteColour || '' }));
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/profile`,
        { favouriteColour: formData.favouriteColour },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data.user);
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setFormData({ username: '', password: '', favouriteColour: '' });
    setSuccess('Logged out successfully');
  };

  if (isLoggedIn && user) {
    return (
      <div className="App">
        <div className="container">
          <div className="header">
            <h1>Welcome, {user.username}!</h1>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>

          <form onSubmit={handleUpdateProfile} className="form">
            <h2>Your Profile</h2>
            
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={user.username}
                disabled
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="favouriteColour">Favourite Colour</label>
              <input
                type="text"
                id="favouriteColour"
                name="favouriteColour"
                value={formData.favouriteColour}
                onChange={handleInputChange}
                placeholder="Enter your favourite colour"
                className="input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn">
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        <h1>{showRegister ? 'Register' : 'Login'}</h1>
        
        <form onSubmit={handleSubmit} className="form">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="input"
              placeholder="Enter your password"
            />
          </div>

          {showRegister && (
            <div className="form-group">
              <label htmlFor="favouriteColour">Favourite Colour (Optional)</label>
              <input
                type="text"
                id="favouriteColour"
                name="favouriteColour"
                value={formData.favouriteColour}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your favourite colour"
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Processing...' : (showRegister ? 'Register' : 'Login')}
          </button>
        </form>

        <div className="toggle">
          {showRegister ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setShowRegister(false);
                  setError('');
                  setSuccess('');
                }}
                className="link-btn"
              >
                Login here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setShowRegister(true);
                  setError('');
                  setSuccess('');
                }}
                className="link-btn"
              >
                Register here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
