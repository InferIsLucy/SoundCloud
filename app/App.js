import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import SearchScreen from "./src/screens/Search.screen";


export default function App() {
  return <SearchScreen></SearchScreen>;

}

const styles = StyleSheet.create(   {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
