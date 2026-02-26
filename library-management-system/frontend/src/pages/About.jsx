// src/pages/About.js
import React from "react";
import "../styles/About.css";

const About = () => {
 return (
    <div className="about-wrapper">

      <div className="about-header">
        <h1>About Magpie Books</h1>
        <p>Smart • Digital • Library Management System</p>
      </div>

      <div className="about-card">
        <h3 className="title">Who We Are</h3>
        <p>
          Magpie Books is a modern Library Management System designed to
          simplify book borrowing, catalog management, and user administration.
          It helps librarians and readers interact through a digital platform
          instead of manual paperwork.
        </p>
      </div>

      <div className="about-card">
        <h3 className="title">Our Mission</h3>
        <p>
          To provide an easy-to-use platform that helps libraries manage their
          collections efficiently while giving readers a smooth experience to
          discover, borrow, and track books.
        </p>
      </div>

      <div className="about-card">
        <h3 className="title">Features</h3>

        <ul className="feature-list">
          <li>Browse and search book catalog</li>
          <li>Borrow and return books online</li>
          <li>User accounts and profiles</li>
          <li>Admin dashboard for librarians</li>
          <li>Rental history tracking</li>
          <li>Author & category management</li>
          <li>Fine and due date system</li>
        </ul>
      </div>

      <div className="about-card">
        <h3 className="title">Technology</h3>
        <p>
          Built using React JS, Node.js, Express, MongoDB and REST API to
          ensure performance, security, and scalability.
        </p>
      </div>


    </div>
  );
};

export default About;

