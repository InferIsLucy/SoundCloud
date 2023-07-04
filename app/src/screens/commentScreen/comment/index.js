import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useContext, useEffect, memo } from "react";
import styles from "./style";
import { Avatar } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import Comment from "../footer/index";
import { CommentContext } from "../../../providers/comment.context";
import ReplyCommentItem from "../ReplyCommentItem.component";
const dayjs = require("dayjs");

const comment = ({
  comment,
  songId,
  setSelectedComment,
  setBottomMenuVisible,
}) => {
  const { addComment, loadComments, loadReplyComments } =
    useContext(CommentContext);
  const [showReplyCommentInput, setShowReplyCommentInput] = useState(false);
  const [replyCommentContent, setReplyCommentContent] = useState("");
  const [replyList, setReplyList] = useState([]);
  const toggleShowReplyCommentInput = () => {
    setShowReplyCommentInput((prev) => !prev);
  };
  const handleReplyComment = async () => {
    if (replyCommentContent.length === 0) {
      return false;
    }
    const newCmt = await addComment(songId, replyCommentContent, comment.id);
    // await loadComments(songId, setComments);
    setReplyList((prev) => [...prev, newCmt]);
    setReplyCommentContent("");
    Keyboard.dismiss();
  };
  const moreIconOnClick = () => {
    setSelectedComment(() => comment);
    setBottomMenuVisible(true);
  };
  const getReplyComments = async () => {
    const list = await loadReplyComments(comment.id);
    setReplyList(list);
  };
  useEffect(() => {
    getReplyComments();
  }, []);
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 15,
        }}
      >
        <View style={styles.userImage}>
          {comment.userAvatar == "" ? (
            <Avatar.Image
              size={35}
              source={require("./../../../../assets/useravatar.png")}
            />
          ) : (
            <Avatar.Image
              size={35}
              source={{
                uri: comment.userAvatar,
              }}
            />
          )}
        </View>
        <View style={styles.body}>
          <View style={styles.commentInfor}>
            <View>
              <Text style={styles.userName}>{comment.userName}</Text>
            </View>
            <View style={styles.commentRecordedTime}>
              <Text style={styles.time}>
                {dayjs(comment.createdAt).format(
                  "DD/MM/YYYY" + " lúc " + "HH:mm"
                )}
                <Entypo name="dot-single" size={15} color="#898989" />
              </Text>
            </View>
          </View>
          <View style={styles.content}>
            <Text numberOfLines={2}>{comment.content}</Text>
          </View>
          <View style={styles.moreOption}>
            <TouchableOpacity
              style={styles.reply}
              onPress={toggleShowReplyCommentInput}
            >
              <Text style={styles.replyText}>Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={moreIconOnClick}>
              <Entypo
                name="dots-three-vertical"
                size={17}
                color="black"
                style={styles.replyText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {replyList.map((replyComment) => {
        return (
          <ReplyCommentItem
            setBottomMenuVisible={setBottomMenuVisible}
            setSelectedComment={setSelectedComment}
            getReplyComments={getReplyComments}
            key={replyComment.id}
            comment={replyComment}
          ></ReplyCommentItem>
        );
      })}
      {/* input bar for reply commen */}
      {showReplyCommentInput && (
        <KeyboardAvoidingView
          style={{
            paddingHorizontal: 20,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#d9d4d4",
            borderRadius: 4,

            justifyContent: "space-between",
          }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={10}
          enabled={true}
        >
          <TextInput
            value={replyCommentContent}
            placeholder={`Reply to ${comment.userName}`}
            style={[styles.input, { paddingVertical: 4 }]}
            onChangeText={(text) => setReplyCommentContent(text)}
          ></TextInput>
          <TouchableOpacity onPress={handleReplyComment}>
            <View style={styles.iconWrapper}>
              <Entypo name="paper-plane" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default memo(comment);
