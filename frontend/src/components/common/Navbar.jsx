// frontend/src/components/common/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../services/authService";
import "../../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  // --- ADMIN NAVBAR ---
  if (user?.role === "admin") {
    return (
      <nav className={`navbar admin-nav${scrolled ? " scrolled" : ""}`}>
        <div className="navbar-left">
          <Link to="/admin/dashboard" className="logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">Admin Panel</span>
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <div className={`navbar-right${menuOpen ? " open" : ""}`}>
          <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>Dashboard</Link>
          <Link to="/admin/users" className={isActive("/admin/users")}>Manage Users</Link>
          <Link to="/catalog" className={isActive("/catalog")}>View Books</Link>
          <div className="nav-divider" />
          <span className="admin-badge">
            <span className="admin-dot" />
            {user.username}
          </span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>
    );
  }

  // --- USER NAVBAR ---
  return (
    <nav className={`navbar user-nav${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-left">
        <Link to="/home" className="logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">Magpie Books</span>
        </Link>
      </div>

      {/* Hamburger */}
      <button
        className={`hamburger${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      <div className={`navbar-right${menuOpen ? " open" : ""}`}>
        <Link to="/home"    className={isActive("/home")}>Home</Link>
        <Link to="/catalog" className={isActive("/catalog")}>Catalog</Link>
        <Link to="/about"   className={isActive("/about")}>About</Link>

        {user ? (
          <>
            <Link to="/my-rentals" className="btn-nav-pill">My Rentals</Link>
            <Link to="/wishlist" className="nav-link">♥ Wishlist</Link>
            <Link to="/history" className="nav-link">📖 History</Link>
            <Link to="/profile" className="user-avatar-link">
              <span className="avatar-circle">{user.username[0].toUpperCase()}</span>
              <span className="avatar-name">{user.username}</span>
            </Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <div className="guest-links">
            <Link to="/login"    className="btn-nav-ghost">Login</Link>
            <Link to="/register" className="btn-nav-pill">Sign Up</Link>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;