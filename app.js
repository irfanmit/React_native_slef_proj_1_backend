const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const port = 8000;
const cors = require("cors");
var bodyParser = require("body-parser");
const server = http.createServer(app);
const io = require("socket.io")(server);
const { Expo } = require("expo-server-sdk");
const multer = require('multer')
require('dotenv').config();


//model
const User = require('./models/User')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


console.log(process.env.MONGO_URI);
console.log(process.env.PORT);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/auth", require('./middleware/isAuth'))

global.onlineUsers = new Map();

let expo = new Expo();
let messages = [];

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (mobileNo) => {
    onlineUsers.set(mobileNo.replace("+91", "").replace(/\s/g, ""), socket.id);
  });

  socket.emit("welcome", "Welcome to the Socket.io server!");

  socket.on("send-msg", async (data) => {
    console.log("arrival message data : ", data);

    const reciverNo =  data.to.replace("+91", "").replace(/\s/g, "");
    const senderNo = data.from.replace("+91", "").replace(/\s/g, "");


    const recieverResult = await User.find({mobileNo : reciverNo})
    console.log("recieverResult ", recieverResult);
    const reciverExpoPushToken = recieverResult[0].expoPushToken;

    const senderResult = await User.findOne({ mobileNo: senderNo });
if (!senderResult) {
  console.error(`Sender with mobile number ${senderNo} not found.`);
  // Handle the error, such as returning an error response or throwing an exception
  return;
}
console.log(senderResult);
const senderName = senderResult.Name; // Corrected key usage

console.log('Sender:', senderName);


    const sendUserSocket = onlineUsers.get(
      data.to.replace("+91", "").replace(/\s/g, "")
    );
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    } else {
      messages.push({
        to: reciverExpoPushToken,
        sound: "default",
        body: `1 new message from ${senderName}`,
        data: { withSome: data.message },
      });
      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
          } catch (error) {
            console.error(error);
          }
        }
      })();
    }
  });
});

app.use("/", require('./routes/imageUploadRouter'))
app.use("/", require("./routes/Authentication"));
app.use("/", require("./routes/Message"));
app.use("/User", require("./routes/to_do"));

server.listen(port, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});

// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true
//   }
// });
