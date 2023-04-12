import { getApps, getApp } from "firebase/app";
import * as firebase from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChOlavCi8WFf0Cu_q5UT2dsWHIP7A_8_A",
  authDomain: "blog-53350.firebaseapp.com",
  projectId: "blog-53350",
  storageBucket: "blog-53350.appspot.com",
  messagingSenderId: "951285405433",
  appId: "1:951285405433:web:4616ff3efc57f0d8a1f428",
  measurementId: "G-ZLVEQ69W8H",
};

if (getApps().length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const app = getApp();
const auth = getAuth(app);

// which provider to use when signing in
const googleAuthProvider = new GoogleAuthProvider();

const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, storage, firestore, googleAuthProvider };
