import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
const FollowingItem = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://scontent.fsgn13-4.fna.fbcdn.net/v/t39.30808-6/345233585_3487344644926329_8037647308456647249_n.jpg?stp=dst-jpg_s600x600&_nc_cat=110&ccb=1-7&_nc_sid=730e14&_nc_ohc=VbpDJyKRgJQAX9ENQew&_nc_ht=scontent.fsgn13-4.fna&oh=00_AfCmPytdWUlbad82ZV66FR1hC5HftsYHUBs251YtDTypeg&oe=645B8F2C",
        }}
        style={styles.img}
      ></Image>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 16, color: "white", fontWeight: 500 }}>
          Phương Ly
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5 name="user-alt" size={12} color="white" />
          <Text style={{ color: "#cac5e5", marginLeft: 4 }}>
            100K Followers
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          padding: 4,
          backgroundColor: "white",
          borderRadius: 4,
          minWidth: 100,
        }}
      >
        <Text style={{ textAlign: "center", color: "#cac5e5" }}>Following</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FollowingItem;

const styles = StyleSheet.create({
  container: {
    height: 88,
    backgroundColor: "#231b4d",
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
  img: { borderRadius: 50, width: 40, height: 40, resizeMode: "cover" },
});
