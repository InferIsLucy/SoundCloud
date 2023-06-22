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

const PlayerScreen = ({ navigation }) => {
  const {
    songs,
    handleSongEnd,
    currentSong = {},
    audioObj,
    isLoading,
    isPlaying,
    currentSongIndex,
    //playback status
    currentPosition: pos,
    playbackStatus,
    setBottomBarVisible,
    savedPosition,
  } = useContext(AudioContext);

  const [currentPosition, setCurrentPosition] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [commentsVisible, setCommentsVisible] = useState(false);
  // const intervalRef = useRef(null);
  useEffect(() => {
    setBottomBarVisible(false);
  }, []);
  const intervalRef = useRef(null);
  useEffect(() => {
    if (audioObj != null) {
      if (audioObj._loaded) {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(async () => {
            {
              const status = await audioObj.getStatusAsync();
              console.log(
                status.positionMillis,
                status.durationMillis,
                !status.isLoading
              );
              if (
                status.positionMillis == status.durationMillis &&
                !status.isLooping
              ) {
                console.log("handleSongEnd");
                handleSongEnd();
                return;
              }
              setCurrentPosition(() => status.positionMillis);
              setSongDuration(() => status.durationMillis);
            }
          }, 1000);
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [audioObj, currentSong, isPlaying]);

  return (
    <View style={[{ opacity: commentsVisible ? 0.5 : 1 }, styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            setBottomBarVisible(true);
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
          <Text style={styles.text2}>now playing</Text>
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

      <View style={styles.artworkWrapper}>
        {currentSong.imageUri == "" ? (
          <Image
            source={{
              uri: "https://images.pexels.com/photos/3574678/pexels-photo-3574678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            }}
            style={styles.img}
          ></Image>
        ) : (
          <Image
            source={{
              uri: currentSong.imageUri,
            }}
            style={styles.img}
          ></Image>
        )}
      </View>
      <View style={{ alignItems: "center" }}>
        <Text numberOfLines={2} style={styles.title}>
          {currentSong.name || "Song Name"}
        </Text>
        <Text numberOfLines={1} style={styles.artist}>
          {currentSong.artistString || " "}
        </Text>
      </View>

      <View style={styles.progressBar}>
        {true && (
          <>
            <Text style={[styles.duration, { bottom: 0 }]}>
              {songDuration == 0 ? "0:00" : formatTime(currentPosition)}
            </Text>
            <Slider
              tapToSeek={true}
              disabled={songDuration == 0 ? true : false}
              style={{ width: 320, height: 40 }}
              minimumValue={0}
              onSlidingComplete={async (value) => {
                //value is second unit -> convert to millisecond
                try {
                  // if (audioObj._isLoading) return;
                  await audioObj.setPositionAsync(value);
                  setCurrentPosition(value);
                  // savedPosition.current = value;
                } catch (e) {
                  console.log("error onSliding duration bar", e);
                }
              }}
              onTouchStart={() => {
                // clearInterval(intervalRef.current);
              }}
              onValueChange={(value) => {
                setCurrentPosition(value);
              }}
              onTouchEnd={() => {
                // setIntervalRef();
              }}
              value={currentPosition}
              thumbTintColor={"#f8f8f8"}
              minimumTrackTintColor={"#cfcfcf"}
              maximumValue={songDuration}
              maximumTrackTintColor="#000000"
            />
            <Text style={[styles.duration, { bottom: 0, right: 0 }]}>
              {/* {formatTime(currentSong.duration) || ""} */}
              {formatTime(songDuration) || ""}
            </Text>
          </>
        )}
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
    backgroundColor: "#222831",
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
  text2: {
    fontSize: 15,
    textAlign: "center",
    color: Colors.defaultTextColor1,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    marginLeft: 24,
    marginRight: 24,
    color: Colors.defaultTextColor,
  },

  artist: {
    fontSize: 16,
    color: Colors.defaultTextColor1,
  },
  progressBar: {
    marginTop: 40,
    height: 50,
  },
  duration: {
    color: Colors.defaultTextColor,
    position: "absolute",
  },
  controllerContainer: {
    width: 320,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  img: {
    borderRadius: 16,
    width: "100%",
    height: "100%",
    marginTop: 10,
    resizeMode: "cover",
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.5,
    //elevation: 5,
  },
  artworkWrapper: {
    width: 300,
    height: 340,
    marginBottom: 30,
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.5,
    elevation: 5,
  },
});
