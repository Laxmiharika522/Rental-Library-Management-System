import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="hero">

      {/* Eyebrow Badge */}
      <div className="hero-badge">
        <span>✨</span>
        <span>Your Digital Library Experience</span>
      </div>

      {/* Heading */}
      <h1>
        The Gateway to{" "}
        <span className="hero-highlight">Infinite Worlds</span>
      </h1>

      {/* Subtitle */}
      <p>
        Browse, discover, and rent your next favourite read — thousands of books
        across every genre, available at your fingertips.
      </p>

      {/* CTA Buttons */}
      <div className="hero-actions">
        <button
          className="cta-button"
          onClick={() => navigate("/catalog")}
        >
          📚 Explore Library
        </button>
        <button
          className="cta-secondary"
          onClick={() => navigate("/categories")}
        >
          Browse Categories
        </button>
      </div>

      {/* Stats Row */}
      <div className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-value">500+</span>
          <span className="hero-stat-label">Books Available</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">12</span>
          <span className="hero-stat-label">Categories</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">1000+</span>
          <span className="hero-stat-label">Happy Readers</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll">
        <div className="scroll-wheel">
          <div className="scroll-dot" />
        </div>
        <span>Scroll to explore</span>
      </div>

    </section>
  );
};

export default Hero;
