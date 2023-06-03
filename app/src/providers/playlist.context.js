import React, {
  useEffect,
  useState,
  createContext,
  useRef,
  useContext,
} from "react";
import { AuthenticationContext } from "./authentication.context";

export const PlaylistContext = createContext();
export const PlaylistContextProvider = ({ children }) => {
  const { user } = useContext(AuthenticationContext);
  console.log("USER INFORMATION", user);
  const userId = user.userId;
  const [playlists, setPlaylists] = useState([]);

  return (
    <PlaylistContext.Provider
      value={{
        audioObj,
        repeatMode,
        shuffleMode,
        isPlaying,
        isLoading,
        songStatus,
        currentSongIndex,
        currentSong,
        setCurrentSong,
        songs,
        setAudioObj,
        songDuration,
        isPlayerVisible,
        setPlayerVisbile,
        savedPosition,
        handleSongEnd,
        setSongStatus: setSongStatus,
        // toggleReactSong,
        // handleReact,
        checkIfReact,
        sendReact,
        audioEvents: {
          setIsPlaying,
          togglePlayStatus,
          playNext,
          playPrev,
          toggleShuffleMode,
          toggleRepeatMode,
        },
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
