// frontend/src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await api.get('/rentals/my');
        setRentals(response.data.rentals);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  if (loading) return <div className="loading">Loading your rentals...</div>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.username}</h2>
      <h3>Your Rented Books</h3>
      {rentals.length === 0 ? (
        <p>You have not rented any books yet.</p>
      ) : (
        <ul>
          {rentals.map(rental => (
            <li key={rental.id}>
              {rental.book.title} - Due: {new Date(rental.due_date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
