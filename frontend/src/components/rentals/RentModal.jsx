// src/components/rentals/RentModal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RentModal = ({ book, onClose }) => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(14);

  const proceedToPayment = () => {
    if (!book || !book.isbn) { // Using isbn as a check since your data uses it
      alert("Invalid book data");
      return;
    }

    // Mapping the data to ensure PaymentPage gets what it needs
    const paymentData = {
      state: {
        book: {
          id: book.id || book.isbn, // Use ISBN if ID isn't present
          title: book.title,
          author: book.author,
          genre: book.genre,
          category: book.category,
          image_url: book.image_url,
          // FIX: Mapping rental_price_per_day to price_per_day
          price_per_day: book.rental_price_per_day || book.price_per_day || 0,
        },
        duration: Number(duration),
      },
    };

    console.log("Navigating to payment with:", paymentData);
    navigate("/payment", paymentData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Confirm Rental</h2>
        <p><strong>{book.title}</strong></p>
        <p>Price: ₹{book.rental_price_per_day}/day</p>

        <label style={{ display: 'block', margin: '15px 0' }}>
          Duration (days):
          <input
            type="number"
            min="1"
            max="30"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>

        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={proceedToPayment} className="confirm-btn">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentModal;