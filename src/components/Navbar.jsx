import React from "react";
import logo from "../images/logo.png";
// import Menu from "../images/menu.svg";
import { NavLink } from "react-router-dom";
import "../css/navbar.css";

function Navbar() {
  return (
    <nav className="navbar d-flex align-items-center justify-content-center">
      <a href="https://faceofcampusnigeria.com.ng">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
      </a>
      {/* <div className="menu">
        <img src={Menu} alt="menu" />
      </div> */}
    </nav>
  );
}

export default Navbar;
