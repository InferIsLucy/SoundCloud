import React, { useEffect, useState, createContext, useContext } from "react";
import { firebase } from "../config/firebase";
import { AuthenticationContext } from "./authentication.context";

const artistRef = firebase.firestore().collection("artists");
const usersRef = firebase.firestore().collection("users");

export const ArtistContext = createContext();
export const ArtistContextProvider = ({ children }) => {
  //lấy thông tin của user để đính kèm vào comment
  const { user, isAuthenticated } = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtists] = useState([]);
  useEffect(() => {
    if (isAuthenticated) getArtists();
  }, [isAuthenticated]);
  const getArtists = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await artistRef.get();
      const artistList = [];
      querySnapshot.forEach((documentSnapshot) => {
        artistList.push({
          id: documentSnapshot.id,
          followers: [],
          ...documentSnapshot.data(),
        });
      });
      setIsLoading(false);
      setArtists(artistList);
    } catch (err) {
      console.log("error when get all artists", err);
      setIsLoading(false);
      setArtists([]);
    }
  };
  const toggleFollowing = async (artistId, userId) => {
    const artistIndex = artists.findIndex((artist) => artist.id === artistId);
    if (artistIndex !== -1) {
      const updatedArtist = { ...artists[artistIndex] };
      const followerIndex = updatedArtist.followers.indexOf(userId);

      if (followerIndex !== -1) {
        updatedArtist.followers.splice(followerIndex, 1);
      } else {
        updatedArtist.followers.push(userId);
      }

      try {
        await artistRef.doc(artistId).update({
          followers: updatedArtist.followers,
        });
        setArtists((prevArtists) => {
          const updatedArtists = [...prevArtists];
          updatedArtists[artistIndex] = updatedArtist;
          return updatedArtists;
        });
      } catch (err) {
        console.log("error when updating followers", err);
      }
    }
  };

  const getFollowerArtistsByUserId = (userId) => {
    return artists.filter(
      (artist) => artist.followers != null && artist.followers.includes(userId)
    );
  };
  const checkIfFollowed = (userId) => {
    const res = getFollowerArtistsByUserId(userId);
    console.log("Userid", res);
    if (res.length == 0) {
      return false;
    }
    return true;
  };
  return (
    <ArtistContext.Provider
      value={{
        isLoading,
        artists,
        toggleFollowing,
        getArtists,
        checkIfFollowed,
        getFollowerArtistsByUserId,
      }}
    >
      {children}
    </ArtistContext.Provider>
  );
};
