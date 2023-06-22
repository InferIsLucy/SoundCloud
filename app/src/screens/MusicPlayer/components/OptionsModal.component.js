import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
} from "react-native";
import SongItem from "./SongItem.component";
import { PlaylistContext } from "../../../providers/playlist.context";
import { AudioContext } from "../../../providers/audio.context";

const OptionsModal = ({ visible, onClose, song }) => {
  const { playlists, addSongToPlaylist } = useContext(PlaylistContext);
  const { setTimer } = useContext(AudioContext);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [timerModalVisible, setTimerModalVisible] = useState(false);

  useEffect(() => setTimer(100), []);
  const handleAddSongToPlaylist = async (playlist) => {
    try {
      setPlaylistModalVisible(false);
      await addSongToPlaylist(song.id, playlist);
      Alert.alert("Success");
    } catch (err) {
      Alert.alert("Failed!!!");
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.container,
              { opacity: playlistModalVisible || timerModalVisible ? 0.5 : 1 },
            ]}
          >
            <View
              style={[
                styles.row,
                {
                  borderBottomWidth: 1,
                  marginBottom: 12,
                },
              ]}
            >
              <View style={[styles.column, { flex: 0 }]}>
                <Image
                  source={song.imageUri == "" ? null : { uri: song.imageUri }}
                  style={styles.image}
                />
              </View>
              <View style={styles.column}>
                <Text style={styles.songName}>{song.name}</Text>
                <Text>{song.artistString}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setPlaylistModalVisible(true);
              }}
              style={styles.row}
            >
              <Image
                source={require("../../../../assets/playlist.png")}
                style={styles.iconImg}
              ></Image>
              <View style={styles.column}>
                <Text style={styles.option}>Add to playlist</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setTimerModalVisible(true);
              }}
              style={styles.row}
            >
              <View style={[styles.column, styles.icon]}>
                <Image
                  source={require("../../../../assets/stopwatch.png")}
                  style={styles.iconImg}
                ></Image>
              </View>
              <View style={styles.column}>
                <Text style={styles.option}>Set timer</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* Playlist modal */}
          <Modal
            animationType="fade"
            transparent={true}
            onRequestClose={() => {
              setPlaylistModalVisible(() => false);
            }}
            visible={playlistModalVisible}
          >
            <TouchableWithoutFeedback
              onPress={() => setPlaylistModalVisible(() => false)}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }} />
                <View style={styles.subModalContainer}>
                  <Text style={styles.modalHeading}>Choose playlist</Text>
                  <FlatList
                    data={playlists}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        onPress={() => handleAddSongToPlaylist(item)}
                      >
                        <PlaylistItem playlist={item} />
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                  />
                </View>
                <View style={{ flex: 1.2 }} />
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Timer modal */}
          <Modal
            animationType="fade"
            transparent={true}
            onRequestClose={() => {
              setTimerModalVisible(false);
            }}
            visible={timerModalVisible}
          >
            {/* Your timer modal content */}
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const PlaylistItem = ({ playlist }) => {
  return (
    <View style={[styles.playlistItemContainer]}>
      <Image
        source={require("../../../../assets/girl_listening_to_music.png")}
        style={styles.image}
      ></Image>
      <View>
        <Text style={[styles.songName, { color: "white" }]}>
          {playlist.name}
        </Text>
        <Text
          style={{ color: "white" }}
        >{`${playlist.songIds.length} bài hát`}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,

    justifyContent: "flex-end",
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 500,
  },
  row: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  container: {
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: "white",
    right: 0,
    padding: 8,
    left: 0,
  },
  songName: {
    fontWeight: "600",
    fontSize: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  column: {
    flex: 1,
  },
  icon: {
    flex: 0,
  },
  iconImg: {
    width: 24,
    height: 24,
    resizeMode: "cover",
  },
  option: {
    marginLeft: 12,
    fontSize: 16,
  },
  playlistItemContainer: {
    height: 70,
    backgroundColor: "#101010",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    width: 280,
    padding: 12,
    margin: 12,
  },
  subModalContainer: {
    backgroundColor: "white",
    justifyContent: "center",
    paddingTop: 12,
    alignItems: "center",
    height: 400,
    marginHorizontal: 24,
    borderRadius: 25,
  },
});

export default OptionsModal;
