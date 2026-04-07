// frontend/src/services/rentalService.js
import axiosInstance from "./axiosInstance";

// Rent a book
export const rentBook = async (bookId, duration) => {
  try {
    const response = await axiosInstance.post("/rentals", { 
        book_id: bookId, 
        duration: duration 
    });
    return response.data;
  } catch (err) {
    console.error("Failed to rent book:", err.response?.data || err.message);
    throw err;
  }
};

// Get all rentals for the current user
export const getUserRentals = async () => {
  try {
    const response = await axiosInstance.get("/rentals/user");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch rentals:", err.response?.data || err.message);
    throw err;
  }
};

export const getUserRentalHistory = async () => {
  try {
    const response = await axiosInstance.get('/rentals/history');
    return response.data;
  } catch (err) {
    console.error("Failed to fetch history:", err.response?.data || err.message);
    throw err;
  }
};

export const returnBook = async (rentalId) => {
  try {
    const response = await axiosInstance.post(`/rentals/${rentalId}/return`);
    return response.data;
  } catch (err) {
    console.error("Failed to return book:", err.response?.data || err.message);
    throw err;
  }
};
