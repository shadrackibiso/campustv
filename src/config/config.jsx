import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIfLxaktdlqp0eh4sIyWrVWqOWqiIZSss",
  authDomain: "campustv-2dc8d.firebaseapp.com",
  databaseURL: "https://campustv-2dc8d.firebaseio.com",
  projectId: "campustv-2dc8d",
  storageBucket: "campustv-2dc8d.appspot.com",
  messagingSenderId: "465686968001",
  appId: "1:465686968001:web:ed82d89394c10472960640",
  measurementId: "G-65FD04DRGJ",
};

const fb = firebase.initializeApp(firebaseConfig);
export default fb;
