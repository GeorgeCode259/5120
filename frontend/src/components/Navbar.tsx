import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          UV Index
        </Link>
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className={`navbar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/uv-awareness" 
            className={`navbar-item ${location.pathname === '/uv-awareness' ? 'active' : ''}`}
          >
            Awareness
          </Link>
        </div>
        <div className="navbar-auth">
          <Link to="/login" className="navbar-item">Login</Link>
          <Link to="/register" className="navbar-item">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
