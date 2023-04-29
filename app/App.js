import React from "react";
import { StyleSheet, Text, View,StatusBar } from "react-native";

//import SearchScreen from "./src/screens/Search.screen";
import MusicPlayer from "./src/screens/PlayMusic.screen";

export default function App() {
  return (
      <View style={styles.container}>
        <StatusBar barStyle = "light-content"/>
        <MusicPlayer/>
      </View>
    );

}

const styles = StyleSheet.create(   {
  container: {
    flex: 1,

  },
});

