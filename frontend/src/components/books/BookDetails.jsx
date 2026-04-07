// frontend/src/components/books/BookDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { getBookReviews } from "../../services/reviewService";
import { addToWishlist, removeFromWishlist, getWishlist } from "../../services/wishlistService";
import "../../styles/BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  const [reviewsData, setReviewsData] = useState({ average_rating: 0, total_reviews: 0, reviews: [] });
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBook();
    fetchReviews();
    if (user) {
      checkWishlist();
    }
  }, [id]);

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

  const fetchReviews = async () => {
    try {
      const data = await getBookReviews(id);
      setReviewsData(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const res = await getWishlist();
      const inWishlist = res.data.some(item => item.book_id === parseInt(id));
      setIsSaved(inWishlist);
    } catch (err) {
      console.error("Wishlist check error", err);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) return navigate("/login");
    try {
      if (isSaved) {
        await removeFromWishlist(id);
        setIsSaved(false);
      } else {
        await addToWishlist(id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Wishlist toggle error", err);
    }
  };

  if (loading) return <div className="page-loader"><div className="loader-ring" /></div>;
  if (!book) return <div className="error">Book not found</div>;

  return (
    <div className="book-details-container">
      {/* ─── MAIN BOOK CARD ────────────────────────────────────────── */}
      <div className="book-details-card">
        <div className="book-cover-section">
          <img src={book.image_url || "/book-placeholder.png"} alt={book.title} />
        </div>

        <div className="book-info-section">
          <div className="category-badge">{book.category}</div>
          <h1>{book.title}</h1>
          <div className="author-link">by <span>{book.author}</span></div>

          <div className="rating-summary">
            <span className="stars">
                {"★".repeat(Math.round(reviewsData.average_rating))}{"☆".repeat(5 - Math.round(reviewsData.average_rating))}
            </span>
            <span className="score-tag">
                {reviewsData.average_rating}
            </span>
            <span className="count-text">
                ({reviewsData.total_reviews} {reviewsData.total_reviews === 1 ? "review" : "reviews"})
            </span>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Publisher</span>
              <span className="detail-value">{book.publisher || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Published</span>
              <span className="detail-value">{book.publication_year || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span className="detail-value">{book.category}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Available</span>
              <span className="detail-value">{book.available_copies} / {book.total_copies} copies</span>
            </div>
          </div>

          <p className="book-description">
            {book.description || "The story of success and what makes high achievers."}
          </p>

          <div className="price-tag">
            ₹{book.price_per_day} <span className="price-unit">per day</span>
          </div>

          <div className="action-buttons">
            <button
              className="btn-rent-large"
              disabled={book.available_copies <= 0}
              onClick={() => navigate(`/rent/${id}`)}
            >
              📖 {book.available_copies > 0 ? "Rent This Book" : "Out of Stock"}
            </button>
            <button
              className={`btn-saved ${isSaved ? "active" : ""}`}
              onClick={handleWishlistToggle}
            >
              {isSaved ? "❤️ Saved" : "🤍 Save"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── REVIEWS SECTION ─────────────────────────────────────── */}
      <div className="reviews-section">
          <h2>Community Reviews</h2>
          
          {reviewsLoading ? (
              <p className="loading-text">Loading community feedback...</p>
          ) : reviewsData.reviews.length === 0 ? (
              <p className="empty-text">No reviews yet. Rented this book? Share your thoughts in your "My Rentals" dashboard!</p>
          ) : (
              <div className="reviews-list">
                  {reviewsData.reviews.map((rev) => (
                      <div key={rev.id} className="review-card-item">
                          <div className="review-meta">
                              <div className="review-user-info">
                                  <span className="review-user">{rev.username}</span>
                                  <span className="review-date">
                                      {new Date(rev.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                              </div>
                              <div className="review-stars-row" style={{color: "#FFB800", fontSize: "1rem"}}>
                                  {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                              </div>
                          </div>
                          <p className="review-comment">"{rev.review_text}"</p>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
};

export default BookDetails;