import React, { useEffect, useState } from "react";
import { getRecommendedBooks } from "../../services/bookService";
import BookCard from "./BookCard";
import "../../styles/FeaturedRentals.css"; // Reuse featured styles

const RecommendedForYou = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecommended = async () => {
            try {
                const data = await getRecommendedBooks(5);
                setBooks(data.books || []);
            } catch (err) {
                console.error("Failed to load recommendations", err);
            } finally {
                setLoading(false);
            }
        };
        loadRecommended();
    }, []);

    if (loading) return null; // Or a skeleton

    return (
        <div className="featured-books-container">
            <div className="books-grid">
                {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
};

export default RecommendedForYou;
