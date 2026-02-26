//frontend\src\components\books\CategoryBooks.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import BookCard from "./BookCard";
import BookDetailsModal from "./BookDetailsModal";
import "../../styles/CategoryBooks.css";

const CategoryBooks = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category") || "All Books";

  //   Example URL: /category?category=Fiction
  // If no category is provided, defaults to "All Books".

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const perPage = 8;

  const fetchBooks = async (search = "", pageNumber = 1) => {
    try {
      setLoading(true);
      const params = { search, page: pageNumber, per_page: perPage };
      //see here we are checking if category is present and not equal to "All Books" then we add it to the params object. This way we can filter books by category when fetching from the API.
      if (category && category !== "All Books") params.category = category;

      const res = await axiosInstance.get("/books", { params });
      setBooks(res.data.books || []);
      setTotalPages(res.data.pages || 1);
      setPage(res.data.current_page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchTerm, 1);
  }, [category]);

//   When category in the URL changes, fetch new books automatically.
// Resets to page 1.

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchBooks(value, 1);
  };

  const handlePageChange = (newPage) => {
    fetchBooks(searchTerm, newPage);
  };

  return (
    <div className="category-books-container">
      <h2 className="category-title">{category}</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="books-grid">
        {loading ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          books.map((book) => (
            <BookCard key={book.id} book={book} onSelect={setSelectedBook} />
          ))
        )}
      </div>

      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

      {selectedBook && (
        <BookDetailsModal bookId={selectedBook.id} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
};

export default CategoryBooks;
