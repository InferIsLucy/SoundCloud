import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect } from "react";
import Slider from "@react-native-community/slider";
import { Colors } from "../../theme/color";
import { Ionicons } from "@expo/vector-icons";

import PlayerController from "./components/PlayerController.component";
import BottomReactionBar from "./components/BottomBar.component";
import { AudioContext } from "../../providers/audio.context";

const PlayerScreen = () => {
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
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt7b4qdih9G-kDB1hYb9whD_nWkCdBmmW4l8kNYogJ&s",
        }}
        style={styles.img}
      ></Image>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.title}>Song </Text>
        <Text style={styles.artist}>Artist Name </Text>
      </View>

      <View style={styles.progressBar}>
        <Text style={[styles.duration, { bottom: 0 }]}>0:00</Text>
        <Slider
          style={{ width: 320, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
        <Text style={[styles.duration, { bottom: 0, right: 0 }]}>0:00</Text>
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
