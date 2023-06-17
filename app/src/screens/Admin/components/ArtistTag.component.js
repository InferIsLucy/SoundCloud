import { StyleSheet, Text, Image, View } from "react-native";
import React from "react";
import { Colors } from "../../../theme/color";

const ArtistTag = ({ artist }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={{ uri: artist.avtUri }}></Image>
      <Text style={styles.name}>{artist.name}</Text>
    </View>
  );
};

export default ArtistTag;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    resizeMode: "cover",
  },
  name: {
    fontWeight: 500,
    color: Colors.bodyTextColor,
  },
});
