import { StyleSheet, Image, Text, View } from "react-native";
import React from "react";

const WelcomeScreen = () => {
  return (
    <Image
      source={require("../../../assets/intro1.png")}
      resizeMode="contain"
      style={{ flex: 1, width: "100%", height: "100%" }}
    ></Image>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
