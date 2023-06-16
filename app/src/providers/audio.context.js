import React, {
  useEffect,
  useState,
  createContext,
  useRef,
  useContext,
} from "react";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { formatTime } from "../utils/TimeFormater";
import { firebase } from "../config/firebase";
import { getSongArtistFromArray } from "../utils/Converters";
import * as SecureStore from "expo-secure-store";
import { AuthenticationContext } from "./authentication.context";

export const AudioContext = createContext();
Audio.setAudioModeAsync({
  staysActiveInBackground: true,
  playThroughEarpieceAndroid: false,
  shouldDuckAndroid: true,
});
const REACT_IDS = "reactIdList";
const songStorage = firebase.storage().ref("songs");
const songsRef = firebase.firestore().collection("songs");
const userRef = firebase.firestore().collection("users");
export const AudioContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioObj, setAudioObj] = useState(null);
  const [isPlayerVisible, setPlayerVisbile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);
  const [songStatus, setSongStatus] = useState({});
  const [currentSong, setCurrentSong] = useState(null);
  const [songDuration, setSongDuration] = useState("");
  const [repeatMode, setRepeatMode] = useState(0); // 0 - none, 1- all,2 - one
  const [shuffleMode, setShuffleMode] = useState(false);
  const [songs, setSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [listeningHistory, setListeningHistory] = useState([]);
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
  const getLikedSongs = (list) => {
    const listSong = list.filter((song) => {
      if (song.likes) {
        if (song.likes.includes(user.userId)) return song;
      }
    });
    setLikedSongs(listSong);
  };
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
    console.log("init audio object");
    try {
      setIsPlaying(false);
      const { sound: playbackObject } = await Audio.Sound.createAsync({
        uri: uri,
      });
      setAudioObj(playbackObject);
      const status = await playbackObject.getStatusAsync();
      setSongDuration(formatTime(status.durationMillis));
      setSongStatus(status);
      await playbackObject.playAsync();
      setIsPlaying(true);
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
    if (audioObj != null) {
      setIsPlaying(false);
      try {
        await audioObj.stopAsync();
        // setIsPlaying(false);
        await audioObj.unloadAsync();
        await audioObj.loadAsync({ uri: songUri });
        const status = await audioObj.getStatusAsync();
        setSongDuration(formatTime(status.durationMillis / 1000));
        setSongStatus(status);
        await audioObj.playAsync();
        setIsPlaying(true);
      } catch (err) {
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
    setIsLoading(true);
    moveToNext();
    //repeat 1 song forever
    if (repeatMode == 2) {
      await audioObj.setPositionAsync(0);
      savedPosition.current = 0;
    }
    setIsLoading(false);
  };
  useEffect(() => {
    savedPosition.current = 0;
    const handleSongChange = async () => {
      setIsLoading(true);
      if (currentSong != null) {
        if (audioObj == null) {
          await initializeAudioObject(currentSong.uri);
        } else {
          await audioLoadSongAsync(currentSong.uri);
        }
        currentSongId.current = currentSong.id;
        currentSongIndex.current = songs.findIndex(
          (item) => item.id === currentSong.id
        );
        setIsLoading(false);
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
          artists: [],
          imageUri: "",
          isLocalSong: true,
        }));
        setIsLoading(false);
        return localSongs; // Return the local songs array
      }
    } catch (e) {
      console.log("error", e);
      setIsLoading(false);
      setError(e);
    }
  };
  const getRemoteSongs = async () => {
    try {
      const querySnapshot = await songsRef.where("deletedAt", "==", null).get();
      const newSongs = [];
      querySnapshot.forEach((documentSnapshot) => {
        newSongs.push({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
          artistString: getSongArtistFromArray(documentSnapshot.data().artist),
        });
      });
      getLikedSongs(newSongs);
      currentSongIndex.current = 0;
      return newSongs;
    } catch (err) {
      console.log("error when get all songs", err);
    }
  };
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchSongs();
    }
  }, [isAuthenticated]);
  const fetchSongs = async () => {
    const listLocal = await loadLocalSongs(); // Await the local songs array
    const listRemote = await getRemoteSongs(); // Await the remote songs array
    setSongs([...listLocal, ...listRemote]);
  };
  useEffect(() => {
    if (isAuthenticated) {
      getListeningHistory(user.listeningHistory || []);
    }
  }, [songs, isAuthenticated]);
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
        likedSongs,
        currentSongIndex,
        currentSong,
        songs,
        songDuration,
        isPlayerVisible,
        savedPosition,
        listeningHistory,
        setCurrentSong,
        setAudioObj,
        setPlayerVisbile,
        handleSongEnd,
        setSongStatus: setSongStatus,
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
