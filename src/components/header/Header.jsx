import React from "react";
import {Link} from "react-router";
import "./Header.css";

const Header = () => {
  return (
    <nav className="navbar">
      <div className="logo">HostelMS</div>

      <ul className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/rooms">Rooms</Link>
        <Link to="/students">Students</Link>
        <li className="login-btn">Login</li>
      </ul>
    </nav>
  );
};

export default Header;