// frontend/src/pages/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for the footer
import { register } from "../services/authService";
import "../styles/Register.css";
import bookStackImg from "../assets/book-stack.png"; // Import your logo

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.error) {
      setError(result.error);
      setSuccess("");
    } else {
      setSuccess("Registered successfully! Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="register-page"> {/* Match .register-page */}
      <div className="register-card"> {/* Match .register-card */}
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join the Library Management System</p>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              name="full_name" 
              value={formData.full_name} 
              onChange={handleChange} 
              placeholder="Enter your name"
              required 
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Choose a username"
              required 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="email@example.com"
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="register-button">Register</button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login" className="register-link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;