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
  const userId = "ABCSDF";

  const [playlists, setPlaylists] = useState([
    {
      //id play list
      id: "1",
      name: "playList1",
      userId: userId,
      songsId: ["UTpqPGZIHMUMiAIdhZro", "i0G8t8oJ93djtoXPCy43"],
    },
    {
      id: "2",
      name: "playList2",
      userId: userId,
      songsId: ["LTzNGsvvYiuks7gF8br4", "i0G8t8oJ93djtoXPCy43"],
    },
  ]);
  const createNewPlaylist = (playlistName) => {
    const newPlaylist = {
      id: playlists.length + 1,
      userId: userId,
      name: playlistName,
      songsId: [],
    };
    setPlaylists([...playlists, newPlaylist]);
  };

  const updatePlaylist = (playlistId, newName) => {
    const index = playlists.findIndex((playlist) => playlist.id === playlistId);
    if (index !== -1) {
      const newPlaylists = [...playlists];
      newPlaylists[index] = {
        ...newPlaylists[index],
        name: newName,
      };
      setPlaylists(newPlaylists);
    }
  };
  const deletePlaylist = (playlistId) => {
    const index = playlists.findIndex((playlist) => playlist.id === playlistId);
    if (index !== -1) {
      const newPlaylists = [...playlists];
      newPlaylists.splice(index, 1);
      setPlaylists(newPlaylists);
    }
  };

  const loadSongOfPlaylist = (playlistId) => {
    // songsId: [
    //     "UTpqPGZIHMUMiAIdhZro",
    //     "i0G8t8oJ93djtoXPCy43",
    // ]

    songs.map((song) => {
      return <Comment key={index} comment={item} songId={songId} />;
    });
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
