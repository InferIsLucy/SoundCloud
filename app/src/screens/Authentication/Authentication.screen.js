import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

import { AuthButton } from "../shared-components/AuthButton.component";
import { Spacer } from "../../components/spacer";
import { Colors } from "../../theme/color";

const AuthScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/girl_listening_to_music.png")}
        style={styles.image}
      ></Image>
      <Spacer size={"huge"} position={"bottom"}></Spacer>
      <Spacer size={"huge"} position={"bottom"}></Spacer>

      <View style={{ marginBottom: 36 }}>
        <AuthButton
          onPress={() => {
            navigation.navigate("Register");
          }}
          buttonContent={"Create an account"}
        ></AuthButton>
        <Spacer size={"large"} position={"bottom"}></Spacer>
        <AuthButton
          onPress={() => {
            navigation.navigate("Login");
          }}
          buttonContent={"I already have an account"}
        ></AuthButton>
      </View>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: Colors.authBackground,
  },
  image: {
    resizeMode: "cover",
    width: 300,
  },
});
