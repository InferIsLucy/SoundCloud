import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Colors } from "../../theme/color";

export const AuthButton = ({ buttonContent, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.btnWrapper}>
        <Text style={styles.content}>{buttonContent}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const GoogleAuthButton = ({ buttonContent, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { backgroundColor: "white" }]}
    >
      <Image
        style={styles.logo}
        source={require("../../../assets/logo_google.png")}
      ></Image>
      <View style={styles.btnWrapper}>
        <Text style={[styles.content, { color: "black" }]}>
          {buttonContent}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const FbAuthButton = ({ buttonContent, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { backgroundColor: "#4880f0" }]}
    >
      <Image
        style={styles.logo}
        source={require("../../../assets/logo_fb.png")}
      ></Image>
      <View style={styles.btnWrapper}>
        <Text style={[styles.content, { color: "black" }]}>
          {buttonContent}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: Colors.authButtonColor,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 3,
    minWidth: 300,
  },
  logo: {
    resizeMode: "contain",
    width: 26,
    height: 26,
    position: "absolute",
    left: 12,
  },
  content: {
    fontSize: 16,
    fontWeight: 500,
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  btnWrapper: {},
});
