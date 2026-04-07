import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/axiosInstance";
import "../styles/ConfirmRental.css";

const ConfirmRental = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [duration, setDuration] = useState(14);

  useEffect(() => {
    api.get(`/books/${bookId}`)
      .then(res => setBook(res.data))
      .catch(console.error);
  }, [bookId]);

  if (!book) return (
    <div className="page-loader">
      <div className="loader-ring" />
      <span>Loading book details...</span>
    </div>
  );

  const estimatedTotal = duration * book.price_per_day;

  return (
    <div className="confirm-rental-page">
      <div className="confirm-rental">
        
        {/* ─── HEADER ─────────────────────────────────────────────── */}
        <div className="rental-header">
          <h2>Confirm Your Rental</h2>
          <p>Review the details below to proceed with your booking.</p>
        </div>

        {/* ─── BODY ───────────────────────────────────────────────── */}
        <div className="rental-body">
          
          {/* LEFT: BOOK PREVIEW */}
          <div className="book-summary">
            <div className="cover-placeholder">
              <img
                src={book.image_url || "https://via.placeholder.com/200x280"}
                alt={book.title}
              />
            </div>
            <h3>{book.title}</h3>
            <p className="author">by {book.author}</p>
          </div>

          {/* RIGHT: FORM & SUMMARY */}
          <div className="rental-form-section">
            
            <div className="info-block">
              <span className="form-label">Book Description</span>
              <p className="description-text">
                {book.description || "A masterly study of the inner life by a heart thirsting after God. Here is a book for every child of God, pastor, missionary, and Christian. It deals with the deep things of God and the riches of His grace."}
              </p>
            </div>

            <div className="info-block">
              <span className="form-label">Rental Duration</span>
              <div className="duration-input-container">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Math.min(30, Math.max(1, Number(e.target.value))))}
                />
                <span className="days-label">Days</span>
              </div>
              <p className="hint-text">Standard rental period is 1-30 days.</p>
            </div>

            {/* SUMMARY BOX */}
            <div className="summary-box">
              <h4>Rental Summary</h4>
              <div className="summary-row">
                <span>Price per day</span>
                <span>₹{book.price_per_day}</span>
              </div>
              <div className="summary-row">
                <span>Duration</span>
                <span>{duration} days</span>
              </div>
              <div className="summary-row total">
                <span>Estimated Total</span>
                <span>₹{estimatedTotal.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>

        {/* ─── FOOTER ─────────────────────────────────────────────── */}
        <div className="rental-footer">
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button
            className="btn-proceed"
            onClick={() =>
              navigate("/payment", {
                state: {
                  book,
                  duration,
                  total: estimatedTotal
                }
              })
            }
          >
            Proceed to Payment →
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmRental;
