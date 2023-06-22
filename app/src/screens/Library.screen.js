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
import SongItem from "./MusicPlayer/components/SongItem.component";
import places from "../consts/places";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme/color";
import { AudioContext } from "../providers/audio.context";
import { AuthenticationContext } from "../providers/authentication.context";
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
const PlayList = ({ navigation }) => {
  const { playlists, createNewPlaylist, updatePlaylist, deleteSongInPlaylist } =
    useContext(PlaylistContext);
  const { user } = useContext(AuthenticationContext);
  const {
    songs,
    listeningHistory,
    setPlaylist,
    localSongs,
    addSongToHistory,
    setCurrentSong,
  } = useContext(AudioContext);
  const LinkImg =
    "https://images.pexels.com/photos/3574678/pexels-photo-3574678.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  const [modalVisible, setModalVisible] = useState(false);
  const [isHistoryItemClicked, setIsHistoryItemClicked] = useState(false);
  const [isLocalItemClicked, setIslocalItemClicked] = useState(false);
  // const [localSongs, setLocalSongs] = useState([]);
  // useEffect(() => {
  //   const list = songs.filter((song) => {
  //     return song.isLocalSong == true;
  //   });
  //   setLocalSongs(list);
  // }, []);
  const Card = ({ song = {} }) => {
    return (
      <View activeOpacity={0.8}>
        <ImageBackground
          style={styles.cardImage}
          source={{
            uri: song.imageUri == "" ? LinkImg : song.imageUri,
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
  const handleItemClick = (song, type) => {
    switch (type) {
      case "history":
        //check if fisrt time click on item
        if (!isHistoryItemClicked) {
          setPlaylist(listeningHistory);
        }
        setIsHistoryItemClicked(false);
        setIslocalItemClicked(true);
        break;
      case "local":
        if (!isLocalItemClicked) {
          setPlaylist(localSongs);
        }
        setIsHistoryItemClicked(true);
        setIslocalItemClicked(false);
        break;
    }
    handlePlaySong(song);
  };
  const handlePlaySong = (song) => {
    setCurrentSong(() => song);
    navigation.navigate("Player");
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.authBackground }}>
      <View style={styles.header}>
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
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleItemClick(item, "history")}
              >
                <Card song={item} />
              </TouchableOpacity>
            )}
          />
          <Text style={styles.sectionTitle}>Your local song</Text>
          <FlatList
            snapToInterval={width - 20}
            contentContainerStyle={{ paddingLeft: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={localSongs}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemClick(item, "local")}>
                <Card song={item} />
              </TouchableOpacity>
            )}
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
    backgroundColor: Colors.authBackground,
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
    color: "#d8d826",
    borderRadius: 10,
    //backgroundColor: "#000000",
    letterSpacing: 1,
    fontSize: 14,
    left: 15,
    fontWeight: "bold",
    padding: 10,
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
    color: Colors.defaultTextColor,
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
    color: Colors.defaultTextColor,
    fontWeight: 500,
    marginLeft: 35,
    textAlign: "center",
  },
  header: {
    height: 60,
    paddingTop: 12,
    //flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default PlayList;
