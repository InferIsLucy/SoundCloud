import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
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
import { Feather } from "@expo/vector-icons";

import PlayerController from "./components/PlayerController.component";
import BottomReactionBar from "./components/BottomBar.component";
import CommentScreen from "../commentScreen/Comment.screen";
import { AudioContext } from "../../providers/audio.context";
import { formatTime } from "../../utils/TimeFormater";
import OptionsModal from "./components/OptionsModal.component";
import SetTimerModal from "./components/TimerModel.component";
import { StatisticContext } from "../../providers/statistic.context";
import { UserContext } from "../../providers/user.context";

const PlayerScreen = ({ navigation }) => {
  const {
    handleSongEnd,
    currentSong = {},
    audioObj,
    isPlaying,
    updateListen,
    setBottomBarVisible,
  } = useContext(AudioContext);
  const { addListen } = useContext(StatisticContext);
  const { user } = useContext(UserContext);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [isListenCounted, setIsListenCounted] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  // const intervalRef = useRef(null)
  useLayoutEffect(() => {
    (async () => {
      try {
        const status = await audioObj.current.getStatusAsync();
        setCurrentPosition(() => status.positionMillis);
        setSongDuration(() => status.durationMillis);
      } catch {}
    })();
  }, []);
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      setBottomBarVisible(true);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    setBottomBarVisible(false);
  }, []);
  const intervalRef = useRef(null);
  useEffect(() => {
    if (audioObj.current != null) {
      if (audioObj.current._loaded && isPlaying) {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(async () => {
            const status = await audioObj.current.getStatusAsync();
            if (
              status.isLoaded &&
              status.positionMillis === status.durationMillis
            ) {
              setCurrentPosition(status.positionMillis);
              handleSongEnd();
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              return;
            }
            if (
              !isListenCounted &&
              status.positionMillis >= status.durationMillis * 0.3
            ) {
              addListen(
                user.userId,
                currentSong.artist.map((art) => art.id),
                currentSong.id
              );
              updateListen(currentSong.id, 1);

              setIsListenCounted(() => true);
            }
            setCurrentPosition(status.positionMillis);
            setSongDuration(status.durationMillis);
          }, 1000);
        }
      } else {
        // Ngừng interval nếu bài hát đã dừng phát hoặc chưa tải xong
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [audioObj.current, currentSong, isPlaying, isListenCounted]);
  useEffect(() => {
    //TODO: unhandle case repeat once song
    setIsListenCounted(false);
  }, [currentSong]);
  return (
    <View
      style={[
        {
          opacity:
            commentsVisible || isOptionModalVisible || timerModalVisible
              ? 0.5
              : 1,
        },
        styles.container,
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            setBottomBarVisible(true);
          }}
          style={{ paddingLeft: 8, paddingRight: 4 }}
        >
          <Ionicons name="chevron-back" size={32} color="#ffffff" />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text style={styles.text2}>now playing</Text>
          <Text numberOfLines={1} style={[styles.text1, { fontWeight: 500 }]}>
            {currentSong.name || "Song Name"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setIsOptionModalVisible(true);
          }}
          style={{ paddingLeft: 8, paddingRight: 4 }}
        >
          <Feather name="more-vertical" size={32} color="white" />
        </TouchableOpacity>
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
                  // if (audioObj.current._isLoading) return;
                  await audioObj.current.setPositionAsync(value);
                  setCurrentPosition(value);
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
      {!currentSong.isLocalSong && (
        <BottomReactionBar
          setCommentsVisible={setCommentsVisible}
          song={currentSong}
        ></BottomReactionBar>
      )}
      <Modal
        animationType="slide"
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

            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            left: 0,
          }}
        >
          <CommentScreen
            song={currentSong}
            setCommentsVisible={setCommentsVisible}
          ></CommentScreen>
        </View>
      </Modal>
      <OptionsModal
        visible={isOptionModalVisible}
        song={currentSong}
        setTimerModalVisible={setTimerModalVisible}
        onClose={() => {
          setIsOptionModalVisible(false);
        }}
      ></OptionsModal>

      <SetTimerModal
        visible={timerModalVisible}
        onClose={() => setTimerModalVisible(false)}
      ></SetTimerModal>
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
