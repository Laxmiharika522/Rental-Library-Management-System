// .container → outer wrapper
// .category-grid → arranges cards in a grid
// categories.map() → loops over categories
// .category-card → one clickable category card, with dynamic styling
// .category-content → holds title + book count
// handleClick → runs when card is clicked


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import "../../styles/Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/books/categories")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("API Error:", err));
  }, []);

  const handleClick = (category) => {
    //Typically used to filter books by that category or navigate to a category page.
    navigate(`/books?category=${encodeURIComponent(category)}`);
  };

  // Helper function to turn special characters into valid CSS class names
const generateClassName = (title) => {
    return title
      .toLowerCase()
      .replace(/&/g, "and")         // replace & with and
      .replace(/'/g, "")            // remove apostrophes (Children'S -> childrens)
      .replace(/\(|\)/g, "")        // remove parentheses (Ya -> ya)
      .replace(/[^a-z0-9]/g, "-")   // replace spaces/specials with -
      .replace(/-+/g, "-")          // remove double hyphens
      .replace(/^-+|-+$/g, "");     // trim hyphens from ends
  };

  return (
    <div className="container">
      <div className="category-grid">
        {categories.map((cat, index) => (
          <div
          // key={index} → React needs a unique key for each element in a list for efficient renderin
            key={index}
            className={`category-card ${generateClassName(cat.title)}`}
            // category-card → basic styling for all category cards.
            // ${generateClassName(cat.title)} → adds a dynamic class based on category name.
            onClick={() => handleClick(cat.title)}
          >
            <div className="category-content">
              <h3>{cat.title}</h3>
              <p>{cat.items} {cat.items === 1 ? "book" : "books"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;