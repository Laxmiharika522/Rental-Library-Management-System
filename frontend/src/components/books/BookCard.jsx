// frontend/src/components/books/BookCard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToWishlist, removeFromWishlist, getWishlist } from "../../services/wishlistService";
import "../../styles/BookCard.css";

const BookCard = ({ book, hideRent = false }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      checkWishlist();
    }
  }, [book.id]);

  const checkWishlist = async () => {
    try {
      const res = await getWishlist();
      const inWishlist = res.data.some(item => item.book_id === book.id);
      setIsSaved(inWishlist);
    } catch (err) {
      console.error("Wishlist check error", err);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation(); // prevent card click navigation
    if (!user) return navigate("/login");

    try {
      if (isSaved) {
        await removeFromWishlist(book.id);
        setIsSaved(false);
      } else {
        await addToWishlist(book.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Wishlist toggle error", err);
    }
  };

  return (
    <div className="book-card" onClick={() => navigate(`/books/${book.id}`)}>
      {/* ================== WISHLIST BUTTON ================== */}
      <button 
        className={`wishlist-btn ${isSaved ? "active" : ""}`}
        onClick={handleWishlistToggle}
        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isSaved ? "❤️" : "🤍"}
      </button>

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
        loading="lazy"
        decoding="async"
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

        {!hideRent && (
          <button
            className="btn-rent"
            onClick={(e) => {
                 e.stopPropagation();
                 navigate(`/books/${book.id}`);
            }}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
