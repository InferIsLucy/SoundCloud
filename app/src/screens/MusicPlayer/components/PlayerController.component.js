import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useLayoutEffect, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AudioContext } from "../../../providers/audio.context";

const PlayerController = () => {
  const { isPlaying, audioEvents, repeatMode, shuffleMode } =
    useContext(AudioContext);
  const controllSize = 32;
  return (
    <View style={styles.controllerContainer}>
      <TouchableOpacity onPress={audioEvents.toggleShuffleMode}>
        <MaterialCommunityIcons
          name="shuffle"
          size={controllSize}
          color={shuffleMode ? "black" : "gray"}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={audioEvents.playPrev}>
        <Entypo
          name="controller-jump-to-start"
          size={controllSize}
          color="black"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={audioEvents.togglePlayStatus}>
        {isPlaying ? (
          <Ionicons name="pause-circle-sharp" size={60} color="black" />
        ) : (
          <Ionicons name="play-circle-sharp" size={60} color="black" />
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={audioEvents.playNext}>
        <Entypo name="controller-next" size={controllSize} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={audioEvents.toggleRepeatMode}>
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
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
