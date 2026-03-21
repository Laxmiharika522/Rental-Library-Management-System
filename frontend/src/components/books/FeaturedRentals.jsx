// frontend/src/components/books/FeaturedRentals.js
import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import axios from "axios";
import "../../styles/FeaturedRentals.css";

const FeaturedRentals = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await axios.get( //directly here we are using axios to fetch the featured rentals from the backend. 
          "http://localhost:5000/api/books/featured"
        );

        setBooks(response.data.books || []);
      } catch (error) {
        console.error("Error fetching featured rentals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  if (loading) return <p>Loading featured rentals...</p>;
  if (books.length === 0) return <p>No featured rentals available.</p>;

  return (
    <div className="featured-rentals-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default FeaturedRentals;
