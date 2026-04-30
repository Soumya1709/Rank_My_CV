import React from "react";
import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="navbar">

      <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        RankMyCV
      </div>

      <ul className="nav-links">

        <li>
          <a href="/" className={location.pathname === "/" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("/"); }}>
            Home
          </a>
        </li>

        <li>
          <a href="/analysis" className={location.pathname === "/analysis" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("/analysis"); }}>
            Analysis
          </a>
        </li>

        <li>
          <a href="/career-tips" className={location.pathname === "/career-tips" ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate("/career-tips"); }}>
            Career Tips
          </a>
        </li>

      </ul>

      <button className="nav-btn" onClick={() => navigate("/analysis")}>
        Upload and Scan
      </button>

    </div>
  );
};

export default Navbar;