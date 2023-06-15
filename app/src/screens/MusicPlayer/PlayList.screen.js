import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import ItemPlayList from "./components/ItemPlayList.component";
import { ImageBackground } from "react-native";
import { AudioContext } from "../../providers/audio.context";

//DetailPlaylist
const PlayList = () => {
  const { songs, currentSong } = useContext(AudioContext);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header1}>
          <TouchableOpacity style={{ paddingLeft: 8, paddingRight: 4 }}>
            <Ionicons name="chevron-back" size={32} color="#cac5e5" />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: 500,
                color: "white",
                fontSize: 20,
              }}
            >
              Playlist
            </Text>
          </View>
          <TouchableOpacity style={{ paddingLeft: 4, paddingRight: 8 }}>
            <Feather name="more-horizontal" size={32} color="#cac5e5" />
          </TouchableOpacity>
        </View>
        <View style={styles.header2}></View>
        <View
          style={[
            {
              padding: 32,
              backgroundColor: "#29205d",
              position: "absolute",
              borderRadius: 24,
              bottom: 0,
              marginLeft: 24,
              elevation: 5,
            },
            styles.boxWithShadow,
          ]}
        >
          <Image
            style={{ width: 160, height: 160, borderRadius: 24 }}
            source={{
              uri: "https://scontent.fsgn13-4.fna.fbcdn.net/v/t39.30808-6/345233585_3487344644926329_8037647308456647249_n.jpg?stp=dst-jpg_s600x600&_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=VbpDJyKRgJQAX9ENQew&_nc_ht=scontent.fsgn13-4.fna&oh=00_AfCmPytdWUlbad82ZV66FR1hC5HftsYHUBs251YtDTypeg&oe=645B8F2C",
            }}
          ></Image>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: "#1c1348" }}>
        <View
          style={{
            paddingLeft: 24,
            marginTop: 12,
            flexDirection: "row",
            padding: 12,
            alignItems: "center",
          }}
        >
          <Entypo name="beamed-note" size={24} color="white" />
          <Text style={{ color: "white", marginLeft: 4 }}>Song Playlist</Text>
        </View>
        <ItemPlayList song={songs[0]}></ItemPlayList>
      </View>
    </View>
  );
};

export default PlayList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

    justifyContent: "flex-start",
  },
  header: {},
  header1: {
    height: 200,
    paddingTop: 24,
    backgroundColor: "#140d36",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  header2: {
    height: 100,
    backgroundColor: "#1c1348",
  },
  boxWithShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});
