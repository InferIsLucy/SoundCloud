import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PlayerController = ({ playEvents }) => {
  const controllSize = 32;

  return (
    <View style={styles.controllerContainer}>
      <TouchableOpacity>
        <MaterialCommunityIcons
          name="shuffle"
          size={controllSize}
          color="black"
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Entypo
          name="controller-jump-to-start"
          size={controllSize}
          color="black"
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="play-circle-sharp" size={60} color="black" />
        {/* <Ionicons name="pause-circle-sharp" size={60} color="black" /> */}
      </TouchableOpacity>
      <TouchableOpacity>
        <Entypo name="controller-next" size={controllSize} color="black" />
      </TouchableOpacity>
      <TouchableOpacity>
        <MaterialCommunityIcons
          name="repeat"
          size={controllSize}
          color="black"
        />
      </TouchableOpacity>

      {/* <MaterialCommunityIcons
      name="repeat-once"
      size={controllSize}
      color="black"
    /> */}

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
