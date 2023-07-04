import React, {
  useEffect,
  useState,
  createContext,
  useRef,
  useContext,
  useCallback,
} from "react";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { formatTime } from "../utils/TimeFormater";
import { firebase } from "../config/firebase";
import { getSongArtistFromArray } from "../utils/Converters";
import * as SecureStore from "expo-secure-store";
import { AuthenticationContext } from "./authentication.context";
import { ArtistContext } from "./artist.context";

export const AudioContext = createContext();
Audio.setAudioModeAsync({
  staysActiveInBackground: true,
  playThroughEarpieceAndroid: false,
  shouldDuckAndroid: true,
});

const songsRef = firebase.firestore().collection("songs");
const userRef = firebase.firestore().collection("users");
export const AudioContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthenticationContext);
  const { artists, isFetchingArtist } = useContext(ArtistContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBottomBarVisible, setBottomBarVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);
  const [isFetchingData, setIsFetchingData] = useState(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [repeatMode, setRepeatMode] = useState(0); // 0 - none, 1- all,2 - one
  const [shuffleMode, setShuffleMode] = useState(false);
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [listeningHistory, setListeningHistory] = useState([]);
  const [timerVisible, setTimerVisible] = useState(false);

  const currentSongIndex = useRef(-1);
  const currentSongId = useRef(-1);
  const currentPositionRef = useRef(0);
  const timerDurationRef = useRef(-1);
  const audioObj = useRef(null);
  const renderCount = useRef(0);
  renderCount.current++;
  console.log("AudioContext", renderCount.current);

  const clearTimer = () => {
    timerDurationRef.current = -1;
  };
  const setTimer = (durationMillis) => {
    if (typeof durationMillis === "number" && durationMillis >= 0) {
      timerDurationRef.current = durationMillis;
      setTimerVisible((prev) => !prev);
    } else {
      // handle invalid minute value here
      console.log("Invalid timer value");
    }
  };
  const getLikedSongs = (list) => {
    if (user != null) {
      const listSong = list.filter((song) => {
        if (song.likes) {
          if (song.likes.includes(user.userId)) return song;
        }
      });
      setLikedSongs(listSong);
    }
  };
  const playNext = async () => {
    moveToNext();
  };
  const playPrev = async () => {
    moveToPrev();
  };
  const togglePlayStatus = async () => {
    console.log("audioObj", audioObj.current == null);
    //getting songs
    if (isLoading == true || audioObj.current == null) {
      return;
    }

    if (audioObj.current._loading) {
      return;
    }
    setIsPlaying((isPlaying) => !isPlaying);
    if (isPlaying) {
      await audioObj.current.pauseAsync();
    } else {
      await audioObj.current.playAsync();
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
      setIsPlaying(false);
      const { sound: playbackObject } = await Audio.Sound.createAsync({
        uri: uri,
      });
      audioObj.current = playbackObject;
      await playbackObject.playAsync();
      setIsPlaying(true);
      // console.log("status", status);
      console.log("initialized audio object");
    } catch (err) {
      console.log("error when initialize audio object", err);
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
  const checkIfReact = (songId) => {
    const userId = user.userId;
    const song = songs.find((song) => song.id === songId);
    if (song) {
      const likes = song.likes || [];
      return likes.includes(userId);
    }

    return false;
  };
  const sendReact = async (songId) => {
    try {
      // Get the current user's ID (replace with your own logic to obtain the user ID)
      const userId = user.userId;

      // Get the song document reference from Firebase
      const songRef = firebase.firestore().collection("songs").doc(songId);

      // Retrieve the song document
      const songDoc = await songRef.get();

      if (songDoc.exists) {
        // Get the current likes array from the song document
        const likes = songDoc.data().likes || [];

        // Check if the user's ID exists in the likes array
        const userIdIndex = likes.indexOf(userId);

        if (userIdIndex === -1) {
          // If the user's ID doesn't exist in the likes array, add it
          likes.push(userId);
        } else {
          // If the user's ID already exists in the likes array, remove it
          likes.splice(userIdIndex, 1);
        }

        // Update the likes field in Firebase
        await songRef.update({ likes: likes });
        console.log("React sent successfully!");
        await getRemoteSongs();
      } else {
        console.log("Song not found!");
      }
    } catch (error) {
      console.log("Error sending react:", error);
    }
  };
  const audioLoadSongAsync = async (songUri) => {
    if (audioObj.current != null) {
      setIsPlaying(false);
      try {
        await audioObj.current.stopAsync();
        await audioObj.current.unloadAsync();
        await audioObj.current.loadAsync({ uri: songUri });
        await audioObj.current.playAsync();
        const status = await audioObj.current.getStatusAsync();
        setIsPlaying(true);
      } catch (err) {
        throw err;
      }
    }
  };

  const moveToNext = () => {
    // if (isLoading) {
    //   return;
    // }

    let nextIndex;
    // Kiểm tra trạng thái repeatMode
    switch (repeatMode) {
      case 0: // Không lặp lại (None)
        // Tăng chỉ mục bài hát hiện tại
        currentSongIndex.current =
          currentSongIndex.current === playlist.length - 1
            ? currentSongIndex.current
            : currentSongIndex.current + 1;
        console.log("currentIndex", currentSongIndex.current);
        // Kiểm tra nếu chỉ mục vượt quá số lượng bài hát
        if (currentSongIndex.current > playlist.length - 1) {
          return;
        }
        nextIndex = currentSongIndex.current;
        break;
      case 1: // Lặp lại danh sách phát (All)
        // Kiểm tra nếu là bài hát cuối cùng
        if (currentSongIndex.current === playlist.length - 1) {
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
      nextIndex = getRandomIndex(playlist.length, currentSongIndex.current);
    }
    console.log("nextIndex", nextIndex);

    try {
      setCurrentSong(playlist[nextIndex]);
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
          prevIndex = playlist.length - 1;
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
      prevIndex = getRandomIndex(playlist.length, currentSongIndex.current);
    }

    try {
      if (playlist[prevIndex] != null) setCurrentSong(playlist[prevIndex]);
    } catch (e) {
      console.log("error", e);
      currentSongIndex.current++;
      setError(e);
    }
  };
  const getRandomIndex = useCallback((max, exclude) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * max);
    } while (randomIndex === exclude);

    return randomIndex;
  }, []);
  const handleSongEnd = async () => {
    setIsLoading(true);
    moveToNext();
    //repeat 1 song forever
    if (repeatMode == 2) {
      await audioObj.current.setPositionAsync(0);
    }
    setIsLoading(false);
  };

  const loadLocalSongs = async () => {
    setIsLoading(true);
    try {
      const permission = await getPermission();
      if (permission.granted) {
        localMediaFiles = await getLocalAudioFiles();
        const localSongs = localMediaFiles.map((file) => ({
          ...file,
          duration: file.duration * 1000,
          name: file.filename,
          artist: [],
          imageUri: "",
          isLocalSong: true,
        }));
        setIsLoading(false);
        return localSongs;
      }
    } catch (e) {
      console.log("error", e);
      setIsLoading(false);
      setError(e);
    }
  };
  const getRemoteSongs = useCallback(async () => {
    try {
      const querySnapshot = await songsRef.where("deletedAt", "==", null).get();
      const newSongs = [];
      querySnapshot.forEach((documentSnapshot) => {
        const artistListFromSong = documentSnapshot.data().artist;
        const artistList = artists.filter((artist) => {
          return artistListFromSong.some((item) => item.id == artist.id);
        });
        newSongs.push({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
          artist: artistList,
          artistString: getSongArtistFromArray(artistList),
        });
      });
      getLikedSongs(newSongs);
      currentSongIndex.current = 0;
      return newSongs;
    } catch (err) {
      console.log("error when get all songs", err);
    }
  }, [artists, songsRef]);
  const getListeningHistory = async (listeningHistoryIds) => {
    const listSong = listeningHistoryIds.map((id) => {
      return songs.find((song) => song.id === id);
    });
    setListeningHistory(listSong);
  };
  const addSongToHistory = async (userId, songId) => {
    try {
      const querySnapshot = await userRef.where("userId", "==", userId).get();
      const userDocId = querySnapshot.docs[0].id;
      const userDocRef = userRef.doc(userDocId);
      // Retrieve the user document from the database based on the userId
      const userDoc = await userDocRef.get();
      let listeningHistory = userDoc.data().listeningHistory || [];
      // Remove the songId if it already exists in the listeningHistory
      listeningHistory = listeningHistory.filter((id) => id !== songId);
      // Add the songId to the beginning of the listeningHistory
      listeningHistory.unshift(songId);
      getListeningHistory(listeningHistory);
      // Update the listeningHistory field in the user document
      await userDocRef.update({ listeningHistory });
    } catch (error) {
      console.log("Error adding song to history:", error);
      throw error;
    }
  };
  const fetchSongs = async () => {
    console.log("fetching songs");
    setIsFetchingData(true);
    const listLocal = await loadLocalSongs(); // Await the local songs array
    const listRemote = await getRemoteSongs(); // Await the remote songs array
    setSongs(() => [...listLocal, ...listRemote]);
    setPlaylist([...listLocal, ...listRemote]);
    setIsFetchingData(false);
  };

  useEffect(() => {
    if (isAuthenticated && !isFetchingArtist) {
      fetchSongs();
    }
  }, [isAuthenticated, isFetchingArtist]);
  useEffect(() => {
    if (isAuthenticated) {
      getListeningHistory(user.listeningHistory || []);
    }
  }, [songs, isAuthenticated]);
  useEffect(() => {
    const handleSongChange = async () => {
      setIsLoading(true);
      if (currentSong != null) {
        if (audioObj.current == null) {
          await initializeAudioObject(currentSong.uri);
        } else {
          await audioLoadSongAsync(currentSong.uri);
        }
        currentSongId.current = currentSong.id;
        currentSongIndex.current = playlist.findIndex(
          (item) => item.id === currentSong.id
        );
        setIsLoading(false);
      }
    };
    handleSongChange();
  }, [currentSong]);

  useEffect(() => {
    if (audioObj.current != null) {
      // Lặp lại bài hiện tại (One)
      if (repeatMode == 2) audioObj.current.setIsLoopingAsync(true);
      else {
        audioObj.current.setIsLoopingAsync(false);
      }
    }
  }, [repeatMode]);
  return (
    <AudioContext.Provider
      value={{
        audioObj,
        repeatMode,
        shuffleMode,
        isPlaying,
        isLoading,
        likedSongs,
        currentSongIndex,
        currentSong,
        currentPosition: currentPositionRef.current,
        playlist,
        isFetchingData,
        timerVisible,
        songs: songs.filter((song) => song.isLocalSong == null),
        localSongs: songs.filter((song) => song.isLocalSong != null),
        isBottomBarVisible,
        listeningHistory,
        timerDurationRef,
        setPlaylist,
        setTimer,
        clearTimer,
        setCurrentSong,
        setBottomBarVisible,
        handleSongEnd,
        checkIfReact,
        sendReact,
        fetchSongs,
        addSongToHistory,
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
