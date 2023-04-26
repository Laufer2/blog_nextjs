import { getApps, getApp } from "firebase/app";
import * as firebase from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  limit,
  DocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { toast } from "react-hot-toast";

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

const fromMillis = Timestamp.fromMillis;

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
async function getUserWithUsername(username: string) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  try {
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    return userDoc;
  } catch (e) {
    toast.error("Could not find the user.");
    return null;
  }
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
function postToJSON(doc: DocumentSnapshot) {
  const data = doc.data();
  return {
    ...data,
    //firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data!.createdAt.toMillis(),
    updatedAt: data!.updatedAt.toMillis(),
  };
}

export {
  auth,
  storage,
  firestore,
  googleAuthProvider,
  fromMillis,
  postToJSON,
  getUserWithUsername,
};
