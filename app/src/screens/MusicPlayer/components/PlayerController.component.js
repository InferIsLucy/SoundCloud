import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useLayoutEffect, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AudioContext } from "../../../providers/audio.context";
const PlayerController = ({ playEvents }) => {
  const { playSong } = playEvents;
  const {
    isPlaying,
    togglePlayStatus,
    toggleShuffleMode,
    repeatMode,
    shuffleMode,
    toggleRepeatMode,
    playNext,
  } = useContext(AudioContext);
  const controllSize = 32;
  useLayoutEffect;
  return (
    <View style={styles.controllerContainer}>
      <TouchableOpacity onPress={toggleShuffleMode}>
        <MaterialCommunityIcons
          name="shuffle"
          size={controllSize}
          color={shuffleMode ? "black" : "gray"}
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Entypo
          name="controller-jump-to-start"
          size={controllSize}
          color="black"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={togglePlayStatus}>
        {isPlaying ? (
          <Ionicons name="pause-circle-sharp" size={60} color="black" />
        ) : (
          <Ionicons name="play-circle-sharp" size={60} color="black" />
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={playNext}>
        <Entypo name="controller-next" size={controllSize} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleRepeatMode}>
        {repeatMode == 2 ? (
          <MaterialCommunityIcons
            name="repeat-once"
            size={controllSize}
            color="black"
          />
        ) : (
          <MaterialCommunityIcons
            name="repeat"
            size={controllSize}
            color={repeatMode == 0 ? "gray" : "black"}
          />
        )}
      </TouchableOpacity>

      {/* bottom reaction bar */}
    </View>
  );
};

export default PlayerController;

const styles = StyleSheet.create({
  controllerContainer: {
    width: 320,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
