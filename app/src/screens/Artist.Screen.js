import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { fontSizes } from "../theme/fontSizes";
import { Spacer } from "../components/spacer";
import { Ionicons } from "@expo/vector-icons";
import { AudioContext } from "../providers/audio.context";

import SongItem from "./MusicPlayer/components/SongItem.component";
import { AuthenticationContext } from "../providers/authentication.context";
import { ArtistContext } from "../providers/artist.context";
const ArtistScreen = ({ navigation, artist = {}, setModalVisible }) => {
  const { songs } = useContext(AudioContext);
  const { user } = useContext(AuthenticationContext);
  const { followedArtistIds, checkIfFollowed, toggleFollowing } =
    useContext(ArtistContext);
  const [artistSongs, setArtistSongs] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  useEffect(() => {
    const filteredSongs = songs.filter((song) => {
      return song.artist.some((artistObj) => artistObj.id === artist.id);
    });
    // lấy bài hát của nhạc sĩ
    setArtistSongs(filteredSongs);
  }, []);

  useEffect(() => {
    const res = checkIfFollowed(artist.id);
    setIsFollowed(res);
  }, [followedArtistIds.length]);

  const toggleFollowingArtist = async () => {
    await toggleFollowing(artist.id, user.userId);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
          }}
          style={{ paddingLeft: 8, paddingRight: 4 }}
        >
          <Ionicons name="chevron-back" size={32} color="black" />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            marginRight: 36,
          }}
        >
          <Text style={styles.heading}>Profile</Text>
        </View>
      </View>
      <View style={styles.userInfo}>
        <TouchableOpacity>
          {artist.avtUri == "" ? (
            <Image
              style={styles.avatar}
              source={require("../../assets/DefaultAvatar.jpg")}
            ></Image>
          ) : (
            <Image
              style={styles.avatar}
              source={{ uri: artist.avtUri }}
            ></Image>
          )}
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: 500,
            paddingLeft: 12,
            fontSize: fontSizes.label,
          }}
        >
          {artist.name}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          paddingLeft: 24,
          marginTop: 12,
          marginBottom: 60,
        }}
      >
        <View style={styles.follow}>
          <Text style={styles.followText}>
            {artist.followers != null ? artist.followers.length : 0}
          </Text>
          <Text style={styles.followText}> Follower</Text>
        </View>
        <TouchableOpacity
          onPress={toggleFollowingArtist}
          style={{
            padding: 8,
            width: 100,
            borderRadius: 4,
            marginRight: 8,
            backgroundColor: "tomato",
            position: "absolute",
            alignItems: "center",
            bottom: 0,
            right: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              fontWeight: 500,
              textAlign: "left",
            }}
          >
            {isFollowed ? "Unfollow" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <Text style={styles.title}>Songs</Text>
        <FlatList
          data={artistSongs}
          renderItem={({ item, index }) => (
            <SongItem navigation={navigation} songIndex={index} song={item} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default ArtistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    height: 60,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  heading: {
    fontSize: fontSizes.heading3,
    fontWeight: 500,
    textAlign: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 2,
  },
  userInfo: {
    width: "100%",
    flexDirection: "row",
    marginTop: 40,
    paddingLeft: 24,
    alignItems: "center",
  },
  follow: {
    flexDirection: "row",
  },
  followText: {
    fontWeight: 400,
    fontSize: fontSizes.normalTextSize,
  },
  title: {
    marginLeft: 20,
    fontSize: fontSizes.label,
    fontWeight: 500,
  },
});
