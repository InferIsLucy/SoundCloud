import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";
import { Entypo } from "@expo/vector-icons";
const dayjs = require("dayjs");
const NotificationItem = ({ notification }) => {
  return (
    <TouchableOpacity style={styles.notificationContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text numberOfLines={1} style={styles.title}>
          {notification.title}
        </Text>
        <Text numberOfLines={1} style={styles.date}>
          {dayjs(notification.date.toDate()).format("HH:mm" + " -" + "DD/MM")}
        </Text>
        {notification.read == false && (
          <Entypo name="dot-single" size={15} color="#898989" />
        )}
      </View>
      <Text style={styles.message}>{notification.message}</Text>
    </TouchableOpacity>
  );
};
export default memo(NotificationItem);

const styles = StyleSheet.create({
  notificationContainer: {
    minHeight: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
  },
  message: {
    fontSize: 15,
  },
  date: {
    marginLeft: 12,
    color: "gray",
    fontSize: 14,
  },
});
