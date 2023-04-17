import { auth, firestore } from "../libs/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, collection, onSnapshot } from "firebase/firestore";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  //grab the current user from firebase
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  //listen on changes to the user object - fetch new user doc on change
  // listen on updates on user doc in real time
  useEffect(() => {
    let unsubscribe;

    // if we have user
    if (user) {
      unsubscribe = onSnapshot(
        doc(collection(firestore, "users"), user.uid),
        (doc) => {
          setUsername(doc.data()?.username);
        }
      );
    } else {
      setUsername(null);
    }

    //cleanup - user doc is no longer needed
    return unsubscribe;
  }, [user]);

  return { user, username };
}
