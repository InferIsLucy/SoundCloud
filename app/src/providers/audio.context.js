import React, { useEffect, useState, createContext, useRef } from "react";
export const AudioContext = createContext();
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { formatTime } from "../utils/TimeFormater";
export const AudioContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [AudioObj, setAudioObj] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [songStatus, setSongStatus] = useState({});
  const [songDuration, setSongDuration] = useState("");
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
        const status = await AudioObj.getStatusAsync();
        setSongDuration(formatTime(status.durationMillis));
        setSongStatus(status);
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
      const status = await AudioObj.getStatusAsync();
      setSongDuration(formatTime(status.durationMillis));
      setSongStatus(status);
      setIsPlaying(true);
    } catch (e) {
      console.log("error", e);
      currentSongIndex.current++;
      setError(e);
    }
  };
  const togglePlayStatus = async () => {
    console.log("togglePlayStatus", !!AudioObj);
    if (AudioObj == null) {
      return;
    }
    if (AudioObj._loading) {
      return;
    }
    const status = await AudioObj.getStatusAsync();

    setIsPlaying((isPlaying) => !isPlaying);
    if (isPlaying) {
      await AudioObj.pauseAsync();
    } else {
      await AudioObj.playAsync();
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
      setSongs(() => mediaFiles.assets);
      return mediaFiles.assets;
    } catch (e) {
      console.log("error", e);
      setError(e);
    }
  };
  const getPermission = async () => {
    return await MediaLibrary.requestPermissionsAsync();
  };

  useEffect(() => {
    const loadSong = async () => {
      setIsLoading(true);
      //get local audio
      try {
        const permission = await getPermission();

        let localSongs = [];
        if (permission.granted) {
          localSongs = await getLocalAudioFiles();
        }
        console.log("get file", songs.length);
        const { sound: playbackObject } = await Audio.Sound.createAsync({
          uri: localSongs[0].uri,
        });
        setAudioObj(playbackObject);
        console.log("audioObject", AudioObj);
        const status = await playbackObject.getStatusAsync();
        setSongDuration(formatTime(status.durationMillis));
        setSongStatus(status);
        console.log("status", status);
        setIsLoading(false);
        currentSongIndex.current = 0;
      } catch (e) {
        console.log("error", e);
        setIsLoading(false);
        setError(e);
      }
    };

    loadSong();
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
        isLoading,
        songStatus,
        currentSongIndex,
        songs,
        setAudioObj,
        songDuration,
        setSongStatus: setSongStatus,
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
