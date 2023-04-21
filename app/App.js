import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
<<<<<<< Updated upstream
import LoginScreen from "./src/screens/Login.screen";

export default function App() {
  return (
    <View style={styles.container}>
      <LoginScreen></LoginScreen>
    </View>
  );
=======
import SearchScreen from "./src/screens/Search.screen";
import Navigator from "./src/navigations/main.navigator";

export default function App() {
  return <SearchScreen></SearchScreen>;
>>>>>>> Stashed changes
}

const styles = StyleSheet.create(   {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
