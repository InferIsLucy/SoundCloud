import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

import { Colors } from "../theme/color";
import { Spacer } from "../components/spacer";
import EditText from "./shared-components/EditText.component";
import AuthFrame from "./shared-components/AuthFrame.component";
import {
  AuthButton,
  GoogleAuthButton,
  FbAuthButton,
} from "./shared-components/AuthButton.component";

const RegisterScreen = () => {
  return (
    <View style={styles.container}>
      <AuthFrame heading={"Create accout"}>
        <GoogleAuthButton
          buttonContent={"Sign up with Google"}
        ></GoogleAuthButton>

        <Spacer position={"top"} size={"large"}></Spacer>

        <FbAuthButton buttonContent={"Sign up with Facebook"}></FbAuthButton>

        <Spacer position={"top"} size={"huge"}></Spacer>
        <Spacer position={"top"} size={"huge"}></Spacer>

        <EditText placeholder={"Email"} iconLeft={"email"}></EditText>
        <Spacer position={"top"} size={"large"}></Spacer>
        <EditText
          isPasswordType={true}
          placeholder={"Password"}
          iconLeft={"lock"}
        ></EditText>

        <Spacer position={"top"} size={"huge"}></Spacer>
        <Spacer position={"top"} size={"large"}></Spacer>

        <AuthButton buttonContent={"Sign up with email"}></AuthButton>

        <Spacer position={"top"} size={"medium"}></Spacer>
      </AuthFrame>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.authBackground,
  },
});
