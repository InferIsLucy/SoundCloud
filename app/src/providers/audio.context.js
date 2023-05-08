import React, { useEffect, useState, createContext, useRef } from "react";
export const AudioContext = createContext();
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";

export const AudioContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [AudioObj, setAudioObj] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [repeatMode, setRepeatMode] = useState(0); // 0 - none, 1- all,2 - one
  const [shuffleMode, setShuffleMode] = useState(false);
  const [songs, setSongs] = useState([]);
  const currentSongIndex = useRef(-1);

  const playNext = async () => {
    if (isLoading == true || AudioObj == null) {
      return;
    }
    if (AudioObj._loaded == true) {
      //set top limited index
      currentSongIndex.current =
        currentSongIndex.current == songs.length - 1
          ? currentSongIndex.current
          : currentSongIndex.current + 1;
      if (currentSongIndex.current > songs.length - 1) {
        return;
      }
      try {
        await AudioObj.stopAsync();

        setIsPlaying(false);
        await AudioObj.unloadAsync();
        await AudioObj.loadAsync(
          { uri: songs[currentSongIndex.current].uri },
          {
            shouldPlay: true,
          }
        );
        setIsPlaying(true);
      } catch (e) {
        console.log("error", e);
        currentSongIndex.current--;
        setError(e);
      }
    }
  };
  const playPrev = async () => {
    //set bottom limited index
    currentSongIndex.current =
      currentSongIndex.current == 0 ? 0 : currentSongIndex.current - 1;
    if (currentSongIndex.current < 0 || AudioObj._loading) {
      return;
    }
    try {
      await AudioObj.stopAsync();
      setIsPlaying(false);
      await AudioObj.unloadAsync();
      await AudioObj.loadAsync(
        { uri: songs[currentSongIndex.current].uri },
        {
          shouldPlay: true,
        }
      );
      setIsPlaying(true);
    } catch (e) {
      console.log("error", e);
      currentSongIndex.current++;
      setError(e);
    }
  };
  const togglePlayStatus = async () => {
    console.log("togglePlayStatus", AudioObj);
    if (AudioObj == null) {
      return;
    }
    if (AudioObj._loading) {
      return;
    }
    if (AudioObj) {
      setIsPlaying((isPlaying) => !isPlaying);
      if (isPlaying) {
        await AudioObj.pauseAsync();
      } else {
        await AudioObj.playAsync();
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
      setSongs(mediaFiles.assets);
    } catch (e) {
      console.log("error", e);
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
        // setAudioObj(new Audio.Sound());
        // AudioObj.createAsync(
        //   // require("../../assets/example.mp3")
        //   { uri: songs[0].uri }
        // );
        const { sound } = await Audio.Sound.createAsync(
          // require("../../assets/example.mp3")
          { uri: songs[0].uri }
        );
        setAudioObj(sound);
        currentSongIndex.current = 0;
      } catch (e) {
        console.log("error", e);
        setError(e);
      }
    })();
  }, []);
  useEffect(() => {
    return AudioObj
      ? () => {
          console.log("Unloading Sound");
          AudioObj.unloadAsync();
          setAudioObj(null);
        }
      : undefined;
  }, [AudioObj]);
  return (
    <AudioContext.Provider
      value={{
        AudioObj,
        repeatMode,
        shuffleMode,
        isPlaying,
        songs,
        setAudioObj,
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
    </AudioContext.Provider>
  );
};
