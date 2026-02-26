import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State to toggle between User and Admin login UI
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(username, password);

      if (result.error) {
        setError(result.error);
      } else {
        const userRole = result.user.role;

        // --- STRICT ROLE ENFORCEMENT ---
        if (isAdminLogin && userRole !== "admin") {
          setError("Access Denied: Use the 'User Login' tab for member accounts.");
          setLoading(false);
          return;
        }

        if (!isAdminLogin && userRole === "admin") {
          setError("Admin accounts must log in through the 'Admin Login' tab.");
          setLoading(false);
          return;
        }

        // If validation passes, store data
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Route to separate dashboards
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      setError("Connection to server failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Toggle between User and Admin login */}
        <div className="login-tabs">
          <button 
            type="button"
            className={!isAdminLogin ? "tab active" : "tab"} 
            onClick={() => { setIsAdminLogin(false); setError(""); }}
          >
            User Login
          </button>
          <button 
            type="button"
            className={isAdminLogin ? "tab active admin" : "tab"} 
            onClick={() => { setIsAdminLogin(true); setError(""); }}
          >
            Admin Login
          </button>
        </div>

        <h2 className="login-title">
          {isAdminLogin ? "Administrator Secure Login" : "Member Login"}
        </h2>
        
        {error && <div className="login-error-box">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isAdminLogin ? "Admin ID" : "Username"}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`login-btn ${isAdminLogin ? "admin-mode" : ""}`} 
            disabled={loading}
          >
            {loading ? "Verifying..." : isAdminLogin ? "Authorize Admin" : "Login"}
          </button>
        </form>

        {!isAdminLogin && (
          <p className="login-footer">
            Need an account? <a href="/register">Register here</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;