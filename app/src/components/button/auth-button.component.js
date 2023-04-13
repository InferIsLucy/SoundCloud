import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Colors } from "../../theme/color";
const AuthButton = ({ buttonContent, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.btnWrapper}>
        <Text style={styles.content}>{buttonContent}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: Colors.authButtonColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    minWidth: 300,
  },
  content: {
    fontSize: 18,
    fontWeight: 500,
    color: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  btnWrapper: {},
});
