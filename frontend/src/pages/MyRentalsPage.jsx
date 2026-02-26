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
      setRentals(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load rentals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  if (loading) return <p>Loading your rentals...</p>;
  if (rentals.length === 0) return <p>You have no rentals.</p>;

  return (
    <div>
      <h1>My Rentals</h1>
      <div className="rentals-list">
        {rentals.map((r) => (
          <RentalCard key={r.id} rental={r} />
        ))}
      </div>
    </div>
  );
};

export default MyRentalsPage;
