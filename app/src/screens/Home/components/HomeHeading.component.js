import React, { useState, useEffect, useContext, useMemo, memo } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NotificationContext } from "../../../providers/notification.context";
import NotificationItem from "./NotificationItem.component";
const { width } = Dimensions.get("screen");

const Heading = ({ notificationNumber = 0, avatar }) => {
  const { notifications, markAsSeenNotifications } =
    useContext(NotificationContext);
  const [show, setShow] = useState(false);
  const [unReadNotificationNumber, setUnReadNotificationNumber] = useState(0);
  useEffect(() => {
    setUnReadNotificationNumber(notifications.filter((n) => !n.read).length);
  }, [notifications]);
  const markAsSeen = async () => {
    await markAsSeenNotifications();
    setUnReadNotificationNumber(0);
  };
  const showNotifications = () => {
    setShow((prev) => !prev);
    markAsSeen();
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}></View>
      <TouchableOpacity onPress={showNotifications}>
        <Feather name="bell" size={28} color="white" />
        {unReadNotificationNumber != 0 && (
          <View style={styles.notificationNumberWrapper}>
            <Text style={styles.notificationNumber}>
              {unReadNotificationNumber}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {show && notifications.length != 0 && (
        <ScrollView
          nestedScrollEnabled={true}
          style={styles.listNotificationContainer}
        >
          {notifications.map((item, index) => {
            console.log("Item", item.message);
            return (
              <NotificationItem
                key={`as+message ${index}`}
                notification={item}
              ></NotificationItem>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  avatar: {
    width: 36,
    height: 36,
    marginLeft: 12,
    borderRadius: 25,
  },
  container: {
    flexDirection: "row",
    height: 80,
    zIndex: 1,
    width: "100%",
    alignItems: "center",
  },
  listNotificationContainer: {
    position: "absolute",
    width: 240,
    borderRadius: 15,
    backgroundColor: "white",
    top: 60,
    padding: 4,
    zIndex: 4,
    right: -4,
    maxHeight: 180,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationNumberWrapper: {
    position: "absolute",
    backgroundColor: "white",
    paddingHorizontal: 6,
    bottom: -8,
    right: -4,
    borderRadius: 25,
  },
  notificationNumber: {
    color: "red",
    fontWeight: "bold",
  },
});

export default memo(Heading);
