import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Scrollable,
  Touchable,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useState, useContext } from "react";
import COLORS from "../consts/colors";
import { formatTime } from "../utils/TimeFormater";
import PlayListInPutModal from "../components/PlayListInputMadal";
import { PlaylistContext } from "../providers/playlist.context";
import ListPlayList from "./MusicPlayer/components/ListPlayList.component";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fontSizes } from "../theme/fontSizes";
import ItemPlayList from "./MusicPlayer/components/ItemPlayList.component";
import places from "../consts/places";
import { Ionicons } from "@expo/vector-icons";
import { AudioContext } from "../providers/audio.context";
const color = {
  APP_BG: "#fff",
  FONT: "#303d49",
  FONT_MEDIUM: "#636363",
  FONT_LIGHT: "#b6b8b9",
  MODAL_BG: "rgba(0,0,0,0.2)",
  ACTIVE_BG: "#5252ad",
  ACTIVE_FONT: "#fff",
};
const { width } = Dimensions.get("screen");
const PlayList = () => {
  const { playlists, createNewPlaylist, updatePlaylist, deleteSongInPlaylist } =
    useContext(PlaylistContext);
  const { songs, listeningHistory } = useContext(AudioContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [localSongs, setLocalSongs] = useState([]);
  useEffect(() => {
    const list = songs.filter((song) => {
      return song.isLocalSong == true;
    });
    setLocalSongs(list);
  }, []);
  const Card = ({ song = {} }) => {
    return (
      <View activeOpacity={0.8}>
        <ImageBackground
          style={styles.cardImage}
          source={{
            uri: song.imageUri == "" ? null : song.imageUri,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
              textShadowColor: "#060606",
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 2,
            }}
          >
            {song.name}
          </Text>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="person-circle-outline" size={20} color="white" />
              <Text style={{ marginLeft: 5, color: "white", fontSize: 17 }}>
                {song.artistString}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="md-timer-outline" size={20} color="white" />
              <Text style={{ marginLeft: 5, color: "white", fontSize: 17 }}>
                {formatTime(song.duration)}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
      <View style={styles.header}>
        <TouchableOpacity style={{ paddingLeft: 8, paddingRight: 4 }}>
          <Ionicons name="chevron-back" size={32} color="black" />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginRight: 36,
          }}
        >
          <Text style={styles.heading}>Library</Text>
        </View>
      </View>
      <View contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>History</Text>
        <View>
          <FlatList
            contentContainerStyle={{ paddingLeft: 20 }}
            data={listeningHistory}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <Card song={item} />}
          />
          <Text style={styles.sectionTitle}>Your local song</Text>
          <FlatList
            snapToInterval={width - 20}
            contentContainerStyle={{ paddingLeft: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={localSongs}
            renderItem={({ item }) => <ItemPlayList song={item} />}
          />
          <Text style={styles.sectionTitle}>My Play List</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ marginTop: -10 }}
          >
            <Text style={styles.playListBtn}>+ Add New Playlist</Text>
          </TouchableOpacity>
        </View>
        {/* <FlatList
          data={playlists}
          renderItem={({ item }) => (
            <ListPlayList Item={item.name} O={item.id} />
          )}
        /> */}
        {playlists.map((playlist) => {
          return (
            <ListPlayList
              key={`key ${playlist.id}`}
              Item={playlist.name}
              O={playlist.id}
            />
          );
        })}

        <PlayListInPutModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          //onSubmit={createNewPlaylist}
        />
      </View>
    </ScrollView>
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
  rmCard01: {
    width: width - 250,
    height: 200,
    marginRight: 20,
    borderRadius: 30,
    overflow: "hidden",
    padding: 10,
  },
  rmCard: {
    width: width - 40,
    height: 200,
    marginRight: 20,
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginVertical: 20,
    fontWeight: "bold",
    fontSize: 20,
  },
  cardImage: {
    height: 220,
    width: width / 2,
    marginRight: 20,
    padding: 10,
    overflow: "hidden",
    borderRadius: 10,
  },
  heading: {
    fontSize: fontSizes.heading3,
    fontWeight: 500,
    textAlign: "center",
  },
  header: {
    height: 60,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default PlayList;
