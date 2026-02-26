// src/components/books/FeaturedAuthors.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axiosInstance";
import "../../styles/FeaturedAuthors.css";

const FeaturedAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await api.get("/books/featured-authors"); //If your backend has a specific endpoint for featured authors, use that. Otherwise, you might need to fetch all books and derive authors from there.
        setAuthors(res.data || []);
      } catch (err) {
        console.error("Failed to load authors", err);
        setError("Failed to load authors");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) {
    return <p className="authors-loading">Loading authors...</p>;
  }

  if (error) {
    return <p className="authors-error">{error}</p>;
  }

  if (authors.length === 0) {
    return <p className="authors-empty">No authors found.</p>;
  }

  return (
    <div className="featured-authors">
      {authors.map((author) => (
        <div
          key={author.name}
          className="author-card"
          onClick={() =>
            navigate(`/authors/${encodeURIComponent(author.name)}`) //this navigation is based on authorname
          }
        >
          <div className="author-avatar">
          {/* to get the first letter of the author's name and display it as an avatar.  */}
            {author.name?.charAt(0).toUpperCase()} 
          </div>

          <h3 className="author-name">{author.name}</h3>

          <p className="author-books">
            {author.book_count} {author.book_count === 1 ? "book" : "books"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeaturedAuthors;

