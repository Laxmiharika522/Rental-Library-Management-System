//frontend\src\services\adminService.js
import axiosInstance from "./axiosInstance";

//If the logged-in user is an admin, backend sends the response; otherwise it blocks the request.
const adminService = {
  //Get admin dashboard statistics if the user is an admin.
  getDashboardStats: async () => {
    const response = await axiosInstance.get("/admin/dashboard");
    return response.data;
  },

  //Fetch all users from backend (admin-only) and return the data.
  getAllUsers: async () => {
    const response = await axiosInstance.get("/admin/users");
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  },

  promoteUser: async (id) => {
    const response = await axiosInstance.put(`/admin/users/${id}/role`, { role: "admin" });
    return response.data;
  },

  demoteUser: async (id) => {
    const response = await axiosInstance.put(`/admin/users/${id}/role`, { role: "user" });
    return response.data;
  },

  addUser: async (userData) => {
    const response = await axiosInstance.post("/admin/users", userData);
    return response.data;
  },

  getAllBooks: async () => {
    const response = await axiosInstance.get("/admin/books");
    return response.data;
  },

  addBook: async (bookData) => {
    const response = await axiosInstance.post("/admin/books", bookData);
    return response.data;
  },

  updateBook: async (bookId, bookData) => {
    const response = await axiosInstance.put(`/admin/books/${bookId}`, bookData);
    return response.data;
  },

  deleteBook: async (bookId) => {
    const response = await axiosInstance.delete(`/admin/books/${bookId}`);
    return response.data;
  },

  getAllRentals: async () => {
    const response = await axiosInstance.get("/admin/rentals");
    return response.data;
  },

  getActiveRentals: async () => {
    const response = await axiosInstance.get("/admin/rentals/active");
    return response.data;
  },

  markRentalReturned: async (rentalId) => {
    const response = await axiosInstance.put(`/admin/rentals/${rentalId}/return`);
    return response.data;
  },
};

export default adminService;