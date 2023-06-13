import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AudioContext } from "../../../providers/audio.context";
const BottomReactionBar = ({ setCommentsVisible, song }) => {
  const { checkIfReact, sendReact } = useContext(AudioContext);

  const [react, setReact] = useState(false);
  const iconSize = 28;
  useEffect(() => {
    const isReacted = checkIfReact(song.id);
    setReact(isReacted);
  }, []);
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        onPress={() => {
          // toggleReactSong(song.id);
          sendReact(song.id);
          setReact(!react);
        }}
        disabled={song.isLocalSong && true}
      >
        {/* <AntDesign name="heart" size={iconSize} color="red" /> */}
        <AntDesign
          name={react === true ? "heart" : "hearto"}
          size={iconSize}
          color={song.isLocalSong ? "black" : react == true ? "red" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setCommentsVisible((prev) => !prev);
        }}
        disabled={song.isLocalSong && true}
      >
        <MaterialCommunityIcons
          name="comment-outline"
          size={iconSize}
          color={song.isLocalSong ? "#968f8f" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity disabled={song.isLocalSong && true}>
        <MaterialIcons
          name="more-vert"
          size={iconSize}
          color={song.isLocalSong ? "#968f8f" : "black"}
        />
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
  },
});
