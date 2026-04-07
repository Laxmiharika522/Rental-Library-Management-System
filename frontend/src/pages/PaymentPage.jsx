// src/pages/PaymentPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { rentBook } from "../services/rentalService";
import "../styles/Payment.css";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeMethod, setActiveMethod] = useState("card");

  const book = state?.book;
  const duration = state?.duration || 14;
  const totalPrice = state?.total || (book?.price_per_day * duration);

  if (!book) {
    return (
      <div className="payment-page-wrapper">
        <div className="payment-content-box" style={{textAlign: "center", alignItems: "center"}}>
          <div className="secure-badge">⚠️ Error</div>
          <h1>No details found</h1>
          <button onClick={() => navigate("/catalog")} className="pay-btn-checkout">
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const confirmPayment = async () => {
    setLoading(true);
    try {
      await rentBook(book.id, duration);
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.error || "Rental failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payment-page-wrapper">
        <div className="payment-content-box payment-success-container" style={{textAlign: "center", alignItems: "center"}}>
          <div className="success-icon-big">✅</div>
          <h1>Rental Successful!</h1>
          <p className="subtitle">Your book "{book.title}" is now ready in your dashboard.</p>
          <div style={{maxWidth: "300px", width: "100%"}}>
            <button className="pay-btn-checkout" onClick={() => navigate("/my-rentals")}>
              Go to My Rentals
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page-wrapper">
      <div className="payment-content-box">
        <div className="secure-badge">🔒 SECURE CHECKOUT</div>
        <h1>Complete Your Rental</h1>
        <p className="subtitle">Secure transaction powered by Magpie Library</p>

        <div className="checkout-main">
          
          {/* LEFT COLUMN */}
          <div className="checkout-options">
            
            {/* Booking Message */}
            <div className="confirmation-notice">
               <div className="info-icon">💡</div>
               <div>
                  <h3>Ready to Rent</h3>
                  <p>No immediate payment is required. You can confirm your rental now and manage your books from the history page.</p>
               </div>
            </div>

            {/* Rental Terms */}
            <div className="terms-card">
              <h3>Rental Terms & Conditions</h3>
              <div className="terms-list">
                <div className="term-item">
                  <span className="check">✓</span>
                  <span>Rental duration is strictly <strong>{duration} days</strong>.</span>
                </div>
                <div className="term-item">
                  <span className="check">✓</span>
                  <span>A fine of <strong>₹{book?.fine_rate || "10.00"} per day</strong> will be applied automatically if returned late.</span>
                </div>
                <div className="term-item">
                  <span className="check">✓</span>
                  <span>By clicking "Confirm Rental", you agree to our library policies.</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="order-summary-card">
            <h3>Rental Summary</h3>
            
            <div className="summary-book-details">
              <img src={book.image_url} alt={book.title} />
              <div>
                <h4>{book.title}</h4>
                <p>{book.author}</p>
              </div>
            </div>

            <div className="pricing-table">
              <div className="pricing-row">
                <span>Daily Rental Rate</span>
                <span>₹{book.price_per_day}</span>
              </div>
              <div className="pricing-row">
                <span>Total Duration</span>
                <span>{duration} Days</span>
              </div>
              <div className="pricing-row highlight-red">
                <span>Late Fee (Per Day)</span>
                <span>₹{book?.fine_rate || "10.00"}</span>
              </div>
            </div>

            <div className="total-row">
              <span>Grand Total</span>
              <span className="amount">₹{totalPrice}</span>
            </div>

            <button 
              className="pay-btn-checkout" 
              style={{marginTop: "1.5rem"}}
              disabled={loading}
              onClick={confirmPayment}
            >
              {loading ? "Confirming..." : `Confirm Rental (₹${totalPrice})`}
            </button>

            <span className="secure-lock-text">Instant Confirmation Available</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
