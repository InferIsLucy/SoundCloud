import React, {
  useEffect,
  useState,
  createContext,
  useRef,
  useContext,
  memo,
} from "react";
import { firebase } from "../config/firebase";
import { UserContext } from "./user.context";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { NotificationApi } from "../api/notification";
import { AudioContext } from "./audio.context";

export const NotificationContext = createContext();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const usersRef = firebase.firestore().collection("users");
const NEW_MESSAGE_TITLE = "New message";
const NotificationContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(UserContext);
  const notificationListener = useRef();
  const responseListener = useRef();
  console.log("Notification Context");
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }
  const sendNotification = async (
    token,
    message,
    title = NEW_MESSAGE_TITLE
  ) => {
    if (user.expoNotifyToken != token) {
      try {
        await NotificationApi.sendNotification(token, title, message);
      } catch (err) {
        console.log("error when send notification", err);
      }
    }
  };
  const sendNotificationToListUser = async (tokenList, title, message) => {
    try {
      await NotificationApi.sendNotificationToUserList(
        tokenList,
        title,
        message
      );
    } catch (err) {
      console.log("error when send notification", err);
    }
  };
  const saveUserExpoPushToken = (token) => {
    usersRef
      .where("userId", "==", user.userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          usersRef
            .doc(doc.id)
            .update({
              expoNotifyToken: token,
            })
            .then(() => {
              console.log("User updated!");
            })
            .catch((err) => {
              console.log("Error while updating user information:", err);
            });
        });
      })
      .catch((err) => {
        console.log("Error while querying users:", err);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotificationsAsync().then((token) =>
        saveUserExpoPushToken(token)
      );
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {});
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [isAuthenticated]);
  return (
    <NotificationContext.Provider
      value={{ sendNotification, sendNotificationToListUser }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
export default memo(NotificationContextProvider);
