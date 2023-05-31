import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import React, { useState } from "react";
import styles from "./style";
import { Avatar } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import Comment from "../footer/index";
const dayjs = require("dayjs");

const comment = ({ comment }) => {
  const [isReplyComment, setIsReplyComment] = useState(styles.container);
  const handleOpenReplyComment = () => {
    setIsReplyComment(styles.containerReply);
  };

  return (
    <View style={isReplyComment}>
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
              <Entypo name="dot-single" size={15} color="#898989" /> 2w{" "}
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text numberOfLines={2}>{comment.content}</Text>
        </View>
        <View style={styles.moreOption}>
          <TouchableOpacity
            style={styles.reply}
            onPress={handleOpenReplyComment}
          >
            <Text style={styles.replyText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity>
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
  );
};

export default comment;
