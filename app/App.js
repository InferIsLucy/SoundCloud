import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import Navigator from "./src/navigations/main.navigator";
import { AuthenticationContextProvider } from "./src/providers/authentication.context";

export default function App() {
  return (
    <AuthenticationContextProvider>
      <Navigator></Navigator>
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
