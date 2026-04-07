// src/pages/Home.jsx
import React from "react";
import Hero from "../components/common/Hero";
import FeaturedRentals from "../components/books/FeaturedRentals";
import Categories from "../components/books/Categories";
import FeaturedAuthors from "../components/books/FeaturedAuthors";
import RecommendedForYou from "../components/books/RecommendedForYou";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container home-fade-in">
      <Hero />

      <div className="section-wrapper bg-light">
        <div className="section-header">
          <h2 className="section-title">Trending Books</h2>
          <p className="section-subtitle">
            Discover the most-rented books our members are loving right now.
          </p>
        </div>
        <FeaturedRentals />
      </div>

      <div className="section-wrapper bg-alt">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">
            From fiction to science — find books in every genre you love.
          </p>
        </div>
        <Categories />
      </div>

      <div className="section-wrapper bg-light">
        <div className="section-header">
          <h2 className="section-title">Featured Authors</h2>
          <p className="section-subtitle">
            Explore works by our most celebrated and popular authors.
          </p>
        </div>
        <FeaturedAuthors />
      </div>

      {/* Recommended for You section */}
      <div className="section-wrapper bg-alt">
        <div className="section-header">
          <h2 className="section-title">Recommended for You</h2>
          <p className="section-subtitle">
            Based on library trends and popular interest.
          </p>
        </div>
        <RecommendedForYou />
      </div>
    </div>
  );
};

export default Home;
