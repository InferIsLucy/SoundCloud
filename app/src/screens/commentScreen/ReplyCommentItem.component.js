import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import styles from "./comment/style.js";
import { Avatar } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { UserContext } from "../../providers/user.context.js";
const dayjs = require("dayjs");

const ReplyCommentItem = ({
  comment,
  setBottomMenuVisible,
  setSelectedComment,
}) => {
  const moreIconOnClick = () => {
    // setSelectedComment(() => comment);
    // setBottomMenuVisible(true);
  };
  return (
    <View
      style={{
        flexDirection: "row",
        paddingVertical: 15,
        marginLeft: 40,
      }}
    >
      <View style={styles.userImage}>
        {comment.userAvatar == "" ? (
          <Avatar.Image
            size={35}
            source={require("../../../assets/useravatar.png")}
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
      <View style={{ flexDirection: "row" }}>
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
        </View>
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
  );
};

export default ReplyCommentItem;
