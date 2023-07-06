import React, {
  useContext,
  useEffect,
  memo,
  useLayoutEffect,
  useState,
} from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { PlaylistContext } from "../../../providers/playlist.context";
import { AudioContext } from "../../../providers/audio.context";
import { Image } from "react-native";
import { CommentContext } from "../../../providers/comment.context";
import { UserContext } from "../../../providers/user.context";

const BottomMenu = ({ visible, onClose, selectedComment, setComments }) => {
  const { deleteComment } = useContext(CommentContext);
  const { user } = useContext(UserContext);
  const handleDeleteComment = async () => {
    console.log(
      "user.userId == selectedComment.userId",
      user.userId,
      selectedComment.userId
    );
    try {
      if (user.userId == selectedComment.userId) {
        Alert.alert("Error", "Cannot delete this comment");
        onClose();
        return;
      }
      await deleteComment(selectedComment.id);
      setComments((prev) => prev.filter((cmt) => cmt.id != selectedComment.id));
      onClose();
    } catch (er) {
      console.log("err when delete comment");
    }
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        onClose();
      }}
      visible={visible}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          onClose();
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }} />
          <View style={styles.container}>
            {/* <View style={styles.heading}>
              <Image
                source={require("../../../../assets/stopwatch.png")}
                style={styles.iconImg}
              ></Image>
              <Text style={{ fontSize: 16, marginLeft: 8 }}>Set timer</Text>
            </View> */}
            <Item
              icon={"delete"}
              onPress={handleDeleteComment}
              text={"Delete comment"}
            ></Item>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const Item = ({ onPress, icon, text }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.timerOptionWrapper}>
      <MaterialIcons name={icon} size={24} color="black" />
      <Text style={styles.timerOption}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  timerOption: {
    textAlign: "left",
    width: "100%",
    fontSize: 16,
  },
  iconImg: {
    width: 24,
    height: 24,
    resizeMode: "cover",
  },
  heading: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    paddingTop: 12,
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  timerOptionWrapper: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "#e6e3e3",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
  },
});

export default BottomMenu;
