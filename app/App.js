import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, } from "react-native";

import SearchScreen from "./src/screens/Search.screen";


export default function App() {
  return (
      <View style={styles.container}>
        <StatusBar barStyle = "light-content"/>
        <SearchScreen/>
      </View>
    );

}

const styles = StyleSheet.create(   {
  container: {
    flex: 1,

  },
});

