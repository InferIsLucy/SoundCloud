import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import Slider from "@react-native-community/slider";
import { Colors } from "../../theme/color";
import { Ionicons } from "@expo/vector-icons";

import PlayerController from "./components/PlayerController.component";
import BottomReactionBar from "./components/BottomBar.component";
import { AudioContext } from "../../providers/audio.context";
import { formatTime } from "../../utils/TimeFormater";

const PlayerScreen = ({ song }) => {
  const { songStatus, isLoading, AudioObj, isPlaying, currentSongIndex } =
    useContext(AudioContext);
  const [currentPosition, setCurrentPosition] = useState(0);

  const intervalRef = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (currentPosition < songStatus.durationMillis) {
            setCurrentPosition((prev) => prev + 1000);
          }
        }, 1000);
      }
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentSongIndex, isPlaying]);
  useEffect(() => {
    setCurrentPosition(0);
  }, [currentSongIndex.current]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ paddingLeft: 8, paddingRight: 4 }}>
          <Ionicons name="chevron-back" size={32} color="black" />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginRight: 32,
          }}
        >
          <Text style={styles.text1}>now playing</Text>
          <Text style={[styles.text1, { fontWeight: 500 }]}>
            Love the way you lie
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
        <Text style={styles.title}>Song </Text>
        <Text style={styles.artist}>Artist Name </Text>
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
            await AudioObj.setPositionAsync(value);
            setCurrentPosition(value);
          }}
          value={currentPosition}
          thumbTintColor={"black"}
          minimumTrackTintColor={"black"}
          maximumValue={songStatus.durationMillis}
          maximumTrackTintColor="#000000"
        />
        <Text style={[styles.duration, { bottom: 0, right: 0 }]}>
          {formatTime(songStatus.durationMillis) || ""}
        </Text>
      </View>

      {/* music controller */}
      <PlayerController></PlayerController>
      <BottomReactionBar></BottomReactionBar>
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
