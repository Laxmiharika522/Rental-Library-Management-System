// src/pages/MyRentalsPage.jsx
import React, { useEffect, useState } from "react";
import { getUserRentals } from "../services/rentalService";
import RentalCard from "../components/rentals/RentalCard";
import "../styles/MyRentalsPage.css";

const MyRentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRentals = async () => {
    try {
      const data = await getUserRentals();
      setRentals(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleReturnSuccess = (rentalId) => {
    // Smoothly remove the returned rental from the list
    setRentals(prev => prev.filter(r => r.id !== rentalId));
  };

  if (loading) return (
    <div className="page-loader">
      <div className="loader-ring" />
      <span>Loading your active rentals...</span>
    </div>
  );

  return (
    <div className="my-rentals-page">
      <div className="rentals-header">
        <h1>📚 My Active Rentals</h1>
        <p>Manage your current borrowings and return books to Magpie Library.</p>
      </div>

      {rentals.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">You have no active rentals. Visit the Catalog to borrow some books!</p>
        </div>
      ) : (
        <div className="rentals-list">
          {rentals.map((r) => (
            <RentalCard 
              key={r.id} 
              rental={r} 
              onReturnSuccess={handleReturnSuccess} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRentalsPage;
