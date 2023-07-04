// import axios from "axios";
// import config from "@src/config";
// import $t from "@src/constants/i18n";
// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";
// import React, { useEffect } from "react";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import GoogleLogo from "@src/assets/svg/google.svg";

// WebBrowser.maybeCompleteAuthSession();
// const AUTH_STATE_KEY = "AuthKey";

// const GoogleLoginButton = ({handleLogin}) => {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId: config.EXPO_GOOGLE_CLIENT_ID,
//     iosClientId: config.IOS_GOOGLE_CLIENT_ID,
//     androidClientId: config.ANDROID_GOOGLE_CLIENT_ID,
//     webClientId: config.WEB_GOOGLE_CLIENT_ID,
//   });

//   useEffect(() => {
//     if (response && response?.type === "success") {
//       const auth = response.params;
//       // const storageValue = JSON.stringify(auth);
//       // if (Platform.OS !== "web") {
//       //   SecureStore.setItemAsync(AUTH_STATE_KEY, storageValue);
//       // }
//       axios
//         .get(
//           `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${auth["access_token"]}`,
//         )
//         .then((res) => {
//           const { id, name, email } = res.data;
//           props.handleLogin(name, email);
//           axios
//             .post("http://localhost:8080/api/auth/loginoauth", {
//               displayname: name,
//               email: email,
//               idsocial: id,
//             })
//             .then((res) => {
//               const { user } = res.data;
//               props.handleLogin(user);
//             })
//             .catch((err) => console.log({ err }));
//         })
//         .catch((err) => console.log(err));
//     }
//   }, [response]);

//   return (
//     <TouchableOpacity
//       style={styles.btn}
//       disabled={!request}
//       onPress={() => {
//         promptAsync();
//       }}>
//       <View style={styles.wrapper}>
//         <GoogleLogo width={24} height={24} />
//         <Text style={styles.text}>{$t("loginwgoogle")}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   btn: {
//     backgroundColor: "#fcfcfc",
//     alignItems: "center",
//     paddingVertical: 16,
//     borderRadius: 8,
//     shadowColor: "#6F7EC9",
//     shadowOffset: {
//       width: -1,
//       height: -1,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//   },
//   wrapper: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-around",
//   },
//   text: {
//     color: "#35438E",
//     fontSize: 18,
//     fontWeight: "500",
//     marginLeft: 20,
//   },
// });

// export default GoogleLoginButton;
