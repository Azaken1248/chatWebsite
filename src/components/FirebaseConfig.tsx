import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-GPkiVCmZV7CAIBYmxO8Kv5vVpbpQ7FE",
  authDomain: "chatwebsite-4eb7d.firebaseapp.com",
  projectId: "chatwebsite-4eb7d",
  storageBucket: "chatwebsite-4eb7d.appspot.com",
  messagingSenderId: "792513469342",
  appId: "1:792513469342:web:b418dc3f8b43cf69bf948f",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

// Initialize Firestore
const db = firebase.firestore();

export default db;
