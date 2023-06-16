import { StyleSheet, Text, Image, View } from "react-native";
import React from "react";
import { Colors } from "../../../theme/color";

const SongTag = ({ song }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={{ uri: song.imageUri }}></Image>
      <Text style={styles.name}>{song.name}</Text>
    </View>
  );
};

export default SongTag;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "red",
    borderRadius: 25,
    resizeMode: "cover",
  },
  name: {
    fontWeight: 500,
    color: Colors.bodyTextColor,
  },
});
