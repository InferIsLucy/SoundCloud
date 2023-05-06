import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
const BottomReactionBar = () => {
  const iconSize = 28;
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity>
        <AntDesign name="heart" size={iconSize} color="red" />
        <AntDesign name="hearto" size={iconSize} color="black" />
      </TouchableOpacity>
      <TouchableOpacity>
        <MaterialCommunityIcons
          name="comment-outline"
          size={iconSize}
          color="black"
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <MaterialIcons name="more-vert" size={iconSize} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default BottomReactionBar;

const styles = StyleSheet.create({
  bottomBar: {
    height: 50,
    width: 320,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
});
