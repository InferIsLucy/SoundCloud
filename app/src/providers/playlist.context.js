import React, {
  useEffect,
  useState,
  createContext,
  useRef,
  useContext,
} from "react";
import { AuthenticationContext } from "./authentication.context";
import { AudioContext } from "./audio.context";
import { firebase } from "../config/firebase";
export const PlaylistContext = createContext();
const playlistRef = firebase.firestore().collection("playlists");
export const PlaylistContextProvider = ({ children }) => {
  const { user } = useContext(AuthenticationContext);
  const { songs } = useContext(AudioContext);
  const userId = "ABCSDF";

  const [playlists, setPlaylists] = useState([
    // {
    //   //id play list
    //   id: "1",
    //   name: "playList1",
    //   userId: userId,
    //   songsId: ["UTpqPGZIHMUMiAIdhZro", "i0G8t8oJ93djtoXPCy43"],
    // },
    // {
    //   id: "2",
    //   name: "playList2",
    //   userId: userId,
    //   songsId: ["LTzNGsvvYiuks7gF8br4", "i0G8t8oJ93djtoXPCy43"],
    // },
  ]);
  // const createNewPlaylist = (playlistName) => {
  //   const newPlaylist = {
  //     id: playlists.length + 1,
  //     userId: userId,
  //     name: playlistName,
  //     songsId: [],
  //   };
  //   setPlaylists([...playlists, newPlaylist]);
  // };

  // const updatePlaylist = (playlistId, newName) => {
  //   const index = playlists.findIndex((playlist) => playlist.id === playlistId);
  //   if (index !== -1) {
  //     const newPlaylists = [...playlists];
  //     newPlaylists[index] = {
  //       ...newPlaylists[index],
  //       name: newName,
  //     };
  //     setPlaylists(newPlaylists);
  //   }
  // };
  // const deletePlaylist = (playlistId) => {
  //   const index = playlists.findIndex((playlist) => playlist.id === playlistId);
  //   if (index !== -1) {
  //     const newPlaylists = [...playlists];
  //     newPlaylists.splice(index, 1);
  //     setPlaylists(newPlaylists);
  //   }
  // };

  // const loadSongOfPlaylist = (playlistId) => {
  //   // songsId: [
  //   //     "UTpqPGZIHMUMiAIdhZro",
  //   //     "i0G8t8oJ93djtoXPCy43",
  //   // ]

  //   songs.map((song) => {
  //     return <Comment key={index} comment={item} songId={songId} />;
  //   });
  // };
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const querySnapshot = await playlistRef
          .where("userId", "==", userId)
          .get();
        const playlistList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlaylists(playlistList);
      } catch (error) {
        console.log("Error loading playlists:", error);
      }
    };

    loadPlaylists();
  }, [userId]);

  const createNewPlaylist = async (playlistName) => {
    console.log("Create playlist");
    try {
      const newPlaylist = {
        userId: userId,
        name: playlistName,
        songsId: [],
      };
      const docRef = await playlistRef.add(newPlaylist);
      setPlaylists((prevPlaylists) => [
        ...prevPlaylists,
        { id: docRef.id, ...newPlaylist },
      ]);
      console.log("Create playlist successfully");
    } catch (error) {
      console.log("Error creating playlist:", error);
    }
  };

  const updatePlaylist = async (playlistId, newName) => {
    try {
      await playlistRef.doc(playlistId).update({ name: newName });
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.id === playlistId ? { ...playlist, name: newName } : playlist
        )
      );
    } catch (error) {
      console.log("Error updating playlist:", error);
    }
  };

  const deletePlaylist = async (playlistId) => {
    try {
      await playlistRef.doc(playlistId).delete();
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((playlist) => playlist.id !== playlistId)
      );
    } catch (error) {
      console.log("Error deleting playlist:", error);
    }
  };

  const loadSongOfPlaylist = (playlistId) => {
    const playlist = playlists.find((playlist) => playlist.id === playlistId);
    if (playlist) {
      return playlist.songsId.map((songId, index) => (
        <Comment key={index} comment={item} songId={songId} />
      ));
    } else {
      console.log("Playlist not found.");
      return null;
    }
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createNewPlaylist,
        updatePlaylist,
        deletePlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
