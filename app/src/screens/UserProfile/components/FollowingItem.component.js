import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "../../../theme/color";
import { ArtistContext } from "../../../providers/artist.context";
import { AuthenticationContext } from "../../../providers/authentication.context";
const FollowingItem = ({ artist = {} }) => {
  const { toggleFollowing, followedArtistIds, checkIfFollowed } =
    useContext(ArtistContext);
  const { user } = useContext(AuthenticationContext);
  const [isFollowed, setIsFollowed] = useState(true);
  useEffect(() => {
    const res = checkIfFollowed(artist.id);
    setIsFollowed(res);
  }, [followedArtistIds.length]);
  const toggleFollowingArtist = async () => {
    await toggleFollowing(artist.id, user.userId);
  };
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: artist.avtUri,
        }}
        style={styles.img}
      ></Image>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 16, color: "white", fontWeight: 500 }}>
          {artist.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name="user-alt" size={12} color="white" />
          <Text style={{ color: "#cac5e5", marginLeft: 4 }}>
            {artist.followers ? artist.followers.length : 0} {"Follower"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={toggleFollowingArtist}
        style={{
          padding: 4,
          backgroundColor: "white",
          borderRadius: 4,
          minWidth: 100,
        }}
      >
        <Text style={{ textAlign: "center", color: "#cac5e5" }}>
          {" "}
          {isFollowed ? "Unfollow" : "Follow"}{" "}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FollowingItem;

const styles = StyleSheet.create({
  container: {
    height: 88,
    backgroundColor: Colors.authBackground,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
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
  img: { borderRadius: 120, width: 100, height: 100, resizeMode: "cover" },
});
