// frontend/src/pages/AuthorBooks.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axiosInstance";
import BookCard from "../components/books/BookCard";
import "../styles/AuthorBooks.css";

const AuthorBooks = () => {
  const { authorName } = useParams();
  const decodedAuthor = decodeURIComponent(authorName);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get("/books", {
        params: {
          search: decodedAuthor,
          page: 1,
          per_page: 1000, // 🔥 fetch ALL author books
        },
      })
      .then((res) => {
        setBooks(res.data.books || []);
      })
      .catch((err) => {
        console.error("Failed to load author books", err);
      })
      .finally(() => setLoading(false));
  }, [decodedAuthor]);

  return (
    <div className="catalog-container">
      <h2 className="catalog-title">📚 Books by {decodedAuthor}</h2>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found for this author.</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorBooks;
