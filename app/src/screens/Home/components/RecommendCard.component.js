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

const RecommendCard = ({ song }) => {
  return (
    <ImageBackground
      style={styles.rmCard}
      source={{
        uri: song.imageUri == "" ? null : song.imageUri,
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
          alignItems: "flex-end",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            marginTop: 120,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="person-circle-outline" size={20} color="white" />
            <Text style={{ marginLeft: 5, color: "white", fontSize: 17 }}>
              {song.artistString}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Ionicons name="md-timer-outline" size={20} color="white" />
            <Text style={{ marginLeft: 5, color: "white", fontSize: 17 }}>
              {formatTime(song.duration)}
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  rmCard: {
    width: width - 40,
    height: 200,
    marginRight: 20,
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
});

export default memo(RecommendCard);
