import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase/firebase.init";
let googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  let [loading, setLoading] = useState(true);
  let [user, setUser] = useState(null);

  let createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  let loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  let singInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };
  let updateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo).then(() => {
      setUser({ ...auth.currentUser });
    });
  };

  let logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // ✅ just set the user
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  let authInfo = {
    createUser,
    loginUser,
    user,
    loading,
    updateUserProfile,
    singInWithGoogle,
    logOut,
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
