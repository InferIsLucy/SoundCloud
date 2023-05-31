import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext, memo, useEffect } from "react";
import styles from "./CommentScr.component.style";
import { AntDesign } from "@expo/vector-icons";
import Comment from "./comment/index";
import Footer from "./footer/index";
import { CommentContext } from "../../providers/comment.context";

const CommentScreen = ({ setCommentsVisible, songId }) => {
  const { addComment, isLoading, loadComments } = useContext(CommentContext);
  const [comments, setComments] = useState([]);
  console.log("COMMENTS SCREEN - comments", comments);
  useEffect(() => {
    loadComments(songId, setComments);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.sub_header}>
          <View style={styles.currentComments}>
            <TouchableOpacity
              onPress={() => {
                setCommentsVisible((prev) => !prev);
              }}
            >
              <View style={styles.closeBtn}>
                <AntDesign name="close" size={24} color="black" />
              </View>
            </TouchableOpacity>
            <Text
              style={styles.totalComment}
            >{`${comments.length} Comments`}</Text>
          </View>
          <View style={styles.currentSong}>
            <View style={styles.Image}>
              <Image
                source={require("./../../../assets/singtoyou.png")}
                style={styles.songImage}
              />
            </View>
            <View style={styles.songInfor}>
              <Text style={styles.songName} numberOfLines={1}>
                Sing to You (FEAT. Shiloh Dynasty) *ALSO ON SPOTIFY*
              </Text>
              <Text style={styles.artis}>Monty Datta</Text>
            </View>
          </View>
        </View>
        {isLoading == true ? (
          <ActivityIndicator size={40} style={{ flex: 1 }}></ActivityIndicator>
        ) : (
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {comments.map((item, index) => {
              return <Comment key={index} comment={item} />;
            })}
          </ScrollView>
        )}
      </View>
      <View style={styles.footer}>
        <Footer setComments={setComments} songId={songId} />
      </View>
    </View>
  );
};

export default memo(CommentScreen);
