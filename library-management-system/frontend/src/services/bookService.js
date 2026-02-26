// src/services/bookService.js
import axios from "axios";
import api from "./axiosInstance";

const API_URL = "http://localhost:5000/api/books";

export const getBooks = async (page = 1, perPage = 6, search = "") => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        page,
        per_page: perPage,
        search: search || undefined, 
      },
    });

    return response.data; // { books, total, pages, current_page }
  } catch (error) {
    console.error("Error fetching books:", error);
    return { books: [], pages: 1 };
  }
};

export const getBookById = (id) => api.get(`/books/${id}`);
