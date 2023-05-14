import React, { useEffect, useState, createContext } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  getAuth,
  signOut,
} from "firebase/auth";
import app from "../config/firebase";
export const AuthenticationContext = createContext();
import * as SecureStore from "expo-secure-store";

export const AuthenticationContextProvider = ({ children }) => {
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  console.log("auth", auth);
  const saveUserId = async (userId) => {
    try {
      await SecureStore.setItemAsync("userId", userId);
    } catch (err) {
      console.log("err", err);
    }
  };
  const getUserId = async () => {
    try {
      const userId = await SecureStore.setItemAsync("userId");
      return userId;
    } catch (err) {
      console.log("err", err);
    }
    return null;
  };
  useEffect(() => {
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // User is signed in, see docs for a list of available properties
    //     // https://firebase.google.com/docs/reference/js/firebase.User
    //     const uid = user.uid;
    //     console.log("ÚIER", uid);
    //     // ...
    //   } else {
    //     // User is signed out
    //     // ...
    //   }
    // });
    if (getUserId() != null) {
      setIsAuthenticated(true);
      setUser({});
    }
  }, []);
  const onLoginWithEmail = (email, password) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Sign in succeeded", user);
        setUser(user);
        setIsAuthenticated(true);
        setIsLoading(false);
        saveUserId(user.uid);
      })
      .catch((error) => {
        console.log("Error when sign in with email", error);
        setIsLoading(false);
      });
  };
  const logout = () => {
    signOut(auth);
    setIsAuthenticated(false);
    setUser(null);
  };
  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        error,
        setError,
        auth,
        sendPasswordResetEmail,
        onLoginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
