import React, { useEffect, useState } from "react";
import "../css/contestants.css";
import avatar from "../images/avatar.png";
import firebase from "firebase/app";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FaExternalLinkSquareAlt } from "react-icons/fa";
import ReactLoading from "react-loading";
import moment from "moment";
import { Link } from "react-router-dom";

function Admin() {
  const [contestants, setContestants] = useState(null);
  // const [groups, setGroups] = useState(null);
  // const [selectedGroup, setSelectedGroup] = useState("");
  const [searchValue, setSearchValue] = useState("");
  // const [contestants, setContestants] = useState([
  //   {
  //     id: "1",
  //     name: "cassandra shadrack",
  //     age: "19",
  //     gender: "male",
  //     university: "UNIPORT",
  //     state: "rivers state",
  //     points: 2500,
  //     group: "a1",
  //     createdAt: moment(),
  //   },
  //   {
  //     id: "2",
  //     name: "Diana prince",
  //     age: "19",
  //     gender: "male",
  //     university: "UNIPORT",
  //     state: "rivers state",
  //     points: 190,
  //     group: "a2",
  //     createdAt: moment(),
  //   },
  //   {
  //     id: "3",
  //     name: "angel hart",
  //     age: "19",
  //     gender: "male",
  //     university: "UNIPORT",
  //     state: "rivers state",
  //     points: 87,
  //     group: "a3",
  //     createdAt: moment(),
  //   },
  //   {
  //     id: "4",
  //     name: "Serena Williams",
  //     age: "19",
  //     gender: "male",
  //     university: "UNILAG",
  //     state: "rivers state",
  //     points: 102,
  //     group: "a2",
  //     createdAt: moment(),
  //   },
  // ]);

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

        // let allGroups = [];
        // users &&
        //   users.map((cts) => {
        //     allGroups.push(cts.group);
        //   });
        // let groupSet = new Set(allGroups);
        // setGroups([...groupSet]);
      })
      .catch((error) => console.log(error));
  }, []);

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

  const ContestantCard = (props) => {
    const [displayPointsForm, setDisplayPointsForm] = useState(false);
    // const [group, setGroup] = useState(props.group);
    const [points, setPoints] = useState(props.points);

    const handleContestantEdit = (e) => {
      e.preventDefault();
      setContestants(
        contestants.map((cts) => {
          if (cts.id === props.id) {
            firebase
              .firestore()
              .collection("users")
              .doc(`${cts.name}-${cts.id}`)
              .update({
                points,
              })
              .catch((error) => console.log(error));
            return { ...cts, points };
          }
          return cts;
        })
      );
    };

    return (
      <div className="ctsCard">
        {/* image */}
        <div className="ctsCardImage">
          <img
            src={props.profilePic ? props.profilePic : avatar}
            alt="contestant"
          />
        </div>
        <div className="ctsCardDetails">
          {/* name */}
          <div className="ctsCardDetail">
            <div className="ctsCardLabel">Name</div>
            {props.name}
          </div>
          {/* Age */}
          <div className="ctsCardDetail">
            <div className="ctsCardLabel">Age</div>
            {props.age}
          </div>
          {/* Gender */}
          <div className="ctsCardDetail">
            <div className="ctsCardLabel">Gender</div>
            {props.gender}
          </div>
          {/* University */}
          <div className="ctsCardDetail">
            <div className="ctsCardLabel">University</div>
            {props.university}
          </div>
          {/* State of Origin */}
          <div className="ctsCardDetail">
            <div className="ctsCardLabel">State Of Origin</div>
            {props.state}
          </div>
          {/* Phone Number */}
          <div className="ctsCardDetail">
            <div className="ctsCardLabel">Phone Number</div>
            {props.phoneNumber}
          </div>
          {/* Email */}
          <div className="ctsCardDetail">
            <div className="ctsCardLabel">Email</div>
            {props.email}
          </div>
          {/* Registered On */}
          <div className="ctsCardDetail">
            <div className="ctsCardLabel">Registered On</div>
            {moment(props.createdAt.toDate()).format("LL")}
          </div>
          {/* Points */}
          <div className="ctsCardDetail">
            <div className="ctsCardLabel">Votes</div>
            {props.points}
          </div>
          {/* ===== 
          card edit
          ====== */}
          <div
            className="ctsCardVoteBtn"
            onClick={() => setDisplayPointsForm((prevState) => !prevState)}
          >
            <div>Edit</div>
            <div>
              <span style={{ display: displayPointsForm && "none" }}>
                <MdKeyboardArrowDown />
              </span>
              <span style={{ display: !displayPointsForm && "none" }}>
                <MdKeyboardArrowUp />
              </span>
            </div>
          </div>
          {/* =======
          Change Points Form
          ========= */}
          <form
            style={{ display: !displayPointsForm && "none" }}
            onSubmit={handleContestantEdit}
          >
            {/* points */}
            <label className="inputLabel">Votes</label>
            <input
              type="number"
              name="points"
              className="inputBox"
              required
              value={points}
              onChange={(e) => {
                setPoints(parseInt(e.target.value, 10));
              }}
            />
            {/* save button */}
            <button className="mainBtn">save changes</button>
          </form>
          {/*  */}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="contestants section mt-5">
        {/* top menu */}
        <div className="d-flex flex-column justify-content-center align-items-center">
          {/* <!-- label --> */}
          <div className="label">Admin</div>
          <div className="labelLine"></div>

          <div className="adminMenuContainer mt-3 row no-gutters">
            {/* =========
          search bar 
          ========= */}
            <form className="ctsSearchForm col-md-6 col-lg-3 mr-md-3">
              <input
                type="text"
                name="searchBar"
                placeholder="search contestant"
                className="ctsSearchBar mb-md-0 mt-0"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>

            {/* =========
          Details Menu
          ========= */}
            <div className="adminMenu col-md-4 col-lg-3">
              {/* select group */}
              {/* <select onChange={(e) => setSelectedGroup(e.target.value)}>
                <option value="">All Groups</option>
                {groups &&
                  groups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
              </select> */}
              {/* total contestants */}
              <p className="menuContent">
                <span className="mr-2">Total:</span>{" "}
                {contestants &&
                  contestants.filter(
                    (cts) =>
                      cts.name
                        .toLowerCase()
                      //   .includes(searchValue.toLowerCase()) &&
                      // cts.group
                      //   .toLowerCase()
                      //   .includes(selectedGroup.toLowerCase())
                  ).length}
              </p>
            </div>
          </div>
        </div>

        {/* ==========
        contestants
        =========== */}
        <div className="ctsCardContainer row mt-5">
          <Loader />
          {contestants &&
            contestants
              .filter((cts) => {
                  return (
                    cts.name
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  );
              })
              .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
              .map((cts) => (
                <div className="col-lg-3 col-md-6" key={cts.id}>
                  <ContestantCard {...cts} />
                </div>
              ))}
        </div>
      </div>
    </>
  );
}

export default Admin;
