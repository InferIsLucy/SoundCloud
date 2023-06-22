import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AudioContext } from "../../providers/audio.context";
import { Colors } from "../../theme/color";
const BottomPlayer = () => {
  const { isPlaying, audioEvents, isBottomBarVisible, currentSong } =
    useContext(AudioContext);
  const navigation = useNavigation();
  // to show bottom player or not
  if (currentSong == null || !isBottomBarVisible) {
    return <></>;
  }
  return (
    <View
      style={{
        position: "absolute",
        bottom: 48,
        left: 0,
        right: 0,
        backgroundColor: Colors.authBackground,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Player");
        }}
        style={styles.container}
      >
        {currentSong.imageUri == "" ? (
          <Image
            source={{
              uri: "https://scontent.fsgn13-4.fna.fbcdn.net/v/t39.30808-6/345233585_3487344644926329_8037647308456647249_n.jpg?stp=dst-jpg_s600x600&_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=VbpDJyKRgJQAX9ENQew&_nc_ht=scontent.fsgn13-4.fna&oh=00_AfCmPytdWUlbad82ZV66FR1hC5HftsYHUBs251YtDTypeg&oe=645B8F2C",
            }}
            style={styles.img}
          ></Image>
        ) : (
          <Image
            source={{
              uri: currentSong.imageUri,
            }}
            style={styles.img}
          ></Image>
        )}

        <View>
          <Text
            numberOfLines={1}
            style={{
              width: 160,
              fontSize: 16,
              fontWeight: 500,
              color: "white",
            }}
          >
            {currentSong.name}
          </Text>
          <Text numberOfLines={1} style={{ color: "white" }}>
            {currentSong.artistString}
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
      </TouchableOpacity>
    </View>
  );
};

export default BottomPlayer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
  img: {
    borderRadius: 25,
    width: 44,
    height: 44,
    marginRight: 12,
    resizeMode: "contain",
  },
});
