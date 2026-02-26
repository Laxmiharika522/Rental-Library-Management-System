// frontend/src/components/books/AddBook.js
import React, { useState } from "react";
import api from "../../services/axiosInstance";
import toast from "react-hot-toast";
import "../../styles/Auth.css";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [totalCopies, setTotalCopies] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !author ||
      !genre ||
      !pricePerDay ||
      !totalCopies
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/books", {
        title,
        author,
        genre,
        description,
        price_per_day: parseFloat(pricePerDay),
        total_copies: parseInt(totalCopies),
      });

      toast.success("Book added successfully 📚");

      // Reset form
      setTitle("");
      setAuthor("");
      setGenre("");
      setDescription("");
      setPricePerDay("");
      setTotalCopies("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Add New Book</h2>

        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <input
          type="text"
          placeholder="Genre (e.g. Fiction, Sci-Fi)"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />

        <textarea
          placeholder="Short Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Price Per Day ($)"
          value={pricePerDay}
          onChange={(e) => setPricePerDay(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total Copies"
          value={totalCopies}
          onChange={(e) => setTotalCopies(e.target.value)}
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
