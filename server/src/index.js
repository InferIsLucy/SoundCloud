const express = require("express");
require("dotenv").config();
const app = express();
const sendNotification = require("./notification");
const notificationController = require("./controllers/notification.controller");
app.use(express.json());

app.post("/notify", (req, res) => {
  const { token, title, message } = req.body;
  console.log({ token, message });
  if (token != null) {
    sendNotification(token, title, message);
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
});

app.post("/notifyToUsers", (req, res) => {
  const { userData, title, message } = req.body;
  console.log("userData", userData);
  if (title != null && message != null) {
    userData.forEach((data) => {
      const { notificationToken, userId } = data;
      const notification = {
        title,
        message,
        date: new Date(),
        userId: userId,
        read: false,
      };
      sendNotification(notificationToken, title, message);
      notificationController.saveNotificationToDb(notification);
    });
    res.json({
      message: "success",
    });
  } else {
    res.json({
      message: "failed",
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
