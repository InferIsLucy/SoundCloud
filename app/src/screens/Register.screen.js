import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { Colors } from "../theme/color";
import { Spacer } from "../components/spacer";
import EditText from "./shared-components/EditText.component";
import AuthFrame from "./shared-components/AuthFrame.component";
import {
  AuthButton,
  GoogleAuthButton,
  FbAuthButton,
} from "./shared-components/AuthButton.component";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSignUpWithEmail = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Sign up succeeded", user);
        navigation.navigate("Login");
      })
      .catch((err) => {
        console.log("Error when create new user", err);
      });
  };

  return (
    <View style={styles.container}>
      <AuthFrame
        onBackBtnPress={() => {
          navigation.navigate("Auth");
        }}
        heading={"Create accout"}
      >
        <GoogleAuthButton
          buttonContent={"Sign up with Google"}
        ></GoogleAuthButton>

        <Spacer position={"top"} size={"large"}></Spacer>

        <FbAuthButton buttonContent={"Sign up with Facebook"}></FbAuthButton>

        <Spacer position={"top"} size={"huge"}></Spacer>
        <Spacer position={"top"} size={"huge"}></Spacer>

        <EditText
          onChangeText={(newEmail) => setEmail(newEmail)}
          value={email}
          placeholder={"Email"}
          iconLeft={"email"}
        ></EditText>
        <Spacer position={"top"} size={"large"}></Spacer>
        <EditText
          onChangeText={(newPassword) => setPassword(newPassword)}
          isPasswordType={true}
          value={password}
          placeholder={"Password"}
          iconLeft={"lock"}
        ></EditText>

        <Spacer position={"top"} size={"huge"}></Spacer>
        <Spacer position={"top"} size={"large"}></Spacer>

        <AuthButton
          onPress={handleSignUpWithEmail}
          buttonContent={"Sign up with email"}
        ></AuthButton>

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
