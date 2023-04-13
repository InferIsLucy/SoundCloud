import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

import AuthButton from "../components/button/auth-button.component";
import { Spacer } from "../components/spacer";

const LoginScreen = () => {
  const handleSignIn = () => {};
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/girl_listening_to_music.png")}
        style={styles.image}
      ></Image>
      <Spacer size={"huge"} position={"bottom"}></Spacer>
      <Spacer size={"huge"} position={"bottom"}></Spacer>

      <View style={{ marginBottom: 36 }}>
        <AuthButton buttonContent={"Create an account"}></AuthButton>
        <Spacer size={"large"} position={"bottom"}></Spacer>
        <AuthButton
          onPress={handleSignIn}
          buttonContent={"I already have an account"}
        ></AuthButton>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    resizeMode: "cover",
    width: 300,
  },
});
