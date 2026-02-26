// frontend/src/admin/pages/AdminBooks.js
import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import "../../styles/AdminBooks.css";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllBooks();
      setBooks(data || []);
    } catch (err) {
      console.error("Failed to load books database", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 2. Delete Book
  const handleDelete = async (id) => {
    if (!window.confirm("Confirm deletion of this book from database?")) return;
    try {
      await adminService.deleteBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      alert("Error deleting book");
    }
  };

  // 3. Update Book (Price per day or Stock)
  const handleUpdate = async (id, field, value) => {
    try {
      const updateData = {
        [field]:
          field === "price_per_day"
            ? parseFloat(value)
            : parseInt(value),
      };

      await adminService.updateBook(id, updateData);

      // Update UI instantly
      setBooks((prev) =>
        prev.map((book) =>
          book.id === id ? { ...book, ...updateData } : book
        )
      );
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update book details.");
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        Loading Library Inventory...
      </div>
    );
  }

  return (
    <div className="admin-management-page">
      <div className="management-header">
        <h2>Books Inventory Management</h2>
        <button className="btn-add-book">
          + Add New Book
        </button>
      </div>

      <div className="table-container">
        <table className="admin-db-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Price / Day ($)</th>
              <th>Total Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.length > 0 ? (
              books.map((book) => (
                <tr key={book.id}>
                  <td>#{book.id}</td>
                  <td className="book-title">{book.title}</td>
                  <td>{book.author}</td>

                  {/* PRICE PER DAY */}
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={book.price_per_day}
                      onBlur={(e) =>
                        handleUpdate(
                          book.id,
                          "price_per_day",
                          e.target.value
                        )
                      }
                      className="price-input"
                    />
                  </td>

                  {/* TOTAL COPIES */}
                  <td>
                    <input
                      type="number"
                      defaultValue={book.total_copies}
                      onBlur={(e) =>
                        handleUpdate(
                          book.id,
                          "total_copies",
                          e.target.value
                        )
                      }
                      className="stock-input"
                    />
                  </td>

                  <td>
                    <div className="action-group">
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No books found in inventory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBooks;
