import axiosInstance from "./axiosInstance";

// Submit a review
export const submitReview = async (bookId, rating, reviewText) => {
  try {
    const response = await axiosInstance.post("/reviews", {
      book_id: bookId,
      rating,
      review_text: reviewText,
    });
    return response.data;
  } catch (err) {
    console.error("Failed to submit review:", err.response?.data || err.message);
    throw err;
  }
};

// Get reviews for a book
export const getBookReviews = async (bookId) => {
  try {
    const response = await axiosInstance.get(`/reviews/book/${bookId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch reviews:", err.response?.data || err.message);
    throw err;
  }
};

// Check if user can review
export const checkReviewStatus = async (bookId) => {
  try {
    const response = await axiosInstance.get(`/reviews/check/${bookId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to check review status:", err.response?.data || err.message);
    throw err;
  }
};
