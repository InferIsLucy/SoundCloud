import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext, memo, useEffect } from "react";
import { Feather } from "@expo/vector-icons";

import { AudioContext } from "../../../providers/audio.context";
import { formatTime } from "../../../utils/TimeFormater";
import { UserContext } from "../../../providers/user.context";
import { formatListenNumber } from "../../../utils/Converters";

//SongItem
const SongItem = ({ navigation, song = {} }) => {
  const { setCurrentSong, addSongToHistory } = useContext(AudioContext);
  const { user } = useContext(UserContext);
  const handleItemClick = (song) => {
    setCurrentSong(song);
    navigation.navigate("Player");
  };
  return (
    <TouchableOpacity
      onPress={() => {
        if (song.isLocalSong == null) {
          addSongToHistory(user.userId, song.id);
        }
        handleItemClick(song);
      }}
      style={styles.container}
    >
      <Image
        source={{
          uri: song.imageUri == "" ? null : song.imageUri,
        }}
        style={styles.img}
      ></Image>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            numberOfLines={1}
            style={{ fontSize: 16, color: "white", fontWeight: 500 }}
          >
            {song.name}
          </Text>
          <Text numberOfLines={1} style={{ color: "#cac5e5", marginLeft: 4 }}>
            {`${formatListenNumber(song.listens)} `}
          </Text>
          <Feather name="headphones" size={18} color="#cac5e5" />
        </View>
        <Text numberOfLines={1} style={{ color: "#cac5e5" }}>
          {song.artistString}
        </Text>
      </View>
      <Text style={{ color: "#cac5e5", marginLeft: 12, marginRight: 4 }}>
        {formatTime(song.duration)}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(SongItem);

const styles = StyleSheet.create({
  container: {
    height: 88,
    backgroundColor: "#101010",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 12,
    margin: 12,
  },
  boxWithShadow: {
    shadowColor: "#000",
    borderWidth: 1,
    overflow: "hidden",
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 10,
  },
  img: { borderRadius: 50, width: 40, height: 40, resizeMode: "cover" },
});
