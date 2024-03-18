const Chats = require("../models/Chats");
const { get } = require("../routes/Message");

const addMsg = async (req, res, next) => {
  let { From, to, message } = req.body;
  
  // Remove "+91" and any spaces from From and to
  From = From.replace("+91", "").replace(/\s/g, "");
  to = to.replace("+91", "").replace(/\s/g, "");

  ////////console.log(From, to, message);

  try {
    const data = await Chats.create({
      message: { text: message },
      users: [From, to],
      sender: From,
    });
    ////////console.log(data);
    if (data) return res.json({ msg: "Message added successfully." });
    return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};


const getMsg = async (req, res, next) => {
  ////////console.log("getting messages.......");
  try {
    let { From, to } = req.body;
  From = From.replace("+91", "").replace(/\s/g, "");
  to = to.replace("+91", "").replace(/\s/g, "");

    //////console.log(From , to);
    const messages = await Chats
      .find({
         users: { $all: [From, to] }
      })
      .sort({ updatedAt: 1 });
      // ////////console.log(messages);
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender === From,
        message: msg.message.text,
      };
    });
    res.json(projectMessages);
  } catch (ex) {
    console.error("Error while fetching messages:", ex);
    res.status(500).json({ success: false, error: "Server error" });
  }
};


exports.addMsg = addMsg;
exports.getMsg = getMsg;
