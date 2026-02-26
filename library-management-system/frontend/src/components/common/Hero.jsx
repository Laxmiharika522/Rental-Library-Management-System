import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="hero">
      <h1>The Gateway to Infinite Worlds</h1>
      <p>📚 Browse, discover, and explore your next read ✨ — a world of books is just a click away 🌐</p>
      <button 
        className="cta-button" 
        onClick={() => navigate("/catalog")}
      >
        Explore Library
      </button>
    </section>
  );
};

export default Hero;
