import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isProvider } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo">
          ⚡ LOCAL<span>SERVE</span>
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/')}>Home</Link>
          </li>
          <li>
            <Link to="/services" className={isActive('/services')}>Services</Link>
          </li>

          {isAuthenticated ? (
            <>
              {!isAdmin && !isProvider && (
                <li>
                  <Link to="/bookings" className={isActive('/bookings')}>My Bookings</Link>
                </li>
              )}
              {isProvider && (
                <li>
                  <Link to="/provider" className={isActive('/provider')}>Provider Dashboard</Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link to="/admin" className={isActive('/admin')}>Admin Dashboard</Link>
                </li>
              )}
              <li>
                <Link to="/profile" className={isActive('/profile')}>Profile</Link>
              </li>
              <li>
                <div className="nav-user-badge">
                  <span>{user?.name}</span>
                  <span className="user-role-tag">{user?.role}</span>
                </div>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className={isActive('/login')}>Login</Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
