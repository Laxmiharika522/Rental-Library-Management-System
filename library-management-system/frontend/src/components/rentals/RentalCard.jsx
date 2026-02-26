// src/components/rentals/RentalCard.jsx
import React from "react";
import "../../styles/RentalCard.css"; // make sure path is correct

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString(); // Format like 31/01/2026
}

function RentalCard({ rental }) {
  if (!rental) return null; // handle null rentals

  const book = rental.book || {};
  const fine = rental.fine_amount ?? 0; // default to 0 if undefined

  return (
    <div className={`rental-card ${rental.status || ""}`}>
      <h3 className="rental-title">{book.title || "Untitled Book"}</h3>
      <p className="rental-author">
        <strong>Author:</strong> {book.author || "Unknown"}
      </p>
      <p className="rental-dates">
        <strong>Rented On:</strong> {formatDate(rental.rental_date)} |{" "}
        <strong>Due:</strong> {formatDate(rental.due_date)}
      </p>
      <p className="rental-return">
        <strong>Returned On:</strong>{" "}
        {rental.return_date ? formatDate(rental.return_date) : "Not returned"}
      </p>
      <p className={`rental-status ${rental.status || ""}`}>
        <strong>Status:</strong>{" "}
        {rental.status
          ? rental.status.charAt(0).toUpperCase() + rental.status.slice(1)
          : "Unknown"}
      </p>
    </div>
  );
}

export default RentalCard;


