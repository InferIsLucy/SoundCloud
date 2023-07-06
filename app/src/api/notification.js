import axiosClient from "./axiosClient";

export const NotificationApi = {
  sendNotification: async (token, userId, title, message) => {
    return await axiosClient.post("/notify", {
      token,
      userId,
      message,
      title,
    });
  },
  //{notifyToken n userId}
  sendNotificationToUserList: async (userData, title, message) => {
    return await axiosClient.post("/notifyToUsers", {
      userData,
      message,
      title,
    });
  },
  saveNotification: async (userId, title, message) => {
    return await axiosClient.post("/saveNotification", {
      userId,
      message,
      title,
    });
  },
};
