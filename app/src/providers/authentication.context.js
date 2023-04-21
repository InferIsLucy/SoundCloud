import React, { useEffect, useState, createContext } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../config/firebase";
export const AuthenticationContext = createContext();

const auth = getAuth();
export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  // Load user token and id in SecureStore
  //   useEffect(() => {
  //     auth.onAuthStateChanged((user) => {
  //       if (user) {
  //         console.log("user is logged", user);
  //         setIsAuthenticated(true);
  //         setUser(user);
  //       }
  //     });
  //   }, []);
  const onLoginWithEmail = (email, password) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Sign in succeeded", user);
        setUser(user);
        setIsAuthenticated(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error when sign in with email", err);
        setIsLoading(false);
      });
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        error,
        setError,

        onLoginWithEmail,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
