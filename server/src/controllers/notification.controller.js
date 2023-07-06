const db = require("../db");

const notificationRef = db.collection("notifications");

exports.saveNotification = async (notification) => {
  try {
    await notificationRef.add(notification);
  } catch (err) {
    console.log("Error when saving notification:", err);
  }
};
