// src/pages/ConfirmRental.js
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

  if (!book) return <p>Loading...</p>;

  return (
    <div className="confirm-rental">
      <h2>Confirm Rental</h2>

      <img
        src={book.image_url || "https://via.placeholder.com/200x280"}
        alt={book.title}
      />

      <h3>{book.title}</h3>
      <p>Author: {book.author}</p>
      <p>Available: {book.available_copies}</p>

      <label>
        Duration (days):
        <input
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </label>

      <div style={{ marginTop: "15px" }}>
        <button onClick={() => navigate("/books")}>Cancel</button>

        <button
          onClick={() =>
            navigate("/payment", {
              state: {
                book,
                duration   // ✅ CORRECT KEY
              }
            })
          }
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default ConfirmRental;
