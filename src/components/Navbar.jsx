import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
          Ajouter un mot
        </Link>
        <Link to="/vocabulary" className="nav-link" onClick={() => setIsOpen(false)}>
          Vocabulaire
        </Link>
        <Link to="/revision" className="nav-link" onClick={() => setIsOpen(false)}>
          Révision
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
