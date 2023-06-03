import React, {
  useEffect,
  useState,
  createContext,
  useRef,
  useContext,
} from "react";
import { AuthenticationContext } from "./authentication.context";
import { AudioContext } from "./audio.context";

export const PlaylistContext = createContext();
export const PlaylistContextProvider = ({ children }) => {
  const { user } = useContext(AuthenticationContext);
  const { songs } = useContext(AudioContext);
  const userId = user.userId;

  console.log("USER INFORMATION", user);
  const [playlists, setPlaylists] = useState([
    {
      //id play list
      id: "1",
      userId: userId || "ABCSDF",
      songsId: ["UTpqPGZIHMUMiAIdhZro", "i0G8t8oJ93djtoXPCy43"],
    },
    {
      id: "2",
      userId: userId || "ABCSDF",
      songsId: ["LTzNGsvvYiuks7gF8br4", "i0G8t8oJ93djtoXPCy43"],
    },
  ]);
  const createNewPlaylist = (newPlaylist) => {
    //add new playlist to playlists
  };
  const updatePlaylist = (playlistId, song) => {
    //update songs in playlist
  };
  const deleteSongInPlaylist = () => {};
  //for detail playlist screen

  const loadSongOfPlaylist = (playlistId) => {
    // songsId: [
    //     "UTpqPGZIHMUMiAIdhZro",
    //     "i0G8t8oJ93djtoXPCy43",
    // ]

    songs.map((song) => {});
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
