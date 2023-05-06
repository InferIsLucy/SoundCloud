import React, { useEffect, useState, createContext } from "react";
export const AudioContext = createContext();

export const AudioContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPermission = () => {};
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("user is logged", user);
        setIsAuthenticated(true);
        setUser(user);
      }
    });
  }, []);

  return <AudioContext.Provider value={{}}>{children}</AudioContext.Provider>;
};
