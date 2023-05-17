import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

const ItemPlayList = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image
        source={{
          uri: "https://images2.thanhnien.vn/528068263637045248/2023/5/10/iu-1683710624038576717966.png",
        }}
        style={styles.img}
      ></Image>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 16, color: "white", fontWeight: 500 }}>
          Save your tears
        </Text>
        <Text style={{ color: "#cac5e5" }}>The weeknd</Text>
      </View>
      <Text style={{ color: "#cac5e5" }}>5:43</Text>
    </TouchableOpacity>
  );
};

export default ItemPlayList;

const styles = StyleSheet.create({
  container: {
    height: 88,
    backgroundColor: "#231b4d",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
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
