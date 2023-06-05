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
import { AudioContext } from "../../providers/audio.context";

const CommentScreen = ({ setCommentsVisible, songId }) => {
  const { addComment, isLoading, loadComments } = useContext(CommentContext);
  const { currentSong } = useContext(AudioContext);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    (async () => {
      const list = await loadComments(songId);
      setComments(list);
    })();
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
              // >{`${comments.length} Comments`}</Text>
            >{`Comment`}</Text>
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
                {currentSong.name}
              </Text>
              <Text style={styles.artis}>{currentSong.artistString}</Text>
            </View>
          </View>
        </View>
        {isLoading == true ? (
          <ActivityIndicator size={40} style={{ flex: 1 }}></ActivityIndicator>
        ) : (
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {comments.map((item, index) => {
              return <Comment key={index} comment={item} songId={songId} />;
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
