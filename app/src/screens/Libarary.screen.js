import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Scrollable,
  Touchable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import ItemPlayListComponent from "./MusicPlayer/components/ItemPlayList.component";
import { useState, useContext } from "react";
import PlayListInPutModal from "../components/PlayListInputMadal";
import { PlaylistContext } from "../providers/playlist.context";
import ListPlayList from "./MusicPlayer/components/ListPlayList.component";
import Icon from "react-native-vector-icons/MaterialIcons";
const color = {
  APP_BG: "#fff",
  FONT: "#303d49",
  FONT_MEDIUM: "#636363",
  FONT_LIGHT: "#b6b8b9",
  MODAL_BG: "rgba(0,0,0,0.2)",
  ACTIVE_BG: "#5252ad",
  ACTIVE_FONT: "#fff",
};

const PlayList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { playlists, createNewPlaylist, updatePlaylist, deleteSongInPlaylist } =
    useContext(PlaylistContext);

  // const createPlayList = async (playListName) => {
  //   // const result = await AsyncStorage.setItem("playlists");
  //   // if (result !== null) {
  //   //   const createNewPlaylist = {
  //   //     id: playlists.length + 1,
  //   //     userId: userId,
  //   //     name: playlistName,
  //   //     songsId: [],
  //   //   };
  //   // }
  // };

  return (
    <View contentContainerStyle={styles.container}>
      <FlatList
        data={playlists}
        renderItem={({ item }) => <ListPlayList Item={item.name} O={item.id} />}
      />
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ marginTop: 15 }}
      >
        <Text style={styles.playListBtn}>+ Add New Playlist</Text>
      </TouchableOpacity>

      <PlayListInPutModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        //onSubmit={createNewPlaylist}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  playListBanner: {
    padding: 5,
    backgroundColor: "rgba(204,204,204,0.3)",
    borderRadius: 5,
  },
  audioCount: {
    marginTop: 5,
    opacity: 0.5,
    fontSize: 14,
  },
  playListBtn: {
    color: color.ACTIVE_BG,
    letterSpacing: 1,
    fontSize: 14,
    fontWeight: "bold",
    padding: 5,
  },
});

export default PlayList;
