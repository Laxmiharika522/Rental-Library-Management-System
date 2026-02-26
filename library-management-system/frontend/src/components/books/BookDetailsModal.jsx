// frontend/src/components/books/BookDetailsModal.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import RentModal from "../rentals/RentModal";

//how our bookcard should loook like
const BookDetailsModal = ({ bookId, onClose }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRentModal, setShowRentModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axiosInstance.get(`/books/${bookId}`);
        setBook(res.data);
      } catch (err) {
        console.error("Failed to fetch book details", err);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchBook();
  }, [bookId]);

  if (loading) return null;
  if (!book) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content large">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <div className="book-details">
          <img
            src={book.image_url || "/book-placeholder.png"}
            alt={book.title}
            className="modal-book-cover"
          />

          <div className="book-info">
            <h1>{book.title}</h1>

            <p>
              <strong>Author:</strong> {book.author}
            </p>

            <p>
              <strong>Genre:</strong> {book.genre}
            </p>

            <p className="book-description">
              {book.description || "No description available."}
            </p>

            <p>
              <strong>Price per day:</strong> ₹{book.price_per_day}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {book.available_copies > 0
                ? `Available (${book.available_copies})`
                : "Not Available"}
            </p>

            <button
              className="btn-primary"
              disabled={book.available_copies <= 0}
              onClick={() => setShowRentModal(true)}
            >
              {book.available_copies > 0 ? "Rent Book" : "Out of Stock"}
            </button>
          </div>
        </div>

        {showRentModal && (
          <RentModal
            book={book}
            onClose={() => setShowRentModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BookDetailsModal;
