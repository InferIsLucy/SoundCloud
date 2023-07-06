const db = require("../db");

const notificationRef = db.collection("notifications");

exports.saveNotificationToDb = async (notification) => {
  try {
    await notificationRef.add(notification);
    console.log("saved - userId", notification.userId);
  } catch (err) {
    console.log("Error when saving notification:", err);
  }
};
