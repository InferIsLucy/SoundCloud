const express = require("express");
require("dotenv").config();
const app = express();
const sendNotification = require("./notification");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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
  const { tokenList, title, message } = req.body;
  console.log("tokenList", tokenList);
  if (title != null && message != null) {
    tokenList.forEach((token) => {
      sendNotification(token, title, message);
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
