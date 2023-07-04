import React, {
  useContext,
  useEffect,
  memo,
  useLayoutEffect,
  useState,
} from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Touchable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { PlaylistContext } from "../../../providers/playlist.context";
import { AudioContext } from "../../../providers/audio.context";
import { Image } from "react-native";

const SetTimerModal = ({ visible, onClose }) => {
  const { setTimer, clearTimer, audioObj, timerDurationRef } =
    useContext(AudioContext);
  const [timeLeft, setTimeLeft] = useState();
  const [minuteText, setMinuteText] = useState("");
  const handleSetTimer = (value) => {
    setTimer(value);
    onClose();
  };
  const handleClearTimer = () => {
    clearTimer();
    onClose();
  };
  useEffect(() => {
    setTimeLeft(timerDurationRef.current);
  }, [timerDurationRef.current]);
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((timeLeft) => {
        if (timeLeft > 0) {
          return timeLeft - 1;
        } else if (timeLeft == 0) {
          if (audioObj.current) {
            console.log("pausing audio");
            pauseAudio();
          }
          clearInterval(timerId);
          return -1;
        } else {
          return -1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);
  const pauseAudio = async () => {
    await audioObj.current.pauseAsync();
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  useEffect(() => {
    setMinuteText(Math.round(timeLeft / 6000) === 1 ? "minute" : "minutes");
  }, [timeLeft]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        onClose();
      }}
      visible={visible}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          onClose();
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }} />
          <View style={styles.subModalTimerContainer}>
            <View style={styles.heading}>
              <Image
                source={require("../../../../assets/stopwatch.png")}
                style={styles.iconImg}
              ></Image>
              <Text style={{ fontSize: 16, marginLeft: 8 }}>Set timer</Text>
            </View>
            {timeLeft > 0 && (
              <Item
                onPress={() => {
                  handleClearTimer();
                }}
                text={`Cancel timer (${Math.round(
                  timeLeft / 60000
                )} ${minuteText} left)`}
              ></Item>
            )}
            <Item
              onPress={() => {
                handleSetTimer(15 * 60 * 1000);
              }}
              text={"15 minutes"}
            ></Item>
            <Item
              onPress={() => {
                handleSetTimer(30 * 60 * 1000);
              }}
              text={"30 minutes"}
            ></Item>
            <Item
              onPress={() => {
                handleSetTimer(45 * 60 * 1000);
              }}
              text={"45 minutes"}
            ></Item>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const Item = ({ onPress, text }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.timerOptionWrapper}>
      <Text style={styles.timerOption}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  timerOption: {
    textAlign: "left",
    width: "100%",
    fontSize: 16,
  },
  iconImg: {
    width: 24,
    height: 24,
    resizeMode: "cover",
  },
  heading: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  subModalTimerContainer: {
    backgroundColor: "white",
    justifyContent: "center",

    paddingTop: 12,
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  timerOptionWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
  },
});

export default SetTimerModal;
