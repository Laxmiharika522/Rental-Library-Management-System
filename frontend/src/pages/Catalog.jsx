// src/pages/Catalog.js
import React, { useEffect, useState } from "react";
import { getBooks } from "../services/bookService";
import BookCard from "../components/books/BookCard";
import "../styles/Catalog.css";

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBooks(page, searchTerm);
  }, [page, searchTerm]);

  const loadBooks = async (pageNumber, search) => {
    const data = await getBooks(pageNumber, 8, search); // 👈 pass search
    setBooks(data.books || []);
    setTotalPages(data.pages || 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // reset to first page on search
  };

  return (
    <div className="catalog-container">
      <h2 className="catalog-title">📚 Library Catalog</h2>

      {/* 🔍 Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {books.length === 0 ? (
        <p className="empty-text">No books found.</p>
      ) : (
        <>
          <div className="books-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (num) => (
                <button
                  key={num}
                  className={`page-btn ${page === num ? "active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Catalog;
