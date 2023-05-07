import React, { useEffect, useState, createContext } from "react";
export const AudioContext = createContext();
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";

export const AudioContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [repeatMode, setRepeatMode] = useState(0); // 0 - none, 1- all,2 - one
  const [shuffleMode, setShuffleMode] = useState(false);
  const [localSongs, setLocalSongs] = useState([]);
  const playNext = async () => {
    try {
      await currentSong.stopAsync();
      await currentSong.unloadAsync();
      await currentSong.loadAsync(require("../../assets/example1.mp3"), {
        shouldPlay: true,
      });
    } catch (e) {
      console.log("error", e);
      setError(e);
    }
  };
  const resumeSong = async () => {
    if (currentSong && isPlaying == false) {
      await currentSong.playAsync();
    }
  };
  const pauseSong = async () => {
    if (currentSong && isPlaying == true) {
      await currentSong.pauseAsync();
    }
  };
  const togglePlayStatus = async () => {
    console.log("toggle play status");
    if (currentSong) {
      setIsPlaying((isPlaying) => !isPlaying);
      if (isPlaying) {
        await currentSong.pauseAsync();
      } else {
        await currentSong.playAsync();
      }
    }
  };
  const toggleShuffleMode = () => {
    setShuffleMode(!shuffleMode);
  };

  const toggleRepeatMode = () => {
    let newRepeatMode = repeatMode + 1;
    if (newRepeatMode > 2) {
      newRepeatMode = 0;
    }
    setRepeatMode(newRepeatMode);
  };
  const getLocalAudioFiles = async () => {
    try {
      const mediaFiles = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
      });

      console.log("local media files", mediaFiles.assets);
      setLocalSongs(mediaFiles.assets);
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };
  const getPermission = async () => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.granted) {
      getLocalAudioFiles();
    }
  };
  useEffect(() => {
    //load example file
    (async () => {
      //get local audio
      await getPermission();
      try {
        const { sound } = await Audio.Sound.createAsync(
          // require("../../assets/example.mp3")
          { uri: localSongs[0].uri }
        );
        setCurrentSong(sound);
      } catch (e) {
        console.log("error", e);
        setError(e);
      }
    })();
  }, []);
  useEffect(() => {
    return currentSong
      ? () => {
          console.log("Unloading Sound");
          currentSong.unloadAsync();
          setCurrentSong(null);
        }
      : undefined;
  }, [currentSong]);
  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        setIsPlaying,
        setCurrentSong,
        togglePlayStatus,
        playNext,
        repeatMode,
        shuffleMode,
        toggleShuffleMode,
        toggleRepeatMode,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
