//frontend\src\components\common\Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import "../../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // --- 1. ADMIN NAVBAR (Management Focus) ---
  if (user?.role === "admin") {
    return (
      <nav className="navbar admin-nav">
        <div className="navbar-left">
          <Link to="/admin/dashboard" className="logo">🛡️ Admin Panel</Link>
        </div>
        <div className="navbar-right">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/users">Manage Users</Link>
          <Link to="/catalog">View Books</Link>
          <div className="nav-divider"></div>
          <span className="admin-status">Logged in as: <strong>{user.username}</strong></span>
          <button onClick={handleLogout} className="btn-logout admin-btn">Logout</button>
        </div>
      </nav>
    );
  }

  // --- 2. USER NAVBAR (Member Focus) ---
  return (
    <nav className="navbar user-nav">
      <div className="navbar-left">
        <Link to="/home" className="logo">📚 Magpie Books</Link>
      </div>
      <div className="navbar-right">
        <Link to="/home">Home</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/about">About</Link>
        
        {user ? (
          <>
            <Link to="/my-rentals" className="btn-my-rentals">My Rentals</Link>
            <Link to="/profile" className="user-profile">Hi, {user.username}</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <div className="guest-links">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;