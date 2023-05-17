import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import EditText from "../shared-components/EditText.component";
import AuthFrame from "../shared-components/AuthFrame.component";
import {
  AuthButton,
  GoogleAuthButton,
  FbAuthButton,
} from "../shared-components/AuthButton.component";
import { Spacer } from "../../components/spacer";
import { Colors } from "../../theme/color";
import { AuthenticationContext } from "../../providers/authentication.context";
import * as yup from "yup";
import { loginSchema } from "../../utils/Validator";
import { signInWithPopup } from "firebase/auth";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const { onLoginWithEmail, auth, error, sendPasswordResetEmail } = useContext(
    AuthenticationContext
  );
  const handleLoginWithEmail = () => {
    loginSchema

      .validate({ email, password })
      .then(() => {
        onLoginWithEmail(email, password);
        setEmailError(null);
        setPasswordError(null);
      })
      .catch((error) => {
        console.log("err", error);
        setError(error.path, error.message);
      });
  };

  const setError = (errorPath, message) => {
    switch (errorPath) {
      case "email": {
        setEmailError(message);
        setPasswordError(null);
        break;
      }
      case "password": {
        {
          setEmailError(null);
          setPasswordError(message);
          break;
        }
      }
    }
  };
  const handleResetPassword = () => {
    console.log("email", email);
    sendPasswordResetEmail(auth, email)
      .then(() => console.log("sended"))
      .catch((er) => console.log("error", er));
  };
  const handleLoginWithGoogle = () => {};
  return (
    <View style={styles.container}>
      <AuthFrame
        onBackBtnPress={() => {
          navigation.navigate("Auth");
        }}
        heading={"Sign in"}
      >
        <GoogleAuthButton
          onPress={handleLoginWithGoogle}
          buttonContent={"Continue with Google"}
        ></GoogleAuthButton>

        <Spacer position={"top"} size={"large"}></Spacer>

        <FbAuthButton buttonContent={"Continue with Facebook"}></FbAuthButton>

        <Spacer position={"top"} size={"huge"}></Spacer>
        <Spacer position={"top"} size={"huge"}></Spacer>

        <EditText
          value={email}
          onChangeText={(newEmail) => setEmail(newEmail)}
          placeholder={"Email"}
          iconLeft={"email"}
        ></EditText>

        {emailError && <Text style={styles.textError}>{emailError}</Text>}
        <Spacer position={"top"} size={"large"}></Spacer>
        <EditText
          value={password}
          onChangeText={(newPassword) => setPassword(newPassword)}
          isPasswordType={true}
          placeholder={"Password"}
          iconLeft={"lock"}
        ></EditText>
        {passwordError && <Text style={styles.textError}>{passwordError}</Text>}
        <Spacer position={"top"} size={"large"}></Spacer>
        {error && <Text style={styles.textError}>{error}</Text>}
        <Spacer position={"top"} size={"large"}></Spacer>
        <AuthButton
          onPress={handleLoginWithEmail}
          buttonContent={"Login"}
        ></AuthButton>

        <Spacer position={"top"} size={"medium"}></Spacer>

        <TouchableOpacity onPress={handleResetPassword}>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>
      </AuthFrame>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Colors.authBackground,
  },
  forgotPassword: {
    fontSize: 16,
    color: "black",
  },
  textError: {
    color: "tomato",
    marginTop: 4,
  },
});
