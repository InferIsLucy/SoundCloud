import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext, memo, useEffect, useState } from "react";
import { AudioContext } from "../../../providers/audio.context";
import { formatTime } from "../../../utils/TimeFormater";
import { UserContext } from "../../../providers/user.context";

// item artist in artist list modal
const ArtistTag2 = ({ artist = {}, defaultSelectedValue, toggleAddArtist }) => {
  const [isSelected, setIsSelected] = useState(defaultSelectedValue);
  const handleSelectItem = () => {
    setIsSelected((prev) => !prev);
    toggleAddArtist(artist);
  };
  return (
    <TouchableOpacity
      onPress={handleSelectItem}
      style={
        isSelected
          ? [styles.container, styles.itemSelectedContainer]
          : styles.container
      }
    >
      <Image
        source={{
          uri: artist.avtUri,
        }}
        style={styles.img}
      ></Image>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          numberOfLines={1}
          style={
            isSelected
              ? { fontSize: 16, color: "white", fontWeight: 500 }
              : { fontSize: 16, color: "black", fontWeight: 500 }
          }
        >
          {artist.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ArtistTag2;

const styles = StyleSheet.create({
  container: {
    height: 72,
    borderWidth: 2,
    borderColor: "#231b4d",
    // backgroundColor: "#231b4d",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 12,
    margin: 12,
  },
  itemSelectedContainer: {
    backgroundColor: "#231b4d",
  },
  img: { borderRadius: 50, width: 40, height: 40, resizeMode: "cover" },
});
