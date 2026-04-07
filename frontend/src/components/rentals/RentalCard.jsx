// src/components/rentals/RentalCard.jsx
import React, { useState, useEffect } from "react";
import { returnBook } from "../../services/rentalService";
import { checkReviewStatus, submitReview } from "../../services/reviewService";
import "../../styles/RentalCard.css";

const RentalCard = ({ rental, onReturnSuccess }) => {
    const [isReturning, setIsReturning] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Review States
    const [reviewLoading, setReviewLoading] = useState(true);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [reviewData, setReviewData] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const book = rental?.book || {};

    useEffect(() => {
        if (book.id) {
            fetchReviewStatus();
        }
    }, [book.id]);

    const fetchReviewStatus = async () => {
        try {
            const status = await checkReviewStatus(book.id);
            if (status.already_reviewed) {
                setHasReviewed(true);
                setReviewData(status.review);
            }
        } catch (err) {
            console.error("Review status check failed", err);
        } finally {
            setReviewLoading(false);
        }
    };

    const handleReturn = async () => {
        if (!window.confirm(`Are you sure you want to return "${book.title}"?`)) return;
        setLoading(true);
        try {
            await returnBook(rental.id);
            setIsReturning(true);
            setTimeout(() => onReturnSuccess(rental.id), 500);
        } catch (err) {
            alert("Failed to return book.");
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            const newRes = await submitReview(book.id, rating, comment);
            setHasReviewed(true);
            setReviewData(newRes);
        } catch (err) {
            alert(err.response?.data?.error || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (!rental) return null;
    const isOverdue = new Date() > new Date(rental.due_date);

    return (
        <div className={`rental-card-wrapper ${isReturning ? "returning" : ""}`}>
            <div className="rental-card">
                {/* 📸 Book Cover */}
                <img src={book.image_url || "/book-placeholder.png"} alt={book.title} />

                {/* 📝 Book Info */}
                <div className="rental-info">
                    <div className={`status-badge ${isOverdue ? "overdue" : "active"}`}>
                        {isOverdue ? "⚠️ Overdue" : "🟢 Status: Active"}
                    </div>
                    <h3>{book.title}</h3>
                    <p className="author">by {book.author}</p>
                </div>

                {/* 📅 Date & Actions */}
                <div className="rental-dates">
                    <div className="date-group">
                        <label>Rented On</label>
                        <span>{formatDate(rental.rental_date)}</span>
                    </div>
                    <div className="date-group">
                        <label>Due Date</label>
                        <span style={{ color: isOverdue ? "#DC2626" : "inherit" }}>
                            {formatDate(rental.due_date)}
                        </span>
                    </div>

                    <button 
                        className={`btn-return-direct ${isOverdue ? "late" : ""}`}
                        onClick={handleReturn}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : isOverdue ? "Return Now (Late)" : "Return Book"}
                    </button>
                </div>
            </div>

            {/* ⭐ REVIEWS SECTION (Always visible on My Rentals cards) */}
            <div className="rental-review-section">
                <hr className="review-divider" />
                {reviewLoading ? (
                    <div className="review-loading">Checking review status...</div>
                ) : hasReviewed ? (
                    <div className="submitted-review">
                        <h4>Your Review</h4>
                        <div className="stars">
                            {"★".repeat(reviewData?.rating)}{"☆".repeat(5 - reviewData?.rating)}
                        </div>
                        <p>"{reviewData?.review_text}"</p>
                    </div>
                ) : (
                    <form className="review-form" onSubmit={handleReviewSubmit}>
                        <h4>Rate & Review this Book</h4>
                        <div className="star-selector">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span 
                                    key={num} 
                                    className={`star ${rating >= num ? "filled" : ""}`}
                                    onClick={() => setRating(num)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea 
                            placeholder="Share your thoughts about this book..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={submittingReview} className="btn-submit-review">
                            {submittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RentalCard;
