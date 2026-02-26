// src/pages/PaymentPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { rentBook } from "../services/rentalService";
import "../styles/Payment.css";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ Hooks FIRST (no conditions before these)
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Safe data extraction AFTER hooks
  const book = state?.book;
  const duration = state?.duration;

  if (!book || !duration) {
    return (
      <div className="payment-container">
        <h2>No payment details found</h2>
        <button onClick={() => navigate("/catalog")} className="pay-btn">
          Back to Catalog
        </button>
      </div>
    );
  }

  const pricePerDay = book.price_per_day || 0;
  const totalPrice = pricePerDay * duration;

  const confirmPayment = async () => {
    setLoading(true);
    try {
      await rentBook(book.id);
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.error || "Rental failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      {!success ? (
        <>
          <h1>💳 Payment Confirmation</h1>

          <div className="payment-card">
            <img
              src={book.image_url || "https://via.placeholder.com/160x240"}
              alt={book.title}
            />

            <div className="payment-info">
              <h2>{book.title}</h2>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Category:</strong> {book.category}</p>
              <p><strong>Genre:</strong> {book.genre}</p>

              <hr />

              <p><strong>Price per day:</strong> ₹{pricePerDay}</p>
              <p><strong>Duration:</strong> {duration} days</p>
              <p className="total-amount">
                <strong>Total Amount:</strong> ₹{totalPrice}
              </p>

              <small className="policy-note">
                🔄 Auto-return after {duration} days 
              </small>
            </div>
          </div>

          <button
            className="pay-btn"
            disabled={loading}
            onClick={confirmPayment}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </>
      ) : (
        <div className="success-card">
          <h1>✅ Rental Successful</h1>
          <p>Your book has been rented successfully.</p>

          <button
            className="pay-btn"
            onClick={() => navigate("/my-rentals")}
          >
            Go to My Rentals
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
