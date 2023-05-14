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
import { signInWithPopup } from "firebase/auth";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLoginWithEmail, auth, sendPasswordResetEmail } = useContext(
    AuthenticationContext
  );
  const handleLoginWithEmail = () => {
    onLoginWithEmail(email, password);
  };
  const handleResetPassword = () => {
    // const actionCodeSettings = {
    //     url: 'https://www.example.com/?email=user@example.com',
    //     iOS: {
    //        bundleId: 'com.example.ios'
    //     },
    //     android: {
    //       packageName: 'com.example.android',
    //       installApp: true,
    //       minimumVersion: '12'
    //     },
    //     handleCodeInApp: true
    //   };
    //   await sendSignInLinkToEmail(auth, 'user@example.com', actionCodeSettings);
    //   // Obtain emailLink from the user.
    //   if(isSignInWithEmailLink(auth, emailLink)) {
    //     await signInWithEmailLink(auth, 'user@example.com', emailLink);
    //   }
    console.log("email", email);
    sendPasswordResetEmail(auth, "jbkhanhtran@gmail.com")
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
        <Spacer position={"top"} size={"large"}></Spacer>
        <EditText
          value={password}
          onChangeText={(newPassword) => setPassword(newPassword)}
          isPasswordType={true}
          placeholder={"Password"}
          iconLeft={"lock"}
        ></EditText>

        <Spacer position={"top"} size={"large"}></Spacer>
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
});