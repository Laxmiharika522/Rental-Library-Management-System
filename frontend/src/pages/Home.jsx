// src/pages/Home.js
import React from "react";
import Hero from "../components/common/Hero";
import FeaturedRentals from "../components/books/FeaturedRentals";
import Categories from "../components/books/Categories";
import FeaturedAuthors from "../components/books/FeaturedAuthors"
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container home-fade-in">
      <Hero />

      <div className="section-wrapper bg-light">
        <h2 className="section-title">Trending</h2>
        <FeaturedRentals />
      </div>

      <div className="section-wrapper bg-alt">
        <h2 className="section-title">Browse by Category</h2>
        <Categories />
      </div>

      <div className="section-wrapper bg-light">
       <h2 className="section-title">Featured Authors</h2>
        <FeaturedAuthors />
      </div>
    </div>
  );
};

export default Home;
