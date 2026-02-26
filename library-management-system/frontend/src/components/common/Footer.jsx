// src/components/common/Footer.js
import React from "react";
import "../../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Brand */}
        <div className="footer-section brand">
          <h3>📚 Magpie Books</h3>
          <p>
            Smart, digital library platform for books, audiobooks, magazines,
            comics, and academic resources.
          </p>
        </div>

        {/* Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
        </div>

        {/* Social */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Magpie Books. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;