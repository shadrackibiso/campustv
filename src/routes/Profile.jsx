import React, { useEffect, useState } from "react";
import "../css/contestants.css";
import avatar from "../images/avatar.png";
import firebase from "firebase/app";
import ReactLoading from "react-loading";
import {
  MdCheckCircle,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { PaystackButton } from "react-paystack";
import { v4 as uuidv4 } from "uuid";

function Profile(props) {
  const [contestant, setContestant] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);

  // fetch data
  useEffect(() => {
    setContestant(...props.location.state);
  }, []);

  const Loader = () => (
    <div
      className="dataLoader mt-3 flex-column justify-content-center align-items-center"
      style={{ display: contestant ? "none" : "flex", width: "100%" }}
    >
      <div className="reactLoaderContainer">
        <ReactLoading type="spokes" color="#fbf03b" height={30} width={30} />
      </div>
    </div>
  );

  const SuccessModal = (props) => (
    <div className="successModal" style={{ display: !displayModal && "none" }}>
      <div className="modalBlind"></div>
      <div className="modalContainer">
        <div className="successModalImage">
          {/* profile created icon */}
          <span>
            <MdCheckCircle />
          </span>
        </div>
        <div className="successModalMessage">
          <span>You've successfully voted for {props.name}</span>
          <p>
            Please don't panic if you're vote doesn't reflect immediately, it
            might take some time to process. Thank you.
          </p>
        </div>
        <button className="secBtn" onClick={() => setDisplayModal(false)}>
          Done
        </button>
      </div>
    </div>
  );

  const ContestantCard = (props) => {
    const [displayVoteForm, setDisplayVoteForm] = useState(false);

    // paystack payment
    const publicKey = "pk_live_17a4612f24ae4b194c781e93be4198ec341f12c6";
    // const publicKey = "pk_test_d75000a6f826ad09ae2840ad021d6ffb6c629dd8";
    const [amount, setAmount] = useState(5000);
    const [email, setEmail] = useState("");

    // handle payment function
    const handleSuccessfulPayment = () => {
      let amountPaid = amount / 100;
      let points = amountPaid / 50;

      firebase
        .firestore()
        .collection("users")
        .doc(`${props.name}-${props.id}`)
        .update({
          points: firebase.firestore.FieldValue.increment(eval(points)),
        })
        .then(() => {
          setContestant({
            ...contestant,
            points: (contestant.points += points),
          });
        })
        .catch((error) => console.log(error));

      setDisplayModal(true);
    };

    const refName = contestant.name.split(" ").join("-");
    const reference = `${refName}-${uuidv4()}`;
    const componentProps = {
      email, // email of user who is voting
      amount, // vote amount
      reference, // id of person voted for
      publicKey, // api key
      text: "Sell", //button text
      onSuccess: () => handleSuccessfulPayment(),
      onClose: () => alert("oops! transaction could not be processed."),
    };

    // content
    return (
      <div className="">
        <div className="ctsCard">
          {/* profile pic */}
          <div className="ctsCardImage">
            <img
              src={props.profilePic ? props.profilePic : avatar}
              alt="contestant"
              loading="lazy"
            />
          </div>
          <div className="ctsCardDetails">
            {/* name */}
            <div className="ctsCardDetail">
              <div className="ctsCardLabel">Name</div>
              {props.name}
            </div>
            {/* age */}
            <div className="ctsCardDetail">
              <div className="ctsCardLabel">Age</div>
              {props.age}
            </div>
            {/* state */}
            <div className="ctsCardDetail">
              <div className="ctsCardLabel">State</div>
              {props.state}
            </div>
            {/* points */}
            <div className="ctsCardDetail">
              <div className="ctsCardLabel">Points</div>
              {props.points}
            </div>
          </div>
          {/* ===
          VOTE
          ==== */}
          <div
            className="ctsCardVoteBtn"
            onClick={() => setDisplayVoteForm((prevState) => !prevState)}
          >
            <div>ticket</div>
            <div>
              <span style={{ display: displayVoteForm && "none" }}>
                <MdKeyboardArrowDown />
              </span>
              <span style={{ display: !displayVoteForm && "none" }}>
                <MdKeyboardArrowUp />
              </span>
            </div>
          </div>
          {/*=====
           vote form 
           ==== */}
          <form
            style={{ display: !displayVoteForm && "none" }}
            onSubmit={(e) => e.preventDefault()}
          >
            {/* email */}
            <div className="inputLabel">your email</div>
            <input
              type="email"
              name="email"
              className="inputBox"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            {/* amount */}
            <div className="inputLabel">sell ticket</div>
            <select
              name="amount"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            >
              <option value="60000">All tickets (N60,000)</option>
              <option value="30000">Half (N30,000)</option>
              <option value="10000">Min tickets (N10,000)</option>
              {/* <option value="5000">1 vote (N50)</option>
              <option value="50000">10 votes (N500)</option>
              <option value="100000">20 votes (N1000)</option>
              <option value="250000">50 votes (N2500)</option>
              <option value="500000">100 votes (N5000)</option>
              <option value="1000000">200 votes (N10000)</option> */}
            </select>
            {/* button */}
            <PaystackButton {...componentProps} />
            {/* ===== */}
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <SuccessModal {...contestant} />
      <div className="contestants section mt-5">
        <div className="d-flex flex-column justify-content-center align-items-center">
          {/* <!-- label --> */}
          <div className="label">Profile</div>
          <div className="labelLine"></div>

          {/* =======================================
        =======================================
         PROFILE DETAILS
         =======================================
         ======================================= */}
          <div className="ctsCardContainer row px-3 mt-3 px-lg-5">
            <Loader />
            {contestant && (
              <ContestantCard {...contestant} key={contestant.id} />
            )}
          </div>
          {/* =================== */}
        </div>
      </div>
    </>
  );
}

export default Profile;
