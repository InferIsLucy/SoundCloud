import React, { useEffect, useState, createContext, useRef } from "react";
export const AudioContext = createContext();
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { formatTime } from "../utils/TimeFormater";
import { firebase } from "../config/firebase";
import { getSongArtistFromArray } from "../utils/Converters";
const songStorage = firebase.storage().ref("songs");
const songsRef = firebase.firestore().collection("songs");

export const AudioContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioObj, setAudioObj] = useState(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);
  const [songStatus, setSongStatus] = useState({});
  const [currentSong, setCurrentSong] = useState(null);
  const [songDuration, setSongDuration] = useState("");

  const [repeatMode, setRepeatMode] = useState(0); // 0 - none, 1- all,2 - one
  const [shuffleMode, setShuffleMode] = useState(false);
  const [songs, setSongs] = useState([]);
  const savedPosition = useRef(0);
  const currentSongIndex = useRef(-1);
  const currentSongId = useRef(-1);
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
    moveToNext();
  };
  const playPrev = async () => {
    moveToPrev();
  };
  const togglePlayStatus = async () => {
    //getting songs
    if (isLoading == true) {
      return;
    }

    if (audioObj._loading) {
      return;
    }
    setIsPlaying((isPlaying) => !isPlaying);
    if (isPlaying) {
      await audioObj.pauseAsync();
    } else {
      await audioObj.playAsync();
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
  const initializeAudioObject = async (uri) => {
    try {
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        {
          uri: uri,
        },
        { shouldPlay: true }
      );
      setIsPlaying(true);
      setAudioObj(playbackObject);
      const status = await playbackObject.getStatusAsync();
      setSongDuration(formatTime(status.durationMillis));
      setSongStatus(status);
      // console.log("status", status);
    } catch (err) {
      console.log("error when initialize audio object");
    }
  };
  const getLocalAudioFiles = async () => {
    try {
      const mediaFiles = await MediaLibrary.getAssetsAsync({
        mediaType: "audio",
      });
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
      if (permission.granted) {
        localMediaFiles = await getLocalAudioFiles();
        const localSongs = localMediaFiles.map((file) => {
          return {
            ...file,
            duration: file.duration * 1000,
            name: file.filename,
            artists: [],
            imageUri: "",
          };
        });
        console.log("LocalSongs", localSongs);
        setSongs(() => localSongs);
      }
      setIsLoading(false);
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
          newSongs.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
            artistString: getSongArtistFromArray(
              documentSnapshot.data().artists
            ),
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
  const handleTogglePlayerModelVisbile = () => {
    setIsPlayerVisible((v) => !v);
  };

  const audioLoadSongAsync = async (songUri) => {
    if (audioObj != null) {
      console.log("LoadsongAsync");
      setIsLoading(true);
      try {
        await audioObj.stopAsync();
        // setIsPlaying(false);
        await audioObj.unloadAsync();
        await audioObj.loadAsync(
          { uri: songUri },
          {
            shouldPlay: true,
          }
        );
        setIsPlaying(true);

        const status = await audioObj.getStatusAsync();
        setSongDuration(formatTime(status.durationMillis / 1000));
        setSongStatus(status);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);

        throw err;
      }
    }
  };
  const moveToNext = () => {
    if (isLoading) {
      return;
    }

    let nextIndex;

    // Kiểm tra trạng thái repeatMode
    switch (repeatMode) {
      case 0: // Không lặp lại (None)
        // Tăng chỉ mục bài hát hiện tại
        currentSongIndex.current =
          currentSongIndex.current === songs.length - 1
            ? currentSongIndex.current
            : currentSongIndex.current + 1;
        // Kiểm tra nếu chỉ mục vượt quá số lượng bài hát
        if (currentSongIndex.current > songs.length - 1) {
          return;
        }
        nextIndex = currentSongIndex.current;
        break;
      case 1: // Lặp lại danh sách phát (All)
        // Kiểm tra nếu là bài hát cuối cùng
        if (currentSongIndex.current === songs.length - 1) {
          // Quay lại bài hát đầu tiên
          nextIndex = 0;
        } else {
          // Tăng chỉ mục bài hát hiện tại
          currentSongIndex.current++;
          nextIndex = currentSongIndex.current;
        }
        break;
      case 2: // Lặp lại bài hiện tại (One)
        nextIndex = currentSongIndex.current;
        break;
      default:
        break;
    }

    // Kiểm tra trạng thái shuffleMode
    if (shuffleMode) {
      nextIndex = getRandomIndex(songs.length, currentSongIndex.current);
    }

    try {
      setCurrentSong(songs[nextIndex]);
    } catch (e) {
      console.log("error", e);
      currentSongIndex.current--;
      setError(e);
    }
  };

  const moveToPrev = () => {
    if (isLoading) {
      return;
    }

    let prevIndex;

    // Kiểm tra trạng thái repeatMode
    switch (repeatMode) {
      case 0: // Không lặp lại (None)
        // Giảm chỉ mục bài hát hiện tại
        currentSongIndex.current =
          currentSongIndex.current === 0 ? 0 : currentSongIndex.current - 1;

        // Kiểm tra nếu chỉ mục âm
        if (currentSongIndex.current < 0) {
          return;
        }

        prevIndex = currentSongIndex.current;
        break;
      case 1: // Lặp lại danh sách phát (All)
        // Kiểm tra nếu là bài hát đầu tiên
        if (currentSongIndex.current === 0) {
          // Chuyển đến bài hát cuối cùng
          prevIndex = songs.length - 1;
        } else {
          // Giảm chỉ mục bài hát hiện tại
          currentSongIndex.current--;
          prevIndex = currentSongIndex.current;
        }
        break;
      case 2: // Lặp lại bài hiện tại (One)
        prevIndex = currentSongIndex.current;
        break;
      default:
        break;
    }

    // Kiểm tra trạng thái shuffleMode
    if (shuffleMode) {
      prevIndex = getRandomIndex(songs.length, currentSongIndex.current);
    }

    try {
      setCurrentSong(songs[prevIndex]);
    } catch (e) {
      console.log("error", e);
      currentSongIndex.current++;
      setError(e);
    }
  };

  const getRandomIndex = (max, exclude) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * max);
    } while (randomIndex === exclude);

    return randomIndex;
  };
  const handleSongEnd = async () => {
    moveToNext();
    //repeat 1 song forever
    if (repeatMode == 2) {
      await audioObj.setPositionAsync(0);
      savedPosition.current = 0;
    }
  };
  useEffect(() => {
    const handleSongChange = async () => {
      if (currentSong != null) {
        if (audioObj == null) {
          await initializeAudioObject(currentSong.uri);
        } else {
          await audioLoadSongAsync(currentSong.uri);
        }
        savedPosition.current = 0;
        currentSongId.current = currentSong.id;
        currentSongIndex.current = songs.findIndex(
          (item) => item.id === currentSong.id
        );
      }
    };
    handleSongChange();
  }, [currentSong]);

  useEffect(() => {
    if (audioObj != null) {
      // Lặp lại bài hiện tại (One)
      if (repeatMode == 2) audioObj.setIsLoopingAsync(true);
      else {
        audioObj.setIsLoopingAsync(false);
      }
    }
  }, [repeatMode]);
  useEffect(() => {
    loadLocalSongs();
    // getRemoteSongs();
  }, []);
  useEffect(() => {
    return audioObj
      ? () => {
          console.log("Unloading Sound");
          audioObj.unloadAsync();
          setAudioObj(null);
        }
      : undefined;
  }, [audioObj]);
  // console.log("isPlaying", isPlaying);
  // console.log("audioObj", audioObj);
  // console.log("songs", songs);
  // console.log("currentSong", currentSong);
  // console.log("currentSongIndex.current", currentSongIndex.current);
  // console.log("currentSongId.current", currentSongId.current);
  // console.log("songStatus", songStatus);

  return (
    <AudioContext.Provider
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
        setIsPlayerVisible,
        savedPosition,
        handleSongEnd,
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
