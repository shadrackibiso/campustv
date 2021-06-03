import React, { useEffect, useState } from "react";
import "../css/contestants.css";
import avatar from "../images/avatar.png";
import firebase from "firebase/app";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import {
  MdCheckCircle,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { PaystackButton } from "react-paystack";
import { v4 as uuidv4 } from "uuid";

function Contestants() {
  const [contestants, setContestants] = useState(null);
  const [selectedTab, displayTab] = useState(1);
  const [displayModal, setDisplayModal] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [selectedRankingTab, displayRankingTab] = useState(1);

  // fetch data
  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((data) => {
        let users = [];
        data.forEach((doc) => {
          users.push(doc.data());
        });
        setContestants(users);
      })
      .catch((error) => console.log(error));
  }, []);

  const search = () => {
    searchInput.length >= 3 && setSearchValue(searchInput);

    let searchResult = contestants.filter((cts) =>
      cts.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    setSearchResult(searchResult);
  };

  const Loader = () => (
    <div
      className="dataLoader mt-3 flex-column justify-content-center align-items-center"
      style={{ display: contestants ? "none" : "flex", width: "100%" }}
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
        <button className="secondaryBtn" onClick={() => setDisplayModal(false)}>
          Done
        </button>
      </div>
    </div>
  );

  const ContestantCard = (props) => {
    const [displayVoteForm, setDisplayVoteForm] = useState(false);
    // paystack payment
    const publicKey = "pk_live_17a4612f24ae4b194c781e93be4198ec341f12c6";
    // const publicKey = "pk_test_8ecbac418f27432bf99e076ae8e5e05e244499d2";
    const [amount, setAmount] = useState(5000);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const handleSuccessfulPayment = () => {
      let amountPaid = amount / 100;
      let points = amountPaid / 50;
      setContestants(
        contestants.map((cts) => {
          if (cts.id === props.id) {
            firebase
              .firestore()
              .collection("users")
              .doc(`${cts.name}-${cts.id}`)
              .update({
                points: firebase.firestore.FieldValue.increment(eval(points)),
              })
              .catch((error) => console.log(error));
            cts.points += 1;
          }
          return cts;
        })
      );
      setSelectedContestant(props);
      setDisplayModal(true);
    };
    const refName = name.split(" ").join("-");
    const reference = `${refName}-${uuidv4()}`;
    const componentProps = {
      email,
      amount,
      reference,
      publicKey,
      text: "Sell",
      onSuccess: () => handleSuccessfulPayment(),
      onClose: () => alert("oops! transaction could not be processed."),
    };

    return (
      <div className="col-lg-3 col-md-6">
        <div className="ctsCard">
          <div className="ctsCardImage">
            <img
              src={props.profilePic ? props.profilePic : avatar}
              alt="contestant"
              loading="lazy"
            />
          </div>
          <div className="ctsCardDetails">
            <h5 className="ctsCardDetail d-flex text-center justify-content-center">
              {/* <div className="ctsCardLabel">Name</div> */}
              {props.name}
            </h5>
            <div className="ctsCardDetail d-flex justify-content-center">
              <Link
                to={{
                  pathname: `/contestant/${props.name.split(" ").join("_")}`,
                  state: contestants.filter((cts) => cts.name === props.name),
                }}
                // to={`/contestant/${props.name.split(" ").join("_")}`}
              >
                <button className="mainBtn" style={{ fontSize: ".8rem" }}>
                  view profile
                </button>
              </Link>
            </div>
          </div>
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
          <form
            style={{ display: !displayVoteForm && "none" }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="inputLabel">your email</div>
            <input
              type="email"
              name="email"
              className="inputBox"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setName(props.name);
              }}
            />
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
            <PaystackButton {...componentProps} />
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* <SuccessModal {...selectedContestant} /> */}
      <div className="contestants section mt-5">
        <div className="d-flex flex-column justify-content-center align-items-center">
          {/* <!-- label --> */}
          <div className="label">Contestants</div>
          <div className="labelLine"></div>

          <div className="row no-gutters d-flex justify-content-between mt-5 w-100">
            {/* TAB */}
            <div className="col-12 col-lg-4">
              <div className="tab">
                <div
                  onClick={() => displayTab(1)}
                  className={selectedTab === 1 ? "activeTab" : ""}
                >
                  vote
                </div>
                <div
                  onClick={() => displayTab(2)}
                  className={selectedTab === 2 ? "activeTab" : ""}
                >
                  ranking
                </div>
              </div>
            </div>

            {/* SEARCH BAR */}
            <div className="col-12 col-lg-4">
              <form
                className="ctsSearchForm"
                style={{ display: selectedTab !== 1 && "none" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  search();
                }}
              >
                <input
                  type="text"
                  name="searchBar"
                  placeholder="Search Contestant..."
                  className="ctsSearchBar py-2"
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    // search();
                  }}
                />
                {/* <button className="searchBtn">search</button> */}
              </form>
            </div>
          </div>
        </div>

        {/* =======================================
        =======================================
         CONTESTANTS
         =======================================
         ======================================= */}
        <div
          className="ctsCardContainer row"
          style={{ display: selectedTab !== 1 && "none" }}
        >
          <Loader />
          {contestants &&
            contestants
              .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
              .filter((cts) =>
                cts.name.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((cts, i) => (
                <ContestantCard {...cts} key={cts.id} position={i} />
              ))}
        </div>

        {/* no contestant text */}
        {searchResult && searchResult.length === 0 && (
          <div className="text-white">
            no contestant found! Please ensure you typed the correct name.
          </div>
        )}

        {/* =======================================
        =======================================
         LEADER BOARD
         =======================================
         ======================================= */}
        <div
          className="ctsLeaderBoard"
          style={{ display: selectedTab !== 2 && "none" }}
        >
          <div className="row d-flex no-gutters w-100 justify-content-between">
            {/* TAB */}
            <div className="col-12">
              <div className="tab">
                <div
                  onClick={() => displayRankingTab(1)}
                  className={selectedRankingTab === 1 ? "activeTab" : ""}
                >
                  Male
                </div>
                <div
                  onClick={() => displayRankingTab(2)}
                  className={selectedRankingTab === 2 ? "activeTab" : ""}
                >
                  Female
                </div>
              </div>
            </div>
          </div>

          {/* MALE RANKING */}
          <div style={{ display: selectedRankingTab !== 1 && "none" }}>
            <div className="ctsRankingCard ctsRankingHeader">
              <div className="ctsRankingCardRank"></div>
              <div className="ctsRankingCardName">name</div>
              {/* <div className="ctsRankingCardVotes">votes</div> */}
            </div>

            <Loader />
            {contestants &&
              contestants
                .filter((cts) => cts.gender === "male")
                .sort((a, b) => (a.points > b.points ? -1 : 1))
                .map((cts, i) => (
                  <div key={cts.id} className="ctsRankingCard">
                    <div className="ctsRankingCardRank">{(i += 1)}</div>
                    <div className="ctsRankingCardName">{cts.name}</div>
                    {/* <div className="ctsRankingCardVotes">{cts.votes}</div> */}
                  </div>
                ))}
          </div>

          {/* FEMALE RANKING */}
          <div style={{ display: selectedRankingTab !== 2 && "none" }}>
            <div className="ctsRankingCard ctsRankingHeader">
              <div className="ctsRankingCardRank"></div>
              <div className="ctsRankingCardName">name</div>
              {/* <div className="ctsRankingCardVotes">votes</div> */}
            </div>

            <Loader />
            {contestants &&
              contestants
                .filter((cts) => cts.gender === "female")
                .sort((a, b) => (a.points > b.points ? -1 : 1))
                .map((cts, i) => (
                  <div key={cts.id} className="ctsRankingCard">
                    <div className="ctsRankingCardRank">{(i += 1)}</div>
                    <div className="ctsRankingCardName">{cts.name}</div>
                    {/* <div className="ctsRankingCardVotes">{cts.votes}</div> */}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Contestants;
