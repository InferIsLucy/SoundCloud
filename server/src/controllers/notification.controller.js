const db = require("../db");
const sendNotification = require("../notification");
const notificationRef = db.collection("notifications");

const saveNotificationToDb = async (notification) => {
  try {
    await notificationRef.add(notification);
    console.log("saved - userId", notification.userId);
  } catch (err) {
    console.log("Error when saving notification:", err);
  }
};

exports.saveNotification = async (req, res) => {
  const { userId, title, message } = req.body;
  console.log({ message });
  try {
    const notification = {
      title,
      message,
      date: new Date(),
      userId: userId,
      read: false,
    };
    await saveNotificationToDb(notification);
    res.json({
      message: "success",
      data: {
        message,
      },
    });
  } catch (er) {
    res.json({
      message: "failed",
    });
  }
};

exports.notificationToUsers = async (req, res) => {
  const { userData, title, message } = req.body;
  console.log("userData", userData);
  if (title != null && message != null) {
    for (const data of userData) {
      const { notificationToken, userId } = data;
      const notification = {
        title,
        message,
        date: new Date(),
        userId: userId,
        read: false,
      };
      sendNotification(notificationToken, title, message);
      await saveNotificationToDb(notification);
    }
    res.json({
      message: "success",
    });
  } else {
    res.json({
      message: "failed",
    });
  }
};

exports.notify = async (req, res) => {
  const { token, userId, title, message } = req.body;
  console.log({ token, message });
  if (token != null) {
    sendNotification(token, title, message);
    const notification = {
      title,
      message,
      date: new Date(),
      userId: userId,
      read: false,
    };
    await saveNotificationToDb(notification);
    res.json({
      message: "success",
      data: {
        token,
        message,
      },
    });
  } else {
    res.json({
      message: "failed",
    });
  }
};
