import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "../../theme/color";
import { Feather } from "@expo/vector-icons";
import SongItem from "./components/SongItem.component";
import { ImageBackground } from "react-native";
import { AudioContext } from "../../providers/audio.context";
import { PlaylistContext } from "../../providers/playlist.context";

//DetailPlaylist
const DetailPlaylist = ({ navigation, route }) => {
  const { playlist } = route.params;
  console.log("show", playlist);
  const { songs, currentSong, setPlaylist } = useContext(AudioContext);
  const { getPlaylistSongs } = useContext(PlaylistContext);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  useEffect(() => {
    const result = getPlaylistSongs(songs, playlist);
    setPlaylistSongs(result);
    setPlaylist(result);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header1}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{ paddingLeft: 8, paddingRight: 4 }}
          >
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
            source={require("../../../assets/girl_listening_to_music.png")}
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
        <FlatList
          data={playlistSongs}
          renderItem={({ item }) => (
            <SongItem navigation={navigation} song={item}></SongItem>
          )}
        />
      </View>
    </View>
  );
};

export default DetailPlaylist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

    justifyContent: "flex-start",
  },
  header: { backgroundColor: "#1c1348" },
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
