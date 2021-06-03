import React, { useState } from "react";
import "../css/home.css";
import logo from "../images/contest_logo_1.svg";
import leftLeaf from "../images/leftLeaf.svg";
import rightLeaf from "../images/rightLeaf.svg";
import dots from "../images/dots.svg";
import box from "../images/box.svg";
import { NavLink } from "react-router-dom";
import Register from "../components/Register";

function Home() {
  const [displayModal, setDisplayModal] = useState(false);

  return (
    <div className="Home">
      <Register
        displayModal={displayModal}
        closeModal={() => setDisplayModal(false)}
      />
      {/* =========
       HERO
       ======== */}
      <div className="hero">
        <img src={logo} alt="campus_tv" className="heroLogo" />
        <NavLink to="/contestants">
          <button className="heroBtn Btn">Vote</button>
        </NavLink>
        {/* dots */}
        <img src={dots} alt="dots" className="dots1" />
        <img src={dots} alt="dots" className="dots2" />
        <img src={dots} alt="dots" className="dots3" />
        {/* leafs */}
        <img src={leftLeaf} alt="leaf" className="leftLeaf" />
        <img src={rightLeaf} alt="leaf" className="rightLeaf" />
      </div>
      {/* ==========
      PRIZE
      ========== */}
      <div className="prizeContainer section">
        {/* dots */}
        <img src={dots} alt="dots" className="prizeDots1" />
        <img src={dots} alt="dots" className="prizeDots2" />
        {/* col 1 */}
        <div className="row align-items-stretch">
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="prize text-center">
              <h5>Grand Prize</h5>
              <h1 className="font-weight-bold">N200,000</h1>
              <p>
                One month free subscription
                <br />
                One month free advertising on CampusTv
              </p>
            </div>
          </div>
          {/* col 2 */}
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="prize text-center">
              <h5>1st Runner Up</h5>
              <h1 className="font-weight-bold">N100,000</h1>
              <p>One month free subscription</p>
            </div>
          </div>
          {/* col 3 */}
          <div className="col-md-4">
            <div className="prize text-center">
              <h5>2nd Runner Up</h5>
              <h1 className="font-weight-bold">N50,000</h1>
              <p>One month free subscription</p>
            </div>
          </div>
        </div>
        {/* Eligibility */}
        <div className="eligibilityContainer ">
          <img src={box} alt="box" className="box1" />
          <img src={box} alt="box" className="box2" />
          <div className="row align-items-stretch justify-content-center">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="colContainer">
                <h3>Eligibility</h3>
                <p>Male/Female students in any Nigerian University</p>
              </div>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="colContainer">
                <h3>Age</h3>
                <p>18-27 years</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="colContainer">
                <h3>Registration</h3>
                <p>N1000</p>
              </div>
            </div>
            <div className="col-md-4 mt-3 mb-3 mb-md-0">
              <div className="colContainer">
                <h3>Contact</h3>
                <p>09032300236</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
