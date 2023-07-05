import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext, memo, useEffect } from "react";
import styles from "./CommentScr.component.style";
import { AntDesign } from "@expo/vector-icons";

import Comment from "./comment/index";
import Footer from "./footer/index";
import { CommentContext } from "../../providers/comment.context";
import { AudioContext } from "../../providers/audio.context";
import BottomMenu from "./components/BottomMenu.component";

const CommentScreen = ({ setCommentsVisible }) => {
  const { addComment, isLoading, loadComments } = useContext(CommentContext);

  const { currentSong } = useContext(AudioContext);
  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isBottomMenuVisible, setBottomMenuVisible] = useState(false);
  useEffect(() => {
    (async () => {
      const list = await loadComments(currentSong.id);
      setComments(list);
    })();
  }, []);
  return (
    <View
      style={
        isBottomMenuVisible
          ? [styles.container, { opacity: 0.5 }]
          : styles.container
      }
    >
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
                source={{ uri: currentSong.imageUri }}
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
              return (
                <Comment
                  key={index}
                  setBottomMenuVisible={setBottomMenuVisible}
                  setSelectedComment={setSelectedComment}
                  comment={item}
                  songId={currentSong.id}
                />
              );
            })}
          </ScrollView>
        )}
      </View>
      <View style={styles.footer}>
        <Footer setComments={setComments} songId={currentSong.id} />
      </View>
      <BottomMenu
        setComments={setComments}
        selectedComment={selectedComment}
        visible={isBottomMenuVisible}
        onClose={() => {
          setBottomMenuVisible(false);
        }}
      ></BottomMenu>
    </View>
  );
};

export default memo(CommentScreen);
