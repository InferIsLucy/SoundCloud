import axiosClient from "./axiosClient";

export const NotificationApi = {
  sendNotification: async (token, title, message) => {
    return await axiosClient.post("/notify", {
      token,
      message,
      title,
    });
  },
};
