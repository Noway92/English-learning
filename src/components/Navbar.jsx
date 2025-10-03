import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Ajouter un mot</Link>
      <Link to="/vocabulary" className="nav-link">Vocabulaire</Link>
      <Link to="revision" className="nav-link">Revision</Link>
    </nav>
  );
};

export default Navbar;
