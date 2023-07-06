import React, {
  useEffect,
  useState,
  createContext,
  useRef,
  useContext,
} from "react";
import { UserContext } from "./user.context";
import { AudioContext } from "./audio.context";
import { firebase } from "../config/firebase";
export const PlaylistContext = createContext();
const playlistRef = firebase.firestore().collection("playlists");
export const PlaylistContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(UserContext);
  const [playlists, setPlaylists] = useState([]);

  const renderCount = useRef(0);
  renderCount.current++;

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const querySnapshot = await playlistRef
          .where("userId", "==", user.userId)
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
    if (isAuthenticated) loadPlaylists();
  }, [isAuthenticated]);

  const createNewPlaylist = async (playlistName, userId) => {
    try {
      const newPlaylist = {
        userId: userId,
        name: playlistName,
        songIds: [],
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
  const addSongToPlaylist = async (songId, playlist) => {
    try {
      if (!playlist.songIds.includes(songId)) {
        await playlistRef.doc(playlist.id).update({
          songIds: [...playlist.songIds, songId],
        });
        setPlaylists((prevPlaylists) =>
          prevPlaylists.map((pl) =>
            pl.id === playlist.id
              ? { ...pl, songIds: [...pl.songIds, songId] }
              : pl
          )
        );
      }
    } catch (error) {
      console.log("Error adding song to playlist:", error);
    }
  };

  const deleteSongInPlaylist = async (songId, playlist) => {
    try {
      await playlistRef.doc(playlist.id).update({
        songIds: playlist.songIds.filter((id) => id !== songId),
      });
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((pl) =>
          pl.id === playlist.id
            ? { ...pl, songIds: pl.songIds.filter((id) => id !== songId) }
            : pl
        )
      );
    } catch (error) {
      console.log("Error deleting song in playlist:", error);
    }
  };

  const getPlaylistSongs = (songs, playlist) => {
    const res = songs.filter((song) => playlist.songIds.includes(song.id));
    return res;
  };
  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createNewPlaylist,
        updatePlaylist,
        deletePlaylist,
        deleteSongInPlaylist,
        addSongToPlaylist,
        getPlaylistSongs,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
