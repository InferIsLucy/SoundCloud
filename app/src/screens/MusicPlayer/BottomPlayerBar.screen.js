import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AudioContext } from "../../providers/audio.context";
const BottomPlayer = () => {
  const { isPlaying, audioEvents } = useContext(AudioContext);
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://scontent.fsgn13-4.fna.fbcdn.net/v/t39.30808-6/345233585_3487344644926329_8037647308456647249_n.jpg?stp=dst-jpg_s600x600&_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=VbpDJyKRgJQAX9ENQew&_nc_ht=scontent.fsgn13-4.fna&oh=00_AfCmPytdWUlbad82ZV66FR1hC5HftsYHUBs251YtDTypeg&oe=645B8F2C",
        }}
        style={{
          borderRadius: 25,
          width: 44,
          height: 44,
          marginRight: 12,
          resizeMode: "contain",
        }}
      ></Image>
      <View>
        <Text
          numberOfLines={1}
          style={{ width: 160, fontSize: 16, fontWeight: 500, color: "white" }}
        >
          You are my everything
        </Text>
        <Text numberOfLines={1} style={{ color: "white" }}>
          Laura Pau
        </Text>
      </View>
      {/* controller */}
      <View style={styles.controller}>
        <TouchableOpacity onPress={audioEvents.playPrev}>
          <Entypo name="controller-jump-to-start" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={audioEvents.togglePlayStatus}>
          {isPlaying ? (
            <Ionicons name="pause-circle-sharp" size={44} color="white" />
          ) : (
            <Ionicons name="play-circle-sharp" size={44} color="white" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={audioEvents.playNext}>
          <Entypo name="controller-next" size={36} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomPlayer;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 80,
    padding: 8,
    backgroundColor: "#1c2534",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  controller: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
});
