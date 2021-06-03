import React from "react";
import "../css/register.css";
import "../css/home.css";

function Register(props) {
  return (
    <>
      <div className="Modal" style={{ display: !props.displayModal && "none" }}>
        <div className="backdrop" onClick={props.closeModal}></div>
        <div className="modalContainer">
          <div className="registerForm">
            <div className="section registerSection">
              {/* <!-- label --> */}
              <div className="label">Register</div>
              <div className="labelLine"></div>
              {/*  */}
              <div className="registerTerms">
                <ul>
                  <li>Registration costs N1000</li>
                  <li>
                    You must be between the age of 18-27 years to register for
                    this competition
                  </li>
                  <li>
                    You will be able to create your profile and upload an image
                    for the contest after payment has been successfully made
                  </li>
                </ul>
              </div>
              {/*  */}
              <a
                className="btnLink"
                href="https://paystack.com/pay/faceofcampustvreg"
              >
                <button className="mainBtn Btn">Pay Now</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
