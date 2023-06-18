import axiosClient from "./axiosClient";

export const NotificationApi = {
  sendNotification: async (token, title, message) => {
    return await axiosClient.post("/notify", {
      token,
      message,
      title,
    });
  },
  sendNotificationToUserList: async (tokenList, title, message) => {
    return await axiosClient.post("/notifyToUsers", {
      tokenList,
      message,
      title,
    });
  },
};
