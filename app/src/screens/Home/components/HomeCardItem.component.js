import React, { useState, useEffect, useContext, useMemo, memo } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Dimensions,
} from "react-native";
import COLORS from "../../../consts/colors";
import { Ionicons } from "@expo/vector-icons";
import { formatTime } from "../../../utils/TimeFormater";

const { width } = Dimensions.get("screen");

const HomeCardItemComponent = ({ song = {} }) => {
  return (
    <View activeOpacity={0.8}>
      <ImageBackground
        style={styles.cardImage}
        source={{
          uri: song.imageUri == "" ? LinkImg : song.imageUri,
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 10,
            textShadowColor: "#060606",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
          }}
        >
          {song.name}
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="person-circle-outline" size={20} color="white" />
            <Text style={{ marginLeft: 5, color: "white", fontSize: 17 }}>
              {song.artistString}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="md-timer-outline" size={20} color="white" />
            <Text style={{ marginLeft: 5, color: "white", fontSize: 17 }}>
              {formatTime(song.duration)}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  cardImage: {
    height: 220,
    width: width / 2,
    marginRight: 20,
    padding: 10,
    overflow: "hidden",
    borderRadius: 10,
  },
});

export default memo(HomeCardItemComponent);
