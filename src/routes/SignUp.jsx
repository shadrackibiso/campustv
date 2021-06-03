import React, { useState, useEffect } from "react";
import "../css/signUp.css";
import "../css/home.css";
import avatar from "../images/avatar.png";
import { MdAddAPhoto, MdErrorOutline } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import ReactLoading from "react-loading";
import { NavLink } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/app";
import fb from "../config/config.jsx";

function SignUp() {
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [profileCreated, setProfileCreated] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null)
  const [imageError, setImageError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [user, setUser] = useState({
    createdAt: new Date(),
    points: 0,
  });
  // const [contestants, setContestants] = useState([
  //   {
  //     id: "1",
  //     group: "a1",
  //     name: "cassandra James",
  //     age: "19",
  //     university: "uniport",
  //     state: "rivers state",
  //     points: 2500,
  //   },
  //   {
  //     id: "2",
  //     group: "a1",
  //     name: "Diana Prince",
  //     age: "19",
  //     university: "uniben",
  //     state: "rivers state",
  //     points: 190,
  //   },
  //   {
  //     id: "3",
  //     group: "a2",
  //     name: "shadrack ibiso diepriye",
  //     age: "19",
  //     university: "unilag",
  //     state: "rivers state",
  //     points: 87,
  //   },
  // ]);

  ///////////////////
  //// fetch data ////
  /////////////////////
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
        // setContestants(users);

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

  ///////////////////
  //// handle input data change ////
  /////////////////////
  const handleChange = (e) => {
    let detail = { [e.target.name]: e.target.value };
    setUser((prevState) => ({ ...prevState, ...detail }));
  };

  ///////////////////
  //// sign up ////
  /////////////////////
  const signUp = (e) => {
    e.preventDefault();
    setCreatingProfile(true);
    fb.auth()
      .createUserWithEmailAndPassword(user.email, "123456789")
      .then((data) => {
        // let group;

        // check if group is filled and assign a group
        // if (contestants.length / groups.length === 50) {
        //   group = `FOCT-${groups.length + 1}`;
        // } else {
        //   group = `FOCT-${groups.length}`;
        // }

        // user profile
        const profile = {
          id: data.user.uid,
          // group,
          cid: data.user.uid.slice(0, 5),
          ...user,
        };

        // add user to database
        firebase
          .firestore()
          .collection("users")
          .doc(`${profile.name}-${data.user.uid}`)
          .set(profile)
          .then(setProfileCreated(true))
          .catch((error) => {
            console.log(error);
            setErrorMessage(error.message)
          });
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message)
      });
  };

  ///////////////////
  //// upload profile image ////
  /////////////////////
  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      const imageName = `img_${uuidv4()}`;

      const uploadTask = firebase
        .storage()
        .ref(`images/${imageName}.jpg`)
        .put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadingImage(true);
          setImageUploadProgress(progress);
        },
        (error) => {
          console.log(error);
          setImageError(error.message);
        },
        () => {
          // resize image to smaller size
          // function resizeAgain() {
          //   getResizedImage();
          // }

          // function getResizedImage() {
            firebase
              .storage()
              // .ref(`images/${imageName}_1080x1080.jpg`)
              .ref(`images/${imageName}.jpg`)
              .getDownloadURL()
              .then((url) => {
                setUploadingImage(false);
                setImageUrl(url);
                setUser((prevState) => ({ ...prevState, profilePic: url }));

                // Delete original uploaded images
                // firebase
                //   .storage()
                //   .ref(`images/${imageName}.jpg`)
                //   .delete()
                //   .catch((error) => {
                //     console.log(error);
                //   });
              })
              .catch((error) => {
                // error.code === "storage/object-not-found" && resizeAgain();
                console.log(error);
              });
          // }

          // getResizedImage();
        }
      );
    }
  };

  ///////////////////
  //// spinner for image upload ////
  /////////////////////
  const ImageLoader = () => (
    <div className="imageLoader" style={{ display: !uploadingImage && "none" }}>
      <div className="reactLoaderContainer">
        <ReactLoading type="spokes" color="#efce4d" height={50} width={50} />
      </div>
      <div style={{ color: "#efce4d" }}>
        <span>uploading ({imageUploadProgress})</span>
        <span style={{ display: !imageError && "none" }}>{imageError}</span>
      </div>
    </div>
  );

  ///////////////////
  //// modal for signup message ////
  /////////////////////
  const SuccessModal = () => (
    <div
      className="successModal"
      style={{ display: !creatingProfile && "none" }}
    >
      <div className="modalBlind"></div>
      <div className="modalContainer">
        <div className="successModalImage">
          {/* creating profile spinner */}
          <div
            className="reactLoaderContainer"
            style={{ display: (profileCreated || errorMessage) && "none" }}
          >
            <ReactLoading type="spokes" color="black" height={50} width={50} />
          </div>
          {/* profile created icon */}
          <span style={{ display: !profileCreated && "none" }}>
            <FiCheckCircle />
          </span>
        </div>
        <div className="successModalMessage">
          <span style={{ display: (profileCreated || errorMessage) && "none" }}>
            Creating your profile, please hold on...
          </span>
          {/* ERROR MESSAGE */}
          <div style={{ display: !errorMessage && "none" }}>
            {errorMessage}
          </div>
          <button className="secBtn mt-3 d=block" style={{display: !errorMessage && 'none'}} onClick={() => {setErrorMessage(null); setCreatingProfile(false)}}>Close</button>
          {/* REGISTRATION SUCCESS */}
          <span style={{ display: !profileCreated && "none" }}>
            Your profile has been created successfully.
          </span>
        </div>
        <a href="https://faceofcampusnigeria.com.ng" style={{ display: !profileCreated && "none" }}>
          <button className="secBtn">Done</button>
        </a>
      </div>
    </div>
  );

  return (
    <>
      <div className="signUp mt-3">
        <div className="section signUpSection">
          {/* <!-- label --> */}
          <div className="label">Create Profile</div>
          <div className="labelLine"></div>
          {/* Form */}
          <form className="signUpForm mt-3" onSubmit={signUp}>
            {/* profile image input */}
            <input
              type="file"
              name="imageInput"
              id="profileImageInput"
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{ display: "none" }}
              required
            />
            {/* image box */}
            <div className="imageInputBox">
              <img src={imageUrl ? imageUrl : avatar} alt="profilePic" />
              {/* image add button */}
              <label htmlFor="profileImageInput">
                <div className="imageAddBtn" title="add profile picture">
                  <MdAddAPhoto />
                </div>
              </label>
              {/* uploading image loader */}
              <ImageLoader />
            </div>
            <div className="signUpFormDetails">
              <div className="inputLabel">full name</div>
              <input
                type="text"
                name="name"
                className="inputBox"
                onChange={handleChange}
                required
              />
              {/*  */}
              <div className="inputLabel">age</div>
              <input
                type="number"
                name="age"
                className="inputBox"
                onChange={handleChange}
                required
              />
              {/*  */}
              <div className="inputLabel">gender</div>
              <select name="gender" onChange={handleChange} required>
                <option value="">- Select -</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
              {/*  */}
              <div className="inputLabel">university</div>
              <input
                type="text"
                name="university"
                className="inputBox"
                onChange={handleChange}
                required
              />
              {/*  */}
              <div className="inputLabel">state of origin</div>
              <input
                type="text"
                name="state"
                className="inputBox"
                onChange={handleChange}
                required
              />
              {/*  */}
              <div className="inputLabel">phone number</div>
              <input
                type="text"
                name="phoneNumber"
                className="inputBox"
                onChange={handleChange}
                required
              />
              {/*  */}
              <div className="inputLabel">email</div>
              <input
                type="email"
                name="email"
                className="inputBox"
                onChange={handleChange}
                required
              />
            </div>
            {/*  */}
            <div className="signUpInfoText">
              please note: the image you added above would be used for the
              competition and can't be change after you've created your profile.
              Also ensure that your email is valid so that you can receive our
              mails. ALl your details are fully secured and protected. Thank
              you.
            </div>
            {/*  */}
            <button className="mainBtn Btn">Create Profile</button>
          </form>
        </div>
      </div>
      <SuccessModal />
    </>
  );
}

export default SignUp;
