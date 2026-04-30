import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
      <div className="navbar">
        <div className="logo">RankMyCV</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#analysis">Analysis</a></li>
          <li><a href="#tips">Career Tips</a></li>
        </ul>
        <button className="nav-btn">Upload and Scan</button>
      </div>
  );
};

export default Navbar;