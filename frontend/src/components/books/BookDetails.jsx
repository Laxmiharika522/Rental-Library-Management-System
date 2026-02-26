// frontend/src/components/books/BookDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import RentModal from "../rentals/RentModal";

//it contains the bookdetails
const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRentModal, setShowRentModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axiosInstance.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Failed to load book details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <p className="loading-text">Loading book details...</p>;
  if (!book) return <p className="error-text">Book not found</p>;

  return (
    <div className="book-details-container">
      <div className="book-details-card">
        <img
          src={book.image_url || "/book-placeholder.png"}
          alt={book.title}
          className="book-cover"
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
            <strong>Available Copies:</strong>{" "}
            {book.available_copies}
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
  );
};

export default BookDetails; 