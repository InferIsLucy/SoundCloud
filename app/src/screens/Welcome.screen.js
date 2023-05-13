import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";

const SCREEN_FULL_WIDTH = Dimensions.get("screen").width;
const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/girl-listening-music-on-headphones.png")}
      ></Image>
      <Image
        style={{
          width: SCREEN_FULL_WIDTH,
          resizeMode: "contain",
        }}
        source={require("../../assets/music_notes.png")}
      ></Image>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
    width: 300,
  },
});
