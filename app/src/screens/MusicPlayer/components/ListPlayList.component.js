import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
  Button,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, memo, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { formatTime } from "../../../utils/TimeFormater";
import { Stack, IconButton } from "@react-native-material/core";
import Icon from "react-native-vector-icons/MaterialIcons";
import { PlaylistContext } from "../../../providers/playlist.context";

const ListPlayList = ({ Item, O }) => {
  const [isShow, setIsShow] = useState(false);
  const [playListName, setPlaylistName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { PlayLists, updatePlaylist, deletePlaylist } =
    useContext(PlaylistContext);

  const handleDeletePlaylist = (p) => {
    deletePlaylist(p);
  };
  const handleEditPlaylist = (index, name) => {
    setIsShow(true);
  };

  const handleDeletePlaylist2 = (p) => {};
  const handleOnSubmit = () => {
    if (!playListName.trim()) {
      setIsShow(false);
    } else {
      updatePlaylist(O, playListName);
      setIsShow(false);
    }
  };
  const [showBox, setShowBox] = useState(false);

  const showConfirmDialog = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this PlayList?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            handleDeletePlaylist(O);
            setShowBox(false);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          marginLeft: 12,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity onPress={() => handleDeletePlaylist2(Item)}>
          <Text
            style={{
              fontSize: 16,
              color: "white",
              fontWeight: "500",
              marginLeft: 10,
            }}
          >
            {Item}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEditPlaylist(Item, O)}>
          <Icon
            name="edit"
            size={22}
            color="white"
            style={{
              right: 12,
            }}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => showConfirmDialog()}>
        <Icon name="delete" size={22} color="white" />
      </TouchableOpacity>
      {isShow && (
        <Modal
          animationType="fade"
          style={{ height: 400, width: "100%" }}
          transparent
        >
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback
              onPress={() => onClose()}
              style={{ flex: 1 }}
            >
              <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
            </TouchableWithoutFeedback>
            <View style={styles.inputContainer}>
              <Text style={{ color: color.ACTIVE_BG }}>
                Create New Playlist
              </Text>
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
          <TouchableWithoutFeedback
            onPress={() => onClose()}
            style={{ flex: 1 }}
          >
            <View style={[styles.modalBG]} />
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};
const color = {
  APP_BG: "#fff",
  FONT: "#303d49",
  FONT_MEDIUM: "#636363",
  FONT_LIGHT: "#b6b8b9",
  MODAL_BG: "rgba(0,0,0,0.2)",
  ACTIVE_BG: "#5252ad",
  ACTIVE_FONT: "#fff",
};

export default memo(ListPlayList);
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    height: 90,
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
  img: { borderRadius: 50, width: 40, height: 40, resizeMode: "cover" },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 300,
    height: 300,
    backgroundColor: "red",
    marginBottom: 30,
  },
  text: {
    fontSize: 30,
  },
});
