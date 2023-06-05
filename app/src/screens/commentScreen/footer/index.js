import {
  View,
  Text,
  Keyboard,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useContext, memo } from "react";
import styles from "./style";
import { Entypo } from "@expo/vector-icons";
import { CommentContext } from "../../../providers/comment.context";

const footer = ({ setComments, songId }) => {
  const { addComment } = useContext(CommentContext);
  const [comment, setComment] = useState("");
  const handleAddComment = async () => {
    if (comment.length === 0) {
      return false;
    }
    const newCmt = await addComment(songId, comment);
    setComments((prev) => [...prev, newCmt]);
    setComment("");
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={styles.addComment}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={10}
      enabled={true}
    >
      <TextInput
        value={comment}
        placeholder="Your comment"
        style={styles.input}
        onChangeText={(text) => setComment(text)}
      ></TextInput>
      <TouchableOpacity onPress={() => handleAddComment()}>
        <View style={styles.iconWrapper}>
          <Entypo name="paper-plane" size={24} color="black" />
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default memo(footer);
