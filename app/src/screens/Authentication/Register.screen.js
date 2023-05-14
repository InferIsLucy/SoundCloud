import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { Colors } from "../../theme/color";
import { Spacer } from "../../components/spacer";
import EditText from "../shared-components/EditText.component";
import AuthFrame from "../shared-components/AuthFrame.component";
import {
  AuthButton,
  GoogleAuthButton,
  FbAuthButton,
} from "../shared-components/AuthButton.component";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { accountSchema } from "../../utils/Validator";
const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [displayNameError, setDisplayNameError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const handleSignUpWithEmail = async () => {
    try {
      await accountSchema.validate({
        email,
        displayName,
        password,
        confirmPassword,
      });
      clearErors();
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigation.navigate("Login");
    } catch (err) {
      console.log("Error when create new user", err);
      setError(err.path, err.message);
    }
  };
  const clearErors = () => {
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setDisplayNameError(null);
  };
  const setError = (errorPath, message) => {
    switch (errorPath) {
      case "email": {
        setEmailError(message);
        setPasswordError(null);
        setConfirmPasswordError(null);
        setDisplayNameError(null);
        break;
      }
      case "password": {
        {
          setPasswordError(message);
          setEmailError(null);
          setConfirmPasswordError(null);
          setDisplayNameError(null);

          break;
        }
      }
      case "confirmPassword": {
        {
          setConfirmPasswordError(message);
          setEmailError(null);
          setPasswordError(null);
          setDisplayNameError(null);

          break;
        }
      }
      case "displayName": {
        {
          setDisplayNameError(message);
          setEmailError(null);
          setPasswordError(null);
          setConfirmPasswordError(null);

          break;
        }
      }
    }
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
        {emailError && <Text style={styles.textError}>{emailError}</Text>}

        <Spacer position={"top"} size={"large"}></Spacer>
        <EditText
          onChangeText={(text) => setDisplayName(text)}
          value={displayName}
          placeholder={"Display name"}
          iconLeft={"lock"}
        ></EditText>
        {displayNameError && (
          <Text style={styles.textError}>{displayNameError}</Text>
        )}

        <Spacer position={"top"} size={"large"}></Spacer>
        <EditText
          onChangeText={(newPassword) => setPassword(newPassword)}
          isPasswordType={true}
          value={password}
          placeholder={"Password"}
          iconLeft={"lock"}
        ></EditText>
        {passwordError && <Text style={styles.textError}>{passwordError}</Text>}

        <Spacer position={"top"} size={"large"}></Spacer>
        <EditText
          onChangeText={(newPassword) => setConfirmPassword(newPassword)}
          isPasswordType={true}
          value={confirmPassword}
          placeholder={"Confirm password"}
          iconLeft={"lock"}
        ></EditText>
        {confirmPasswordError && (
          <Text style={styles.textError}>{confirmPasswordError}</Text>
        )}

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
  textError: {
    color: "tomato",
    marginTop: 4,
  },
});
