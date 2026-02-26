// frontend/src/components/books/BookCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/BookCard.css";

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div className="book-card">
      {/* ================== RENTAL BADGE ================== */}
      {book.rental_count > 0 && (
        <span className="rental-badge popular">
          Most Popular
        </span>
      )}

      {/* ================== BOOK COVER ================== */}
      <img
        src={book.image_url || "https://via.placeholder.com/200x280"}
        alt={book.title}
      />

      {/* ================== BOOK INFO ================== */}
      <div className="book-info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>
          {book.available_copies > 0
            ? `Available (${book.available_copies})`
            : "Not Available"}
        </p>

        <button
          disabled={book.available_copies <= 0}
          onClick={() => navigate(`/rent/${book.id}`)}
        >
          Rent Book
        </button>
      </div>
    </div>
  );
};

export default BookCard;
