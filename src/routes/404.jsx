import React from "react";
import "../css/home.css";
import logo from "../images/contest_logo_1.svg";
import leftLeaf from "../images/leftLeaf.svg";
import rightLeaf from "../images/rightLeaf.svg";
import dots from "../images/dots.svg";
import { NavLink } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="Home">
      {/* =========
       HERO
       ======== */}
      <div className="hero">
        <img src={logo} alt="campus_tv" style={{ width: "25%" }} />
        <div
          style={{ color: "#efce4d" }}
          className="d-flex flex-column align-items-center mt-3"
        >
          <h1>404</h1>
          <h3>Oops! Page not found</h3>
          <NavLink to="/">
            <button className="heroBtn Btn">Home</button>
          </NavLink>
        </div>
        {/* dots */}
        <img src={dots} alt="dots" className="dots1" />
        <img src={dots} alt="dots" className="dots2" />
        <img src={dots} alt="dots" className="dots3" />
        {/* leafs */}
        <img src={leftLeaf} alt="leaf" className="leftLeaf" />
        <img src={rightLeaf} alt="leaf" className="rightLeaf" />
      </div>
    </div>
  );
}

export default ErrorPage;
