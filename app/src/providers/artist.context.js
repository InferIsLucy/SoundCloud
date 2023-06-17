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
  const [isFetchingArtist, setIsFetchingArtist] = useState(false);
  const [followedArtistIds, setFolloweredArtistIds] = useState([]);
  useEffect(() => {
    if (isAuthenticated) {
      getArtists();
      getFollowerArtistsByUserId(user.userId);
    }
  }, [isAuthenticated]);
  const getArtists = async () => {
    setIsLoading(true);
    setIsFetchingArtist(true);
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
      setIsFetchingArtist(false);
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
          getFollowerArtistsByUserId(user.userId);
          return updatedArtists;
        });
      } catch (err) {
        console.log("error when updating followers", err);
      }
    }
  };

  const getFollowerArtistsByUserId = (userId) => {
    const res = artists.filter(
      (artist) => artist.followers != null && artist.followers.includes(userId)
    );
    const ids = res.map((artist) => {
      return artist.id;
    });
    setFolloweredArtistIds(ids);
  };
  const checkIfFollowed = (artistId) => {
    const result = followedArtistIds.includes(artistId);
    if (result > 0) {
      return true;
    }
    return false;
  };
  return (
    <ArtistContext.Provider
      value={{
        isLoading,
        artists,
        isFetchingArtist,
        toggleFollowing,
        getArtists,
        checkIfFollowed,
        getFollowerArtistsByUserId,
        followedArtistIds,
      }}
    >
      {children}
    </ArtistContext.Provider>
  );
};
