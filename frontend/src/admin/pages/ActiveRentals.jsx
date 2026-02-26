//frontend\src\admin\pages\ActiveRentals.js
import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import "../../styles/AdminBooks.css"; // Reusing consistent table styling

const ActiveRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch data from backend
  const fetchActive = async () => {
    try {
      setLoading(true);
      const data = await adminService.getActiveRentals();
      console.log("Fetched Active Rentals:", data);
      
      // Ensure we are setting an array
      setRentals(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load active rentals. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActive();
  }, []);

  // 2. Logic to process a book return
  const handleReturn = async (rentalId) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to mark this book as returned? This will update the inventory stock."
    );
    
    if (!confirmReturn) return;

    try {
      await adminService.markRentalReturned(rentalId);
      
      // Optimistic UI update: Remove the returned item from the current view
      setRentals((prevRentals) => prevRentals.filter((r) => r.id !== rentalId));
      alert("Success: Book has been returned and inventory updated.");
    } catch (err) {
      console.error("Return process error:", err);
      alert(err.response?.data?.error || "Failed to process return.");
    }
  };

  if (loading) return <div className="loading-text">Syncing active rental records...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-management-page">
      <div className="management-header">
        <div className="title-section">
          <h2>Active Rentals Tracking</h2>
          <p className="subtitle">Monitor currently borrowed books and manage returns</p>
        </div>
        <div className="stats-badge">
          <strong>{rentals.length}</strong> Books currently out
        </div>
      </div>

      <div className="books-table-wrapper">
        <table className="admin-db-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Member Name</th>
              <th>Book Title</th>
              <th>Borrowed On</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.length > 0 ? (

              //Converts each rental object into one table row
              rentals.map((rental) => {
                const isOverdue = new Date(rental.due_date) < new Date();
                
                return (
                  <tr key={rental.id}>
                    <td><span className="id-badge">#{rental.id}</span></td>
                    <td>
                      <div className="user-cell">
                        <strong>{rental.user_name}</strong>
                      </div>
                    </td>
                    <td>{rental.book_title}</td>
                    <td>{rental.rental_date}</td>
                    <td>
                      <span className={isOverdue ? "date-overdue" : "date-on-time"}>
                        {rental.due_date}
                        {isOverdue && <span className="alert-icon"> ⚠️</span>}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${rental.status}`}>
                        {rental.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-update-return" 
                        onClick={() => handleReturn(rental.id)}
                      >
                        Mark as Returned
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="empty-state-cell">
                  <div className="empty-content">
                    <p>No active rentals found.</p>
                    <span>All books are currently in the library inventory.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRentals;