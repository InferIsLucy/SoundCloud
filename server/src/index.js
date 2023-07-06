const express = require("express");
require("dotenv").config();
const app = express();
const notificationController = require("./controllers/notification.controller");

app.use(express.json());

app.post("/notify", notificationController.notify);
app.post("/notifyToUsers", notificationController.notificationToUsers);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
