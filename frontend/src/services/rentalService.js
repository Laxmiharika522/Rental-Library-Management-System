//frontend\src\services\rentalService.js
import axiosInstance from "./axiosInstance";

// Rent a book
export const rentBook = async (bookId) => {
  try {
    const response = await axiosInstance.post("/rentals", { book_id: bookId });
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
    console.error("Failed to get rentals:", err.response?.data || err.message);
    throw err;
  }
};
