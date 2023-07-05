import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useState, useContext } from "react";
import { PlaylistContext } from "../providers/playlist.context";
import { UserContext } from "../providers/user.context";
const color = {
  APP_BG: "#fff",
  FONT: "#303d49",
  FONT_MEDIUM: "#636363",
  FONT_LIGHT: "#b6b8b9",
  MODAL_BG: "rgba(0,0,0,0.2)",
  ACTIVE_BG: "#5252ad",
  ACTIVE_FONT: "#fff",
};

const PlayListInPutModal = ({ visible, onClose }) => {
  const [playListName, setPlaylistName] = useState("");
  const { playlists, createNewPlaylist, updatePlaylist, deleteSongInPlaylist } =
    useContext(PlaylistContext);
  const { user } = useContext(UserContext);
  const handleOnSubmit = () => {
    if (!playListName.trim()) {
      onClose();
    } else {
      createNewPlaylist(playListName, user.userId);
      setPlaylistName("");
      onClose();
    }
  };
  return (
    <Modal
      visible={visible}
      animationType="fade"
      style={{ height: 400, width: "100%" }}
      transparent
    >
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={() => onClose()} style={{ flex: 1 }}>
          <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
        </TouchableWithoutFeedback>
        <View style={styles.inputContainer}>
          <Text style={{ color: color.ACTIVE_BG }}>Create New Playlist</Text>
          <TextInput
            value={playListName}
            onChangeText={(text) => setPlaylistName(text)}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleOnSubmit}>
            <AntDesign
              name="check"
              size={24}
              color={color.ACTIVE_FONT}
              style={styles.submitIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={() => onClose()} style={{ flex: 1 }}>
        <View style={[styles.modalBG]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    backgroundColor: color.ACTIVE_FONT,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: width - 40,
    borderBottomWidth: 1,
    borderBottomColor: color.ACTIVE_BG,
    fontSize: 18,
    paddingVertical: 5,
  },
  submitIcon: {
    padding: 10,
    backgroundColor: color.ACTIVE_BG,
    borderRadius: 50,
    marginTop: 15,
  },
  modalBG: {
    backgroundColor: color.MODAL_BG,
  },
});

export default PlayListInPutModal;
