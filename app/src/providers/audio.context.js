import React, { useEffect, useState, createContext, useRef } from "react";
export const AudioContext = createContext();
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { formatTime } from "../utils/TimeFormater";
import { firebase } from "../config/firebase";

const songStorage = firebase.storage().ref("songs");
const songsRef = firebase.firestore().collection("songs");

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
  // function listFilesAndDirectories(reference, pageToken) {
  //   return reference.list({ pageToken }).then((result) => {
  //     // Loop over each item
  //     result.items.forEach((ref) => {
  //       ref
  //         .getDownloadURL()
  //         .then((url) => {
  //           console.log("url", url);
  //         })
  //         .catch((err) => console.log("error when get download url"));
  //     });
  //     if (result.nextPageToken) {
  //       return listFilesAndDirectories(reference, result.nextPageToken);
  //     }
  //     return Promise.resolve();
  //   });
  // }
  // useEffect(() => {
  //   listFilesAndDirectories(songStorage).then(() => {
  //     console.log("Finished listing");
  //   });
  // }, []);
  const playNext = async () => {
    //getting songs
    if (isLoading == true) {
      return;
    }
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
    //getting songs
    if (isLoading == true) {
      return;
    }
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
    //getting songs
    if (isLoading == true) {
      return;
    }
    if (AudioObj == null) {
      await initializeAudioObject(currentSongIndex.current);
      return;
    }
    if (AudioObj._loading) {
      return;
    }
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
  const initializeAudioObject = async (songIndex) => {
    console.log("songs", songIndex);
    const uri = songs[songIndex].uri;
    try {
      const { sound: playbackObject } = await Audio.Sound.createAsync({
        uri: uri,
      });
      setAudioObj(playbackObject);
      console.log("audioObject", AudioObj);
      const status = await playbackObject.getStatusAsync();
      setSongDuration(formatTime(status.durationMillis));
      setSongStatus(status);
      console.log("status", status);
    } catch (err) {
      console.log("error when initialize audio object");
    }
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
  const loadLocalSongs = async () => {
    setIsLoading(true);
    //get local audio
    try {
      const permission = await getPermission();
      let localSongs = [];
      if (permission.granted) {
        localSongs = await getLocalAudioFiles();
      }
      console.log("get file", songs.length);
      setIsLoading(false);
      currentSongIndex.current = 0;
    } catch (e) {
      console.log("error", e);
      setIsLoading(false);
      setError(e);
    }
  };
  const getRemoteSongs = async () => {
    await songsRef
      .get()
      .then((querySnapshot) => {
        const newSongs = [];
        querySnapshot.forEach((documentSnapshot) => {
          console.log("doc", documentSnapshot.data());
          newSongs.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        console.log("newsong", newSongs);
        setSongs(newSongs);
        currentSongIndex.current = 0;
      })
      .catch((err) => {
        console.log("error when get all songs", err);
      });
  };
  useEffect(() => {
    // loadLocalSongs();
    getRemoteSongs();
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
