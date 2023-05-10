import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import Navigator from "./src/navigations/main.navigator";
import { AuthenticationContextProvider } from "./src/providers/authentication.context";
import { AudioContextProvider } from "./src/providers/audio.context";
import UserProfile from "./src/screens/UserProfile/UserProfile.screen";
export default function App() {
  return (
    <AuthenticationContextProvider>
      <AudioContextProvider>
        <UserProfile></UserProfile>
      </AudioContextProvider>
    </AuthenticationContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
