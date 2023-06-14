import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import Slider from "@react-native-community/slider";
import { Colors } from "../../theme/color";
import { Ionicons } from "@expo/vector-icons";

import PlayerController from "./components/PlayerController.component";
import BottomReactionBar from "./components/BottomBar.component";
import CommentScreen from "../commentScreen/Comment.screen";
import { AudioContext } from "../../providers/audio.context";
import { formatTime } from "../../utils/TimeFormater";

const PlayerScreen = () => {
  const {
    songs,
    handleSongEnd,
    currentSong,
    audioObj,
    isLoading,
    isPlaying,
    currentSongIndex,
    setPlayerVisbile,
    savedPosition,
  } = useContext(AudioContext);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const intervalRef = useRef(null);
  console.log("re-render", isLoading);
  console.log("currentPosition", currentPosition);
  console.log("savedPosition.current", savedPosition.current);

  // useEffect(() => {
  //   if (savedPosition.current != 0) {
  //     setCurrentPosition(savedPosition.current);
  //   }
  // }, [currentSong]);
  useLayoutEffect(() => {
    if (!isLoading) {
      if (isPlaying) {
        if (!intervalRef.current) {
          setIntervalRef();
        }
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    } else {
      // to reset position when load new song
      setCurrentPosition(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLoading, isPlaying]);
  const setIntervalRef = () => {
    intervalRef.current = setInterval(() => {
      savedPosition.current = savedPosition.current + 1000;
      setCurrentPosition((prev) => savedPosition.current);
      if (savedPosition.current - 1000 >= currentSong.duration) {
        handleSongEnd();
      }
    }, 1000);
  };
  return (
    <View style={[{ opacity: commentsVisible ? 0.5 : 1 }, styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setPlayerVisbile((prev) => !prev);
          }}
          style={{ paddingLeft: 8, paddingRight: 4 }}
        >
          <Ionicons name="chevron-back" size={32} color="black" />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginRight: 32,
          }}
        >
          <Text style={styles.text1}>now playing</Text>
          <Text
            numberOfLines={1}
            style={[
              styles.text1,
              { marginLeft: 24, marginRight: 24, fontWeight: 500 },
            ]}
          >
            {currentSong.name || "Song Name"}
          </Text>
        </View>
      </View>

      <Image
        source={{
          uri: "https://images2.thanhnien.vn/528068263637045248/2023/5/10/iu-1683710624038576717966.png",
        }}
        style={styles.img}
      ></Image>
      <View style={{ alignItems: "center" }}>
        <Text numberOfLines={2} style={styles.title}>
          {currentSong.name || "Song Name"}
        </Text>
        <Text numberOfLines={1} style={styles.artist}>
          {currentSong.artistString || " "}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <Text style={[styles.duration, { bottom: 0 }]}>
          {formatTime(currentPosition)}
        </Text>
        <Slider
          tapToSeek={true}
          style={{ width: 320, height: 40 }}
          minimumValue={0}
          onSlidingComplete={async (value) => {
            //value is second unit -> convert to millisecond
            try {
              await audioObj.setPositionAsync(value);
              setCurrentPosition(value);
              savedPosition.current = value;
            } catch (e) {
              console.log("error onSliding duration bar", e);
            }
          }}
          onTouchStart={() => {
            clearInterval(intervalRef.current);
          }}
          onValueChange={(value) => {
            setCurrentPosition(value);
          }}
          onTouchEnd={() => {
            setIntervalRef();
          }}
          value={currentPosition}
          thumbTintColor={"black"}
          minimumTrackTintColor={"black"}
          maximumValue={currentSong.duration}
          maximumTrackTintColor="#000000"
        />
        <Text style={[styles.duration, { bottom: 0, right: 0 }]}>
          {formatTime(currentSong.duration) || ""}
        </Text>
      </View>

      {/* music controller */}
      <PlayerController></PlayerController>
      <BottomReactionBar
        setCommentsVisible={setCommentsVisible}
        song={currentSong}
      ></BottomReactionBar>
      <Modal
        animationType="fade"
        transparent={true}
        visible={commentsVisible}
        onRequestClose={() => {
          setCommentsVisible(!commentsVisible);
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            backgroundColor: "white",
            right: 0,
            left: 0,
          }}
        >
          <CommentScreen
            setCommentsVisible={setCommentsVisible}
            songId={currentSong.id}
          ></CommentScreen>
        </View>
      </Modal>
    </View>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text1: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.defaultTextColor,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    marginLeft: 24,
    marginRight: 24,
    color: Colors.defaultTextColor,
  },
  img: {
    borderRadius: 16,
    width: 300,
    margin: 24,
    resizeMode: "cover",
    height: 350,
  },
  artist: {
    fontSize: 18,
    color: Colors.defaultTextColor,
  },
  progressBar: {
    marginTop: 40,
    height: 50,
  },
  duration: {
    position: "absolute",
  },
  controllerContainer: {
    width: 320,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
