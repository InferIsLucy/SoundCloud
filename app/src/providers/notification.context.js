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
const notificationRef = firebase.firestore().collection("notifications");
const NEW_MESSAGE_TITLE = "New message";
const NotificationContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(UserContext);
  const notificationListener = useRef();
  const [notifications, setNotifications] = useState([]);
  const responseListener = useRef();
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
    userId,
    message,
    title = NEW_MESSAGE_TITLE
  ) => {
    if (user.expoNotifyToken != token) {
      try {
        await NotificationApi.sendNotification(token, userId, title, message);
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
        Notifications.addNotificationReceivedListener(async (notification) => {
          try {
            // const title = notification.request.content.title;
            // const body = notification.request.content.body;
            // const userId = user.userId;
            // await NotificationApi.saveNotification(userId, title, body);

            const updatedNotifications = await loadNotifications(user.userId);
            setNotifications(updatedNotifications);

            console.log("saved notification");
          } catch (er) {
            console.log(er);
          }
        });
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {});

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const res = await loadNotifications(user.userId);
        console.log("res", res.length);
        setNotifications(res);
      })();
    }
  }, [isAuthenticated]);

  const loadNotifications = async (userId, limit) => {
    try {
      let query = notificationRef.where("userId", "==", userId);
      if (limit) {
        query = query.limit(limit);
      }
      const querySnapshot = await query.get();
      const notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // descending
      notifications.sort((a, b) => b.date.toMillis() - a.date.toMillis());
      return notifications;
    } catch (err) {
      console.log("Error when loading notifications:", err);
      return [];
    }
  };

  const markAsSeenNotifications = async () => {
    try {
      const querySnapshot = await notificationRef
        .where("userId", "==", user.userId)
        .where("read", "==", false)
        .get();
      const batch = firebase.firestore().batch();
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();

      const updatedNotifications = await loadNotifications(user.userId);
      setNotifications(() => updatedNotifications);
    } catch (err) {
      console.log("Error when marking notifications as seen:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        sendNotification,
        markAsSeenNotifications,
        sendNotificationToListUser,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
export default memo(NotificationContextProvider);
