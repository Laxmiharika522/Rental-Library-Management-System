//frontend\src\admin\pages\AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_users: 0,
    total_books: 0,
    active_rentals: 0,
    // total_books - active_rentals will be calculated below
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Calculate available books since your system returns them automatically
  const availableBooks = stats.total_books - stats.active_rentals;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-container">
        
        {/* Clickable Card for Users */}
        <div 
          className="stat-card clickable" 
          onClick={() => navigate("/admin/users")}
        >
          <h3>Total Users</h3>
          <p>{stats.total_users}</p>
          <span className="manage-link">Manage Users →</span>
        </div>

        {/* UPDATED: Clickable Card for Books Inventory */}
        <div 
          className="stat-card clickable" 
          onClick={() => navigate("/admin/books")}
        >
          <h3>Total Books</h3>
          <p>{stats.total_books}</p>
          <span className="manage-link">Manage Books →</span>
        </div>

          <div 
          className="stat-card clickable" 
          onClick={() => navigate("/admin/rentals/active")}
          >
          
          <h3>Active Rentals</h3>
          <p>{stats.active_rentals}</p>
          <span className="manage-link">View Tracking →</span>
          </div>

        {/* REPLACED: Overdue Rentals with Available Stock */}
        <div className="stat-card">
          <h3>Books Available</h3>
          <p className="available">{availableBooks}</p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;